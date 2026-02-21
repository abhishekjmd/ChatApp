"use client";

import { useMemo, useState } from "react";
import type { DirectoryUser } from "./types";
import { SymbolIcon } from "./SymbolIcon";

type FindUsersScreenProps = {
  searchTerm: string;
  users: DirectoryUser[];
  isLoading?: boolean;
  onSearchTermChange: (value: string) => void;
  onStartChat: (userId: string) => void;
  onCreateGroup: (groupName: string, memberIds: string[]) => void | Promise<void>;
};

export function FindUsersScreen({
  searchTerm,
  users,
  isLoading,
  onSearchTermChange,
  onStartChat,
  onCreateGroup,
}: FindUsersScreenProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const groupCandidates = useMemo(
    () => users.filter((entry) => !entry.isCurrentUser),
    [users],
  );

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((entry) => entry !== memberId)
        : [...current, memberId],
    );
  };

  const canCreateGroup = groupName.trim().length > 0 && selectedMemberIds.length >= 2;

  const handleCreateGroup = async () => {
    if (!canCreateGroup || isCreatingGroup) {
      return;
    }

    try {
      setIsCreatingGroup(true);
      await onCreateGroup(groupName.trim(), selectedMemberIds);
      setGroupName("");
      setSelectedMemberIds([]);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <section className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-10">
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-800/70 p-4">
          <h2 className="text-sm font-semibold text-white">Create Group</h2>
          <p className="mt-1 text-xs text-slate-400">Pick at least 2 members and a group name.</p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start">
            <input
              type="text"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Group name"
              className="h-10 w-full rounded-lg border-none bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 lg:w-72"
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {groupCandidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => toggleMember(candidate.id)}
                    className={
                      selectedMemberIds.includes(candidate.id)
                        ? "rounded-full border border-emerald-400/70 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200"
                        : "rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
                    }
                  >
                    {candidate.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                void handleCreateGroup();
              }}
              disabled={!canCreateGroup || isCreatingGroup}
              className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-slate-900 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingGroup ? "Creating..." : "Create group"}
            </button>
          </div>
        </div>

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
