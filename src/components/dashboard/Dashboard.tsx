"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
  const { isLoaded, isSignedIn } = useAuth();
  const [conversationSearchTerm, setConversationSearchTerm] = useState("");
  const [directorySearchTerm, setDirectorySearchTerm] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [viewMode, setViewMode] = useState<ViewMode>("messages");

  const sidebarUsers = useQuery(anyApi.users.listForSidebar, {
    search: conversationSearchTerm,
  }) as SidebarUser[] | undefined;

  const directoryUsers = useQuery(anyApi.users.browseDirectory, {
    search: directorySearchTerm,
  }) as DirectoryUser[] | undefined;

  const upsertCurrentUser = useMutation(anyApi.users.upsertCurrent);
  const ensureDirectConversation = useMutation(anyApi.conversations.ensureDirect);
  const createGroupConversation = useMutation(anyApi.conversations.createGroup);
  const upsertPayload = useMemo(
    () => ({
      name: user?.fullName ?? user?.firstName ?? undefined,
      email: user?.primaryEmailAddress?.emailAddress ?? undefined,
      imageUrl: user?.imageUrl ?? undefined,
    }),
    [user?.firstName, user?.fullName, user?.imageUrl, user?.primaryEmailAddress?.emailAddress],
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    void upsertCurrentUser(upsertPayload);

    const intervalId = setInterval(() => {
      void upsertCurrentUser(upsertPayload);
    }, 15_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoaded, isSignedIn, upsertCurrentUser, upsertPayload]);

  const effectiveSelectedConversationId =
    selectedConversationId && sidebarUsers?.some((entry) => entry.id === selectedConversationId)
      ? selectedConversationId
      : sidebarUsers?.[0]?.id;

  const selectedUser = useMemo(
    () => sidebarUsers?.find((entry) => entry.id === effectiveSelectedConversationId),
    [effectiveSelectedConversationId, sidebarUsers],
  );

  const dashboardUser = {
    name: user?.fullName ?? user?.firstName ?? "User",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user?.imageUrl ?? FALLBACK_AVATAR,
  };

  const handleStartChat = async (userId: string) => {
    const conversationId = await ensureDirectConversation({ otherUserId: userId });
    setSelectedConversationId(conversationId);
    setConversationSearchTerm("");
    setViewMode("messages");
  };

  const handleSelectFromSidebar = (conversationId: string) => {
    void (async () => {
      const selectedEntry = sidebarUsers?.find((entry) => entry.id === conversationId);

      if (
        selectedEntry?.conversationType === "direct" &&
        selectedEntry.otherUserId &&
        selectedEntry.conversationId.startsWith("direct-pending::")
      ) {
        const ensuredConversationId = await ensureDirectConversation({
          otherUserId: selectedEntry.otherUserId,
        });
        setSelectedConversationId(ensuredConversationId);
      } else {
        setSelectedConversationId(conversationId);
      }

      setViewMode("messages");
    })();
  };

  const handleCreateGroup = async (groupName: string, memberIds: string[]) => {
    const conversationId = await createGroupConversation({
      name: groupName,
      memberIds,
    });
    setSelectedConversationId(conversationId);
    setConversationSearchTerm("");
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
        isLoading={!sidebarUsers}
        searchTerm={conversationSearchTerm}
        selectedUserId={effectiveSelectedConversationId}
        onSearchTermChange={setConversationSearchTerm}
        onSelectUser={handleSelectFromSidebar}
      />
      {showFindUsers ? (
        <FindUsersScreen
          users={directoryUsers ?? []}
          isLoading={!directoryUsers}
          searchTerm={directorySearchTerm}
          onSearchTermChange={setDirectorySearchTerm}
          onStartChat={handleStartChat}
          onCreateGroup={handleCreateGroup}
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
