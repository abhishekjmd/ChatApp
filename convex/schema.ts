import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastSeen: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  messages: defineTable({
    body: v.string(),
    senderId: v.string(),
    senderName: v.string(),
    senderAvatar: v.optional(v.string()),
    recipientId: v.string(),
    conversationId: v.string(),
    readBy: v.array(v.string()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"]),

  typingStates: defineTable({
    conversationId: v.string(),
    userId: v.string(),
    userName: v.string(),
    expiresAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_user", ["conversationId", "userId"]),
});
