"use client";

import { useEffect, useRef, useState } from "react";
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
  deletedAt?: number;
  deletedBy?: string;
  editedAt?: number;
  reactions?: {
    emoji: string;
    userId: string;
  }[];
};

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"] as const;
const BOTTOM_THRESHOLD_PX = 72;

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getReactionSummary(
  reactions: { emoji: string; userId: string }[],
  currentUserId?: string,
) {
  return REACTION_EMOJIS.map((emoji) => {
    const count = reactions.filter((reaction) => reaction.emoji === emoji).length;
    const reactedByCurrentUser = Boolean(currentUserId) &&
      reactions.some(
        (reaction) => reaction.emoji === emoji && reaction.userId === currentUserId,
      );

    return {
      emoji,
      count,
      reactedByCurrentUser,
    };
  });
}

export function MessageList({
  currentUserId,
  selectedUserId,
  selectedUserName,
  selectedUserAvatar,
  conversationId,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCountRef = useRef(0);
  const wasNearBottomRef = useRef(true);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const [messageActionError, setMessageActionError] = useState<string>();
  const [openMenuMessageId, setOpenMenuMessageId] = useState<string>();
  const [editingMessageId, setEditingMessageId] = useState<string>();
  const [editingBody, setEditingBody] = useState("");

  const messages = useQuery(
    anyApi.messages.list,
    conversationId ? { conversationId } : "skip",
  ) as ConvexMessage[] | undefined;

  const markAsRead = useMutation(anyApi.messages.markAsRead);
  const deleteOwnMessage = useMutation(anyApi.messages.deleteOwn);
  const editOwnMessage = useMutation(anyApi.messages.editOwn);
  const toggleReaction = useMutation(anyApi.messages.toggleReaction);

  const isLoading = Boolean(conversationId) && messages === undefined;

  const checkIfNearBottom = () => {
    const container = listRef.current;
    if (!container) {
      return true;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= BOTTOM_THRESHOLD_PX;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = listRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  const handleScroll = () => {
    const nearBottom = checkIfNearBottom();
    wasNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setShowNewMessagesButton(false);
    }
  };

  useEffect(() => {
    if (!conversationId || !currentUserId || !messages?.length) {
      return;
    }

    void markAsRead({ conversationId });
  }, [conversationId, currentUserId, markAsRead, messages?.length]);

  useEffect(() => {
    if (!messages || !listRef.current) {
      return;
    }

    const hasNewMessages = messages.length > previousMessageCountRef.current;
    const shouldAutoScroll = wasNearBottomRef.current || previousMessageCountRef.current === 0;

    if (hasNewMessages && shouldAutoScroll) {
      scrollToBottom(previousMessageCountRef.current === 0 ? "auto" : "smooth");
      queueMicrotask(() => setShowNewMessagesButton(false));
      wasNearBottomRef.current = true;
    } else if (hasNewMessages) {
      queueMicrotask(() => setShowNewMessagesButton(true));
    }

    previousMessageCountRef.current = messages.length;
  }, [messages]);

  const handleDeleteOwnMessage = async (messageId: string) => {
    try {
      setMessageActionError(undefined);
      await deleteOwnMessage({ messageId: messageId as never });
      setOpenMenuMessageId(undefined);
    } catch {
      setMessageActionError("Couldn't delete the message. Please try again.");
    }
  };

  const handleStartEdit = (message: ConvexMessage) => {
    setOpenMenuMessageId(undefined);
    setEditingMessageId(message._id);
    setEditingBody(message.body);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(undefined);
    setEditingBody("");
  };

  const handleSaveEdit = async (messageId: string) => {
    const trimmed = editingBody.trim();
    if (!trimmed) {
      setMessageActionError("Message can't be empty.");
      return;
    }

    try {
      setMessageActionError(undefined);
      await editOwnMessage({ messageId: messageId as never, body: trimmed });
      setEditingMessageId(undefined);
      setEditingBody("");
    } catch {
      setMessageActionError("Couldn't edit the message. Please try again.");
    }
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      setMessageActionError(undefined);
      await toggleReaction({ messageId: messageId as never, emoji });
    } catch {
      setMessageActionError("Couldn't update reaction. Please try again.");
    }
  };

  if (!selectedUserId || !conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-slate-400">
        Select a user to start a 1-on-1 chat.
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {messageActionError ? (
        <div className="mx-4 mt-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 md:mx-6">
          {messageActionError}
        </div>
      ) : null}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6"
      >
        <div className="flex justify-center">
          <span className="rounded-full bg-slate-800/50 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500">
            Live chat
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-slate-800" />
            <div className="ml-auto h-12 w-1/2 animate-pulse rounded-2xl bg-slate-800/80" />
            <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-800" />
          </div>
        ) : messages?.length ? (
          messages.map((message) => {
          const isOwnMessage = Boolean(currentUserId) && message.senderId === currentUserId;
          const isSeenByRecipient =
            isOwnMessage && Boolean(selectedUserId) && message.readBy.includes(selectedUserId);
          const isDeleted = Boolean(message.deletedAt);
          const reactions = message.reactions ?? [];
          const reactionSummary = getReactionSummary(reactions, currentUserId);
          const hasAnyReaction = reactions.length > 0;

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
                  <div className="group/msgbubble w-fit">
                    <div className="rounded-2xl rounded-bl-none bg-slate-800 p-3 shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-emerald-400">{incomingDisplayName}</p>
                      <p className={isDeleted ? "text-sm italic text-slate-400" : "text-sm text-white"}>
                        {isDeleted ? "This message was deleted" : message.body}
                      </p>
                    </div>
                    {!isDeleted ? (
                      <div className="mt-1 hidden flex-wrap items-center gap-1 group-hover/msgbubble:flex">
                        {REACTION_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(message._id, emoji)}
                            className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {!isDeleted && hasAnyReaction ? (
                    <div className="ml-1 flex flex-wrap items-center gap-1">
                      {reactionSummary
                        .filter((reaction) => reaction.count > 0)
                        .map((reaction) => (
                          <button
                            key={reaction.emoji}
                            type="button"
                            onClick={() => handleToggleReaction(message._id, reaction.emoji)}
                            className={
                              reaction.reactedByCurrentUser
                                ? "rounded-full border border-emerald-400/70 bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200"
                                : "rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                            }
                          >
                            {reaction.emoji} {reaction.count}
                          </button>
                        ))}
                    </div>
                  ) : null}
                  <span className="ml-1 text-[10px] text-slate-500">
                    {formatTimestamp(message._creationTime)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message._id}
              className="ml-auto flex max-w-[85%] flex-col items-end gap-1 md:max-w-[80%]"
            >
              <div className="group/msgbubble relative w-fit">
                {!isDeleted && editingMessageId !== message._id ? (
                  <div className="absolute right-1 top-1 z-20 opacity-0 transition-opacity duration-150 group-hover/msgbubble:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuMessageId((current) => (current === message._id ? undefined : message._id));
                      }}
                      className="rounded px-1 text-slate-700 transition-colors hover:bg-slate-800/20 hover:text-slate-900"
                      aria-label="Message actions"
                    >
                      ⋮
                    </button>
                    {openMenuMessageId === message._id ? (
                      <div className="absolute right-0 mt-1 w-28 rounded-md border border-slate-700 bg-slate-900 p-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(message)}
                          className="w-full rounded px-2 py-1 text-left text-xs text-slate-200 hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleDeleteOwnMessage(message._id);
                          }}
                          className="w-full rounded px-2 py-1 text-left text-xs text-rose-300 hover:bg-slate-800"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div
                  className={
                    isDeleted
                      ? "rounded-2xl rounded-br-none bg-slate-800 p-3"
                      : "rounded-2xl rounded-br-none bg-emerald-500 p-3 shadow-lg shadow-emerald-500/20"
                  }
                >
                  {editingMessageId === message._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editingBody}
                        onChange={(event) => setEditingBody(event.target.value)}
                        className="w-64 rounded-md border-none bg-slate-100 px-2 py-1 text-sm text-slate-900 focus:ring-1 focus:ring-emerald-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded bg-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleSaveEdit(message._id);
                          }}
                          className="rounded bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={isDeleted ? "text-sm italic text-slate-300" : "text-sm font-medium text-slate-900"}>
                      {isDeleted ? "This message was deleted" : message.body}
                    </p>
                  )}
                </div>
                {!isDeleted ? (
                  <div className="mr-1 mt-1 hidden flex-wrap items-center justify-end gap-1 group-hover/msgbubble:flex">
                    {REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleToggleReaction(message._id, emoji)}
                        className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {!isDeleted && hasAnyReaction ? (
                <div className="mr-1 flex flex-wrap items-center justify-end gap-1">
                  {reactionSummary
                    .filter((reaction) => reaction.count > 0)
                    .map((reaction) => (
                      <button
                        key={reaction.emoji}
                        type="button"
                        onClick={() => handleToggleReaction(message._id, reaction.emoji)}
                        className={
                          reaction.reactedByCurrentUser
                            ? "rounded-full border border-emerald-400/70 bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200"
                            : "rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                        }
                      >
                        {reaction.emoji} {reaction.count}
                      </button>
                    ))}
                </div>
              ) : null}
              <div className="mr-1 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">{formatTimestamp(message._creationTime)}</span>
                {message.editedAt ? <span className="text-[10px] text-slate-500">(edited)</span> : null}
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

      {showNewMessagesButton ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              scrollToBottom();
              setShowNewMessagesButton(false);
              wasNearBottomRef.current = true;
            }}
            className="pointer-events-auto rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg shadow-emerald-500/30"
          >
            ↓ New messages
          </button>
        </div>
      ) : null}
    </div>
  );
}
