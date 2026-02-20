import { activeConversation } from "./data";
import { SymbolIcon } from "./SymbolIcon";

export function ChatHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={activeConversation.avatar} alt={`${activeConversation.name} avatar`} className="size-10 rounded-full object-cover" />
        <div>
          <h2 className="text-sm font-bold text-white">{activeConversation.name}</h2>
          <p className="flex items-center gap-1 text-[11px] text-emerald-500">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {activeConversation.status}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <button type="button" aria-label="Video call" className="transition-colors hover:text-white">
          <SymbolIcon name="videocam" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Call" className="transition-colors hover:text-white">
          <SymbolIcon name="call" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Search" className="transition-colors hover:text-white">
          <SymbolIcon name="search" className="h-5 w-5" />
        </button>
        <button type="button" aria-label="More" className="transition-colors hover:text-white">
          <SymbolIcon name="more" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
