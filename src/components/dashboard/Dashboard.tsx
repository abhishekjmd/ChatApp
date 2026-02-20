"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { ChatWindow } from "./ChatWindow";
import { ConversationSidebar } from "./ConversationSidebar";
import { FindUsersScreen } from "./FindUsersScreen";
import { LeftRail } from "./LeftRail";
import type { DirectoryUser, SidebarUser } from "./types";

const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=10b77f";

type ViewMode = "messages" | "contacts";

export function Dashboard() {
  const { user } = useUser();
  const [conversationSearchTerm, setConversationSearchTerm] = useState("");
  const [directorySearchTerm, setDirectorySearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [viewMode, setViewMode] = useState<ViewMode>("messages");

  const sidebarUsers = useQuery(anyApi.users.listForSidebar, {
    search: conversationSearchTerm,
  }) as SidebarUser[] | undefined;

  const directoryUsers = useQuery(anyApi.users.browseDirectory, {
    search: directorySearchTerm,
  }) as DirectoryUser[] | undefined;

  const upsertCurrentUser = useMutation(anyApi.users.upsertCurrent);

  useEffect(() => {
    void upsertCurrentUser({});

    const intervalId = setInterval(() => {
      void upsertCurrentUser({});
    }, 15_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [upsertCurrentUser]);

  const effectiveSelectedUserId =
    selectedUserId && sidebarUsers?.some((entry) => entry.id === selectedUserId)
      ? selectedUserId
      : sidebarUsers?.[0]?.id;

  const selectedUser = useMemo(
    () => sidebarUsers?.find((entry) => entry.id === effectiveSelectedUserId),
    [effectiveSelectedUserId, sidebarUsers],
  );

  const dashboardUser = {
    name: user?.fullName ?? user?.firstName ?? "User",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user?.imageUrl ?? FALLBACK_AVATAR,
  };

  const handleStartChat = (userId: string) => {
    setSelectedUserId(userId);
    setConversationSearchTerm("");
    setViewMode("messages");
  };

  const handleSelectFromSidebar = (userId: string) => {
    setSelectedUserId(userId);
    setViewMode("messages");
  };

  const handleSelectNav = (navId: string) => {
    if (navId === "contacts") {
      setViewMode("contacts");
      return;
    }

    if (navId === "messages") {
      setViewMode("messages");
    }
  };

  const showFindUsers = viewMode === "contacts";

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-900 text-slate-100 md:flex-row">
      <LeftRail
        user={dashboardUser}
        activeNav={viewMode === "contacts" ? "contacts" : "messages"}
        onSelectNav={handleSelectNav}
      />
      <ConversationSidebar
        user={dashboardUser}
        users={sidebarUsers ?? []}
        searchTerm={conversationSearchTerm}
        selectedUserId={effectiveSelectedUserId}
        onSearchTermChange={setConversationSearchTerm}
        onSelectUser={handleSelectFromSidebar}
      />
      {showFindUsers ? (
        <FindUsersScreen
          users={directoryUsers ?? []}
          searchTerm={directorySearchTerm}
          onSearchTermChange={setDirectorySearchTerm}
          onStartChat={handleStartChat}
        />
      ) : (
        <ChatWindow
          currentUserId={user?.id}
          selectedUser={selectedUser}
          conversationId={selectedUser?.conversationId}
        />
      )}
    </div>
  );
}
