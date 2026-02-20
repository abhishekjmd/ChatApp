import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const TYPING_TTL_MS = 3_000;

export const set = mutation({
  args: {
    conversationId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("typingStates")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", identity.subject),
      )
      .unique();

    if (!args.isTyping) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }
      return null;
    }

    const userName =
      typeof identity.name === "string" && identity.name.length > 0
        ? identity.name
        : typeof identity.givenName === "string" && identity.givenName.length > 0
          ? identity.givenName
          : "User";

    const payload = {
      userName,
      expiresAt: Date.now() + TYPING_TTL_MS,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("typingStates", {
      conversationId: args.conversationId,
      userId: identity.subject,
      ...payload,
    });
  },
});

export const list = query({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const now = Date.now();

    const typingUsers = await ctx.db
      .query("typingStates")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    return typingUsers
      .filter(
        (entry) =>
          entry.expiresAt > now &&
          (!identity || entry.userId !== identity.subject),
      )
      .map((entry) => ({
        userId: entry.userId,
        userName: entry.userName,
      }));
  },
});
