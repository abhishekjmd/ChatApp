import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_CONVERSATION_ID = "general";

export const list = query({
  args: {
    conversationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const conversationId = args.conversationId ?? DEFAULT_CONVERSATION_ID;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("asc")
      .collect();

    return messages;
  },
});

export const send = mutation({
  args: {
    body: v.string(),
    conversationId: v.optional(v.string()),
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
      conversationId: args.conversationId ?? DEFAULT_CONVERSATION_ID,
    });
  },
});
