"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { SymbolIcon } from "./SymbolIcon";
import type { SidebarUser } from "./types";

type ChatHeaderProps = {
  selectedUser?: SidebarUser;
  conversationId?: string;
  onBackToList?: () => void;
};

type TypingUser = {
  userId: string;
  userName: string;
};

export function ChatHeader({ selectedUser, conversationId, onBackToList }: ChatHeaderProps) {
  const typingUsers = useQuery(
    anyApi.typing.list,
    conversationId ? { conversationId } : "skip",
  ) as TypingUser[] | undefined;

  const statusText = selectedUser
    ? typingUsers?.length
      ? `${typingUsers[0].userName} is typing...`
      : selectedUser.conversationType === "group"
        ? `${selectedUser.memberCount} members`
        : selectedUser.isOnline
        ? "Online"
        : "Offline"
    : "Select a user to start chatting";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onBackToList ? (
          <button
            type="button"
            onClick={onBackToList}
            aria-label="Back to conversations"
            className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-800 md:hidden"
          >
            <span className="text-lg leading-none">{"<"}</span>
          </button>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedUser?.avatar ?? "https://api.dicebear.com/9.x/initials/svg?seed=User"}
          alt={selectedUser ? `${selectedUser.name} avatar` : "No conversation selected"}
          className="size-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-white">
            {selectedUser?.name ?? "No conversation selected"}
          </h2>
          <p className="flex items-center gap-1 text-[11px] text-emerald-500">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {statusText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <button type="button" aria-label="Video call" className="transition-colors hover:text-white">
          <SymbolIcon name="videocam" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Call" className="transition-colors hover:text-white">
          <SymbolIcon name="call" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Search" className="transition-colors hover:text-white">
          <SymbolIcon name="search" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="More" className="transition-colors hover:text-white">
          <SymbolIcon name="more" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
