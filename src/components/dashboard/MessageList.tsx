"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { SymbolIcon } from "./SymbolIcon";

type ChatWindowProps = {
  currentUserId?: string;
};

type ConvexMessage = {
  _id: string;
  _creationTime: number;
  body: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
};

export function MessageList({ currentUserId }: ChatWindowProps) {
  const messages = useQuery(anyApi.messages.list, {
    conversationId: "general",
  }) as ConvexMessage[] | undefined;

  return (
    <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      <div className="flex justify-center">
        <span className="rounded-full bg-slate-800/50 px-3 py-1 text-[10px] tracking-widest text-slate-500 uppercase">Live chat</span>
      </div>

      {messages?.length ? (
        messages.map((message) => {
          const isOwnMessage = Boolean(currentUserId) && message.senderId === currentUserId;

          if (!isOwnMessage) {
            return (
              <div key={message._id} className="flex max-w-[80%] gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={message.senderAvatar ?? "https://api.dicebear.com/9.x/initials/svg?seed=User"} alt={`${message.senderName} avatar`} className="mt-auto size-8 shrink-0 rounded-full object-cover" />
                <div className="flex flex-col gap-1">
                  <div className="rounded-2xl rounded-bl-none bg-slate-800 p-3 shadow-sm">
                    <p className="mb-1 text-xs font-semibold text-emerald-400">{message.senderName}</p>
                    <p className="text-sm text-white">{message.body}</p>
                  </div>
                  <span className="ml-1 text-[10px] text-slate-500">{new Date(message._creationTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={message._id} className="ml-auto flex max-w-[80%] flex-col items-end gap-1">
              <div className="rounded-2xl rounded-br-none bg-emerald-500 p-3 shadow-lg shadow-emerald-500/20">
                <p className="text-sm font-medium text-slate-900">{message.body}</p>
              </div>
              <div className="mr-1 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">{new Date(message._creationTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                <SymbolIcon name="doneAll" className="h-3.5 w-3.5 text-emerald-500" />
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
