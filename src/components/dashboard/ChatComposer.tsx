import { SymbolIcon } from "./SymbolIcon";

export function ChatComposer() {
  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <div className="flex gap-2">
          <button type="button" aria-label="Add" className="p-2 text-slate-400 transition-colors hover:text-white">
            <SymbolIcon name="addCircle" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Image" className="p-2 text-slate-400 transition-colors hover:text-white">
            <SymbolIcon name="image" className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-xl border-none bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:bg-slate-700 focus:ring-1 focus:ring-emerald-500"
          />
          <button type="button" aria-label="Emoji" className="absolute right-3 top-2.5 text-slate-400 transition-colors hover:text-emerald-500">
            <SymbolIcon name="mood" className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Send"
          className="flex size-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
        >
          <SymbolIcon name="send" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
