"use client";

import type { DirectoryUser } from "./types";
import { SymbolIcon } from "./SymbolIcon";

type FindUsersScreenProps = {
  searchTerm: string;
  users: DirectoryUser[];
  isLoading?: boolean;
  onSearchTermChange: (value: string) => void;
  onStartChat: (userId: string) => void;
};

export function FindUsersScreen({
  searchTerm,
  users,
  isLoading,
  onSearchTermChange,
  onStartChat,
}: FindUsersScreenProps) {
  return (
    <section className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Discover People</h1>
          <p className="mb-6 text-sm text-slate-400">Browse and search all registered users in real time</p>

          <div className="relative w-full max-w-2xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <SymbolIcon name="search" className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search by name or email..."
              className="h-12 w-full rounded-xl border-none bg-slate-800 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 shadow-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-xl bg-slate-800/70" />
            ))}
          </div>
        ) : users.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {users.map((directoryUser) => (
              <article
                key={directoryUser.id}
                className="group flex flex-col rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={directoryUser.avatar}
                      alt={`${directoryUser.name} avatar`}
                      className="size-14 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <span
                      className={
                        directoryUser.isOnline
                          ? "absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-800 bg-emerald-500"
                          : "absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-800 bg-slate-500"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-white">
                      {directoryUser.name}
                      {directoryUser.isCurrentUser ? " (You)" : ""}
                    </h3>
                    <p className="truncate text-xs text-slate-400">{directoryUser.email || "No email"}</p>
                  </div>
                </div>

                <p className="mb-5 text-xs text-slate-400">
                  {directoryUser.isOnline ? "Online now" : "Offline"}
                </p>

                <button
                  type="button"
                  disabled={directoryUser.isCurrentUser}
                  onClick={() => onStartChat(directoryUser.id)}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                >
                  <SymbolIcon name="send" className="h-4 w-4" />
                  {directoryUser.isCurrentUser ? "This is you" : "Message"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-8 text-center text-slate-400">
            No registered users match your search.
          </div>
        )}
      </div>
    </section>
  );
}
