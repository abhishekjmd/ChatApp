import { ChatWindow } from "./ChatWindow";
import { ConversationSidebar } from "./ConversationSidebar";
import { LeftRail } from "./LeftRail";

type DashboardProps = {
  user: {
    name: string;
    email: string;
    imageUrl: string;
  };
};

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <LeftRail user={user} />
      <ConversationSidebar user={user} />
      <ChatWindow />
    </div>
  );
}
