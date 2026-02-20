import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";

type ChatWindowProps = {
  currentUserId?: string;
};

export function ChatWindow({ currentUserId }: ChatWindowProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-900">
      <ChatHeader />
      <MessageList currentUserId={currentUserId} />
      <ChatComposer />
    </main>
  );
}
