"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { SymbolIcon } from "./SymbolIcon";

type MessageListProps = {
  currentUserId?: string;
  selectedUserId?: string;
  selectedUserName?: string;
  selectedUserAvatar?: string;
  conversationId?: string;
};

type ConvexMessage = {
  _id: string;
  _creationTime: number;
  body: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  readBy: string[];
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageList({
  currentUserId,
  selectedUserId,
  selectedUserName,
  selectedUserAvatar,
  conversationId,
}: MessageListProps) {
  const messages = useQuery(
    anyApi.messages.list,
    conversationId ? { conversationId } : "skip",
  ) as ConvexMessage[] | undefined;

  const markAsRead = useMutation(anyApi.messages.markAsRead);

  useEffect(() => {
    if (!conversationId || !currentUserId || !messages?.length) {
      return;
    }

    void markAsRead({ conversationId });
  }, [conversationId, currentUserId, markAsRead, messages?.length]);

  if (!selectedUserId || !conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-slate-400">
        Select a user to start a 1-on-1 chat.
      </div>
    );
  }

  return (
    <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6">
      <div className="flex justify-center">
        <span className="rounded-full bg-slate-800/50 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500">
          Live chat
        </span>
      </div>

      {messages?.length ? (
        messages.map((message) => {
          const isOwnMessage = Boolean(currentUserId) && message.senderId === currentUserId;
          const isSeenByRecipient =
            isOwnMessage && Boolean(selectedUserId) && message.readBy.includes(selectedUserId);

          if (!isOwnMessage) {
            const incomingDisplayName = selectedUserName ?? message.senderName;
            const incomingAvatar =
              selectedUserAvatar ??
              message.senderAvatar ??
              "https://api.dicebear.com/9.x/initials/svg?seed=User";

            return (
              <div key={message._id} className="flex max-w-[85%] gap-3 md:max-w-[80%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={incomingAvatar}
                  alt={`${incomingDisplayName} avatar`}
                  className="mt-auto size-8 shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <div className="rounded-2xl rounded-bl-none bg-slate-800 p-3 shadow-sm">
                    <p className="mb-1 text-xs font-semibold text-emerald-400">{incomingDisplayName}</p>
                    <p className="text-sm text-white">{message.body}</p>
                  </div>
                  <span className="ml-1 text-[10px] text-slate-500">
                    {formatTimestamp(message._creationTime)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={message._id} className="ml-auto flex max-w-[85%] flex-col items-end gap-1 md:max-w-[80%]">
              <div className="rounded-2xl rounded-br-none bg-emerald-500 p-3 shadow-lg shadow-emerald-500/20">
                <p className="text-sm font-medium text-slate-900">{message.body}</p>
              </div>
              <div className="mr-1 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">{formatTimestamp(message._creationTime)}</span>
                <SymbolIcon
                  name="doneAll"
                  className={isSeenByRecipient ? "h-3.5 w-3.5 text-emerald-500" : "h-3.5 w-3.5 text-slate-500"}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="mx-auto rounded-lg border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400">
          No messages yet. Send the first message.
        </div>
      )}
    </div>
  );
}
