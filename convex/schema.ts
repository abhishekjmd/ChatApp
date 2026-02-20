import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    senderId: v.string(),
    senderName: v.string(),
    senderAvatar: v.optional(v.string()),
    conversationId: v.string(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"]),
});
