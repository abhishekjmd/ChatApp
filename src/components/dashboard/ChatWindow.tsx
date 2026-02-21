import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import type { SidebarUser } from "./types";

type ChatWindowProps = {
  currentUserId?: string;
  conversationId?: string;
  selectedUser?: SidebarUser;
};

export function ChatWindow({ currentUserId, selectedUser, conversationId }: ChatWindowProps) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-900">
      <ChatHeader selectedUser={selectedUser} conversationId={conversationId} />
      <MessageList
        key={conversationId ?? "no-conversation"}
        currentUserId={currentUserId}
        selectedUserId={selectedUser?.id}
        selectedUserName={selectedUser?.name}
        selectedUserAvatar={selectedUser?.avatar}
        conversationId={conversationId}
      />
      <ChatComposer
        conversationId={conversationId}
        recipientId={selectedUser?.id}
        disabled={!selectedUser || !conversationId}
      />
    </main>
  );
}
