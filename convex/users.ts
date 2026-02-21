import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const ONLINE_WINDOW_MS = 35_000;

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function nameFromEmail(email?: string) {
  const safeEmail = nonEmptyString(email);
  if (!safeEmail) {
    return undefined;
  }

  const localPart = safeEmail.split("@")[0];
  if (!localPart) {
    return undefined;
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveDisplayName({
  clientName,
  identityName,
  identityGivenName,
  identityFamilyName,
  clientEmail,
  identityEmail,
}: {
  clientName?: string;
  identityName?: string;
  identityGivenName?: string;
  identityFamilyName?: string;
  clientEmail?: string;
  identityEmail?: string;
}) {
  const directName =
    nonEmptyString(clientName) ??
    nonEmptyString(identityName) ??
    [nonEmptyString(identityGivenName), nonEmptyString(identityFamilyName)]
      .filter(Boolean)
      .join(" ")
      .trim();

  if (directName) {
    return directName;
  }

  return nameFromEmail(clientEmail) ?? nameFromEmail(identityEmail) ?? "User";
}

function buildAvatarUrl(imageUrl: string | undefined, name: string, email?: string) {
  if (imageUrl) {
    return imageUrl;
  }

  const seed = encodeURIComponent(name !== "User" ? name : (nameFromEmail(email) ?? "User"));
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=10b77f`;
}

export const upsertCurrent = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const name = resolveDisplayName({
      clientName: args.name,
      identityName: identity.name,
      identityGivenName: identity.givenName,
      identityFamilyName: identity.familyName,
      clientEmail: args.email,
      identityEmail: identity.email,
    });

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const payload = {
      name,
      email:
        nonEmptyString(args.email) ??
        (typeof identity.email === "string" ? identity.email : undefined),
      imageUrl:
        nonEmptyString(args.imageUrl) ??
        (typeof identity.pictureUrl === "string" && identity.pictureUrl.length > 0
          ? identity.pictureUrl
          : undefined),
      lastSeen: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      ...payload,
    });
  },
});

export const listForSidebar = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const currentUserId = identity.subject;
    const now = Date.now();
    const searchTerm = (args.search ?? "").trim().toLowerCase();
    const users = await ctx.db.query("users").collect();
    const userById = new Map(users.map((user) => [user.clerkId, user]));

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .collect();

    const sidebarItems = await Promise.all(
      memberships.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId as Id<"conversations">);
        if (!conversation) {
          return null;
        }

        const members = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversation", (q) => q.eq("conversationId", membership.conversationId))
          .collect();

        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", membership.conversationId))
          .collect();

        let lastMessagePreview = "No messages yet";
        let lastMessageTime = 0;
        let unreadCount = 0;

        for (const message of messages) {
          if (message._creationTime >= lastMessageTime) {
            lastMessageTime = message._creationTime;
            lastMessagePreview = message.deletedAt ? "This message was deleted" : message.body;
          }

          if (message.senderId !== currentUserId && !message.readBy.includes(currentUserId)) {
            unreadCount += 1;
          }
        }

        if (conversation.type === "group") {
          const groupName = nonEmptyString(conversation.name) ?? "Untitled Group";
          const groupAvatar = buildAvatarUrl(conversation.imageUrl, groupName);
          const searchable = `${groupName}`.toLowerCase();

          if (searchTerm && !searchable.includes(searchTerm)) {
            return null;
          }

          return {
            id: membership.conversationId,
            name: groupName,
            email: "",
            avatar: groupAvatar,
            conversationId: membership.conversationId,
            conversationType: "group" as const,
            memberCount: members.length,
            otherUserId: undefined,
            lastMessagePreview,
            lastMessageTime,
            unreadCount,
            isOnline: false,
          };
        }

        const otherMember = members.find((member) => member.userId !== currentUserId);
        if (!otherMember) {
          return null;
        }

        const otherUser = userById.get(otherMember.userId);
        const directName = otherUser?.name ?? "Unknown User";
        const directEmail = otherUser?.email ?? "";
        const searchable = `${directName} ${directEmail}`.toLowerCase();

        if (searchTerm && !searchable.includes(searchTerm)) {
          return null;
        }

        return {
          id: membership.conversationId,
          name: directName,
          email: directEmail,
          avatar: buildAvatarUrl(otherUser?.imageUrl, directName, directEmail),
          conversationId: membership.conversationId,
          conversationType: "direct" as const,
          memberCount: members.length,
          otherUserId: otherMember.userId,
          lastMessagePreview,
          lastMessageTime,
          unreadCount,
          isOnline: typeof otherUser?.lastSeen === "number" && now - otherUser.lastSeen < ONLINE_WINDOW_MS,
        };
      }),
    );

    return sidebarItems
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .concat(
        users
          .filter((user) => user.clerkId !== currentUserId)
          .filter((user) =>
            !sidebarItems.some(
              (item) => item && item.conversationType === "direct" && item.otherUserId === user.clerkId,
            ),
          )
          .map((user) => {
            const directName = user.name;
            const directEmail = user.email ?? "";
            const searchable = `${directName} ${directEmail}`.toLowerCase();

            if (searchTerm && !searchable.includes(searchTerm)) {
              return null;
            }

            return {
              id: `direct-pending::${user.clerkId}`,
              name: directName,
              email: directEmail,
              avatar: buildAvatarUrl(user.imageUrl, directName, directEmail),
              conversationId: `direct-pending::${user.clerkId}`,
              conversationType: "direct" as const,
              memberCount: 2,
              otherUserId: user.clerkId,
              lastMessagePreview: "Start a conversation",
              lastMessageTime: 0,
              unreadCount: 0,
              isOnline: now - user.lastSeen < ONLINE_WINDOW_MS,
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      )
      .sort((a, b) => {
        if (b.lastMessageTime !== a.lastMessageTime) {
          return b.lastMessageTime - a.lastMessageTime;
        }

        return a.name.localeCompare(b.name);
      });
  },
});

export const browseDirectory = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const currentUserId = identity.subject;
    const now = Date.now();
    const searchTerm = (args.search ?? "").trim().toLowerCase();

    const users = await ctx.db.query("users").collect();

    return users
      .filter((user) => {
        if (!searchTerm) {
          return true;
        }

        return (
          user.name.toLowerCase().includes(searchTerm) ||
          (user.email ?? "").toLowerCase().includes(searchTerm)
        );
      })
      .map((user) => {
        const isCurrentUser = user.clerkId === currentUserId;
        const avatar = buildAvatarUrl(user.imageUrl, user.name, user.email);

        return {
          id: user.clerkId,
          name: user.name,
          email: user.email ?? "",
          avatar,
          isCurrentUser,
          isOnline: now - user.lastSeen < ONLINE_WINDOW_MS,
          conversationId: undefined,
        };
      })
      .sort((a, b) => {
        if (a.isCurrentUser !== b.isCurrentUser) {
          return a.isCurrentUser ? -1 : 1;
        }

        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
  },
});
