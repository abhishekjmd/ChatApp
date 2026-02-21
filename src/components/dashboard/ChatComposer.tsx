"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { SymbolIcon } from "./SymbolIcon";

type ChatComposerProps = {
  conversationId?: string;
  recipientId?: string;
  disabled?: boolean;
};

export function ChatComposer({ conversationId, recipientId, disabled }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string>();
  const [failedPayload, setFailedPayload] = useState<{
    body: string;
    conversationId: string;
    recipientId: string;
  }>();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = useMutation(anyApi.messages.send);
  const setTypingState = useMutation(anyApi.typing.set);

  const stopTypingSoon = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!conversationId) {
      return;
    }

    typingTimeoutRef.current = setTimeout(() => {
      void setTypingState({ conversationId, isTyping: false });
      typingTimeoutRef.current = null;
    }, 1_200);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || !conversationId || !recipientId || disabled) {
      return;
    }

    try {
      setIsSending(true);
      setSendError(undefined);
      const payload = {
        body: trimmed,
        conversationId,
        recipientId,
      };

      await sendMessage(payload);
      setFailedPayload(undefined);
      setMessage("");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      void setTypingState({ conversationId, isTyping: false });
    } catch {
      setSendError("Message failed to send. Check your connection and retry.");
      setFailedPayload({
        body: trimmed,
        conversationId,
        recipientId,
      });
    } finally {
      setIsSending(false);
    }
  };

  const retryFailedSend = async () => {
    if (!failedPayload || disabled) {
      return;
    }

    try {
      setIsSending(true);
      setSendError(undefined);
      await sendMessage(failedPayload);
      setFailedPayload(undefined);
      if (conversationId) {
        void setTypingState({ conversationId, isTyping: false });
      }
    } catch {
      setSendError("Retry failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (conversationId) {
        void setTypingState({ conversationId, isTyping: false });
      }
    };
  }, [conversationId, setTypingState]);

  const handleInputChange = (value: string) => {
    setMessage(value);

    if (!conversationId || disabled) {
      return;
    }

    if (!value.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      void setTypingState({ conversationId, isTyping: false });
      return;
    }

    void setTypingState({ conversationId, isTyping: true });
    stopTypingSoon();
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      {sendError ? (
        <div className="mx-auto mb-3 flex w-full max-w-4xl items-center justify-between gap-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          <span>{sendError}</span>
          {failedPayload ? (
            <button
              type="button"
              onClick={() => {
                void retryFailedSend();
              }}
              className="rounded bg-rose-400/20 px-2 py-1 font-semibold text-rose-100 hover:bg-rose-400/30"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-4xl items-center gap-4">
        <div className="hidden gap-2 md:flex">
          <button type="button" aria-label="Add" className="p-2 text-slate-400 transition-colors hover:text-white">
            <SymbolIcon name="addCircle" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Image" className="p-2 text-slate-400 transition-colors hover:text-white">
            <SymbolIcon name="image" className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            disabled={disabled || isSending}
            onChange={(event) => handleInputChange(event.target.value)}
            placeholder={disabled ? "Select a user to start chatting" : "Type a message..."}
            className="w-full rounded-xl border-none bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:bg-slate-700 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            aria-label="Emoji"
            className="absolute right-3 top-2.5 text-slate-400 transition-colors hover:text-emerald-500"
          >
            <SymbolIcon name="mood" className="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          aria-label="Send"
          disabled={disabled || isSending}
          className="flex size-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? <span className="text-xs font-bold">...</span> : <SymbolIcon name="send" className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
