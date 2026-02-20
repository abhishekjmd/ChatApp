"use client";

import { useUser } from "@clerk/nextjs";
import { ChatWindow } from "./ChatWindow";
import { ConversationSidebar } from "./ConversationSidebar";
import { LeftRail } from "./LeftRail";

const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=10b77f";

export function Dashboard() {
  const { user } = useUser();

  const dashboardUser = {
    name: user?.fullName ?? user?.firstName ?? "User",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user?.imageUrl ?? FALLBACK_AVATAR,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <LeftRail user={dashboardUser} />
      <ConversationSidebar user={dashboardUser} />
      <ChatWindow currentUserId={user?.id} />
    </div>
  );
}
