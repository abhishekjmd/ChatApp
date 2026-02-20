import { conversations } from "./data";
import { SymbolIcon } from "./SymbolIcon";

type ConversationSidebarProps = {
  user: {
    name: string;
    email: string;
    imageUrl: string;
  };
};

export function ConversationSidebar({ user }: ConversationSidebarProps) {
  return (
    <section className="hidden w-80 shrink-0 flex-col border-r border-slate-800 bg-slate-800 md:flex">
      <div className="border-b border-slate-700 p-4">
        <h1 className="mb-4 text-xl font-bold text-white">Messages</h1>

        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-900 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.imageUrl} alt={`${user.name} profile`} className="size-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
            <SymbolIcon name="search" className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-lg border-none bg-slate-900 py-2 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <article
            key={conversation.id}
            className={conversation.active ? "flex cursor-pointer items-center gap-3 border-l-4 border-emerald-500 bg-slate-800/50 p-4" : "flex cursor-pointer items-center gap-3 p-4 opacity-90 transition-colors hover:bg-slate-800"}
          >
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={conversation.avatar} alt={`${conversation.name} avatar`} className="size-12 rounded-full object-cover" />
              {conversation.online ? <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-800 bg-emerald-500" /> : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <h3 className="truncate text-sm font-semibold text-slate-100">{conversation.name}</h3>
                <span className={conversation.unreadCount ? "text-[10px] text-emerald-500" : "text-[10px] text-slate-400"}>{conversation.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className={conversation.unreadCount ? "truncate text-xs font-medium text-slate-100" : "truncate text-xs text-slate-400"}>{conversation.preview}</p>
                {conversation.unreadCount ? <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">{conversation.unreadCount}</span> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
