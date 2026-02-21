import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import type { SidebarUser } from "./types";

type ChatWindowProps = {
  currentUserId?: string;
  conversationId?: string;
  selectedUser?: SidebarUser;
  onBackToList?: () => void;
};

export function ChatWindow({ currentUserId, selectedUser, conversationId, onBackToList }: ChatWindowProps) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-900">
      <ChatHeader selectedUser={selectedUser} conversationId={conversationId} onBackToList={onBackToList} />
      <MessageList
        key={conversationId ?? "no-conversation"}
        currentUserId={currentUserId}
        selectedPeerUserId={selectedUser?.otherUserId}
        selectedUserName={selectedUser?.name}
        selectedUserAvatar={selectedUser?.avatar}
        isGroupConversation={selectedUser?.conversationType === "group"}
        conversationId={conversationId}
      />
      <ChatComposer
        conversationId={conversationId}
        disabled={!selectedUser || !conversationId}
      />
    </main>
  );
}
