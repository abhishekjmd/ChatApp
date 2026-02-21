import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

function normalizeName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Group name is required");
  }
  return trimmed;
}

export const ensureDirect = mutation({
  args: {
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.otherUserId === identity.subject) {
      throw new Error("Cannot create direct conversation with yourself");
    }

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    for (const membership of memberships) {
      const conversation = await ctx.db.get(membership.conversationId as Id<"conversations">);
      if (!conversation || conversation.type !== "direct") {
        continue;
      }

      const members = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversation", (q) => q.eq("conversationId", membership.conversationId))
        .collect();

      const memberIds = members.map((entry) => entry.userId);
      if (
        memberIds.length === 2 &&
        memberIds.includes(identity.subject) &&
        memberIds.includes(args.otherUserId)
      ) {
        return membership.conversationId;
      }
    }

    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      type: "direct",
      createdBy: identity.subject,
      createdAt: now,
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: identity.subject,
      joinedAt: now,
    });
    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: args.otherUserId,
      joinedAt: now,
    });

    return conversationId;
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    memberIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const groupName = normalizeName(args.name);
    const memberSet = new Set(args.memberIds.filter((memberId) => memberId !== identity.subject));

    if (memberSet.size < 2) {
      throw new Error("Select at least two members");
    }

    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      type: "group",
      name: groupName,
      createdBy: identity.subject,
      createdAt: now,
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: identity.subject,
      joinedAt: now,
    });

    for (const memberId of memberSet) {
      await ctx.db.insert("conversationMembers", {
        conversationId,
        userId: memberId,
        joinedAt: now,
      });
    }

    return conversationId;
  },
});
