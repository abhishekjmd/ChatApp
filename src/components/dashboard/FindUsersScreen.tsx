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

  const selectedMembers = useMemo(
    () => groupCandidates.filter((candidate) => selectedMemberIds.includes(candidate.id)),
    [groupCandidates, selectedMemberIds],
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
    <section className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-900 pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/70 p-5 shadow-xl shadow-slate-950/30">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Group</h2>
              <p className="mt-1 text-sm text-slate-400">Pick members and start a shared real-time conversation.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                void handleCreateGroup();
              }}
              disabled={!canCreateGroup || isCreatingGroup}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SymbolIcon name="addCircle" className="h-4 w-4" />
              {isCreatingGroup ? "Creating..." : "Create Group"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="e.g. Design Sprint Team"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Selected Members
              </label>
              <div className="custom-scrollbar flex min-h-11 items-center gap-2 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5">
                {selectedMembers.length ? (
                  selectedMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      className="group relative shrink-0"
                      aria-label={`Remove ${member.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="size-9 rounded-full border-2 border-emerald-500/70 object-cover"
                      />
                      <span className="absolute -right-1 -top-1 hidden size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white group-hover:flex">
                        x
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="px-2 text-xs text-slate-500">No members selected yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {groupCandidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => toggleMember(candidate.id)}
                className={
                  selectedMemberIds.includes(candidate.id)
                    ? "rounded-full border border-emerald-400/70 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200"
                    : "rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-200"
                }
              >
                {candidate.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 pb-2 pt-10 text-center">
          <h1 className="text-3xl font-bold text-white">Discover People</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
            Find teammates and start conversations instantly.
          </p>
          <div className="mx-auto mt-6 w-full max-w-2xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <SymbolIcon name="search" className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                placeholder="Search by name or email..."
                className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-800 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 shadow-2xl shadow-slate-950/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-800/70" />
            ))}
          </div>
        ) : users.length ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((directoryUser) => (
              <article
                key={directoryUser.id}
                className="group rounded-2xl border border-slate-700/60 bg-slate-800/70 p-6 shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-slate-950/40"
              >
                <div className="mb-4 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={directoryUser.avatar}
                      alt={`${directoryUser.name} avatar`}
                      className="size-20 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    <div
                      className={
                        directoryUser.isOnline
                          ? "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300"
                          : "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-slate-600 bg-slate-700/50 px-2 py-0.5 text-[10px] font-bold text-slate-300"
                      }
                    >
                      {directoryUser.isOnline ? "ONLINE" : "OFFLINE"}
                    </div>
                  </div>
                  <h3 className="mt-2 truncate text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                    {directoryUser.name}
                    {directoryUser.isCurrentUser ? " (You)" : ""}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {directoryUser.email || "No email available"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={directoryUser.isCurrentUser}
                  onClick={() => onStartChat(directoryUser.id)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  <SymbolIcon name="send" className="h-4 w-4" />
                  {directoryUser.isCurrentUser ? "This is you" : "Message"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-8 text-center text-slate-400">
            No users found for this search.
          </div>
        )}
      </div>
    </section>
  );
}
