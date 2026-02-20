import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

    const senderName =
      typeof identity.name === "string" && identity.name.length > 0
        ? identity.name
        : typeof identity.givenName === "string" && identity.givenName.length > 0
          ? identity.givenName
          : "User";

    const senderAvatar =
      typeof identity.pictureUrl === "string" && identity.pictureUrl.length > 0
        ? identity.pictureUrl
        : undefined;

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
