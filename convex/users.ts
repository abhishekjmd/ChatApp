import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ONLINE_WINDOW_MS = 35_000;

function createConversationId(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort().join("::");
}

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

    const allUsers = await ctx.db.query("users").collect();
    const otherUsers = allUsers.filter((user) => user.clerkId !== currentUserId);

    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
      .collect();

    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", currentUserId))
      .collect();

    const conversationStats = new Map<
      string,
      {
        lastMessagePreview: string;
        lastMessageTime: number;
        unreadCount: number;
      }
    >();

    for (const message of [...sentMessages, ...receivedMessages]) {
      const otherUserId =
        message.senderId === currentUserId ? message.recipientId : message.senderId;

      const currentStats = conversationStats.get(otherUserId) ?? {
        lastMessagePreview: "",
        lastMessageTime: 0,
        unreadCount: 0,
      };

      if (message._creationTime >= currentStats.lastMessageTime) {
        currentStats.lastMessagePreview = message.body;
        currentStats.lastMessageTime = message._creationTime;
      }

      if (
        message.senderId === otherUserId &&
        message.recipientId === currentUserId &&
        !message.readBy.includes(currentUserId)
      ) {
        currentStats.unreadCount += 1;
      }

      conversationStats.set(otherUserId, currentStats);
    }

    const usersWithMeta = otherUsers
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
        const stats = conversationStats.get(user.clerkId);
        const avatar = buildAvatarUrl(user.imageUrl, user.name, user.email);

        return {
          id: user.clerkId,
          name: user.name,
          email: user.email ?? "",
          avatar,
          conversationId: createConversationId(currentUserId, user.clerkId),
          lastMessagePreview: stats?.lastMessagePreview ?? "No messages yet",
          lastMessageTime: stats?.lastMessageTime ?? 0,
          unreadCount: stats?.unreadCount ?? 0,
          isOnline: now - user.lastSeen < ONLINE_WINDOW_MS,
        };
      })
      .sort((a, b) => {
        if (b.lastMessageTime !== a.lastMessageTime) {
          return b.lastMessageTime - a.lastMessageTime;
        }

        return a.name.localeCompare(b.name);
      });

    return usersWithMeta;
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
          conversationId: isCurrentUser
            ? undefined
            : createConversationId(currentUserId, user.clerkId),
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
