import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const REACTION_EMOJIS = new Set(["👍", "❤️", "😂", "😮", "😢"]);

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

export const list = query({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", identity.subject),
      )
      .unique();

    if (!membership) {
      return [];
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", identity.subject),
      )
      .unique();

    if (!membership) {
      throw new Error("Forbidden");
    }

    const trimmedBody = args.body.trim();
    if (!trimmedBody) {
      throw new Error("Message body is required");
    }

    const senderProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const senderName =
      nonEmptyString(senderProfile?.name) ??
      nonEmptyString(identity.name) ??
      nonEmptyString(
        [nonEmptyString(identity.givenName), nonEmptyString(identity.familyName)]
          .filter(Boolean)
          .join(" "),
      ) ??
      nameFromEmail(nonEmptyString(senderProfile?.email) ?? nonEmptyString(identity.email)) ??
      "User";

    const senderAvatar =
      nonEmptyString(senderProfile?.imageUrl) ??
      (typeof identity.pictureUrl === "string" && identity.pictureUrl.length > 0
        ? identity.pictureUrl
        : undefined);

    return await ctx.db.insert("messages", {
      body: trimmedBody,
      senderId: identity.subject,
      senderName,
      senderAvatar,
      recipientId: undefined,
      conversationId: args.conversationId,
      readBy: [identity.subject],
      reactions: [],
    });
  },
});

export const deleteOwn = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== identity.subject) {
      throw new Error("Forbidden");
    }

    if (message.deletedAt) {
      return false;
    }

    await ctx.db.patch(args.messageId, {
      deletedAt: Date.now(),
      deletedBy: identity.subject,
    });

    return true;
  },
});

export const editOwn = mutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== identity.subject) {
      throw new Error("Forbidden");
    }

    if (message.deletedAt) {
      throw new Error("Cannot edit deleted message");
    }

    const trimmedBody = args.body.trim();
    if (!trimmedBody) {
      throw new Error("Message body is required");
    }

    await ctx.db.patch(args.messageId, {
      body: trimmedBody,
      editedAt: Date.now(),
    });

    return true;
  },
});

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!REACTION_EMOJIS.has(args.emoji)) {
      throw new Error("Unsupported reaction");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", message.conversationId).eq("userId", identity.subject),
      )
      .unique();

    if (!membership) {
      throw new Error("Forbidden");
    }

    if (message.deletedAt) {
      throw new Error("Cannot react to deleted messages");
    }

    const currentReactions = message.reactions ?? [];
    const existingIndex = currentReactions.findIndex(
      (entry) => entry.emoji === args.emoji && entry.userId === identity.subject,
    );

    const updatedReactions =
      existingIndex >= 0
        ? currentReactions.filter((_, index) => index !== existingIndex)
        : [...currentReactions, { emoji: args.emoji, userId: identity.subject }];

    await ctx.db.patch(args.messageId, {
      reactions: updatedReactions,
    });

    return updatedReactions.length;
  },
});

export const markAsRead = mutation({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", identity.subject),
      )
      .unique();

    if (!membership) {
      throw new Error("Forbidden");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    let patched = 0;

    for (const message of messages) {
      if (message.senderId === identity.subject) {
        continue;
      }

      if (message.readBy.includes(identity.subject)) {
        continue;
      }

      await ctx.db.patch(message._id, {
        readBy: [...message.readBy, identity.subject],
      });
      patched += 1;
    }

    return patched;
  },
});
