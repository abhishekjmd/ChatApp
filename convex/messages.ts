import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();

    return messages;
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    conversationId: v.string(),
    recipientId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
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
      recipientId: args.recipientId,
      conversationId: args.conversationId,
      readBy: [identity.subject],
    });
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

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    let patched = 0;

    for (const message of messages) {
      if (message.recipientId !== identity.subject) {
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
