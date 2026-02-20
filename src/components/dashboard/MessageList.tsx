import { messages } from "./data";
import { SymbolIcon } from "./SymbolIcon";

export function MessageList() {
  return (
    <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      <div className="flex justify-center">
        <span className="rounded-full bg-slate-800/50 px-3 py-1 text-[10px] tracking-widest text-slate-500 uppercase">Today</span>
      </div>

      {messages.map((message) =>
        message.author === "other" ? (
          <div key={message.id} className="flex max-w-[80%] gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.avatar ?? ""} alt="Contact avatar" className="mt-auto size-8 shrink-0 rounded-full object-cover" />
            <div className="flex flex-col gap-1">
              <div className="rounded-2xl rounded-bl-none bg-slate-800 p-3 shadow-sm">
                <p className="text-sm text-white">{message.text}</p>
              </div>
              <span className="ml-1 text-[10px] text-slate-500">{message.time}</span>
            </div>
          </div>
        ) : (
          <div key={message.id} className="ml-auto flex max-w-[80%] flex-col items-end gap-1">
            <div className="rounded-2xl rounded-br-none bg-emerald-500 p-3 shadow-lg shadow-emerald-500/20">
              <p className="text-sm font-medium text-slate-900">{message.text}</p>
            </div>
            <div className="mr-1 flex items-center gap-1">
              <span className="text-[10px] text-slate-500">{message.time}</span>
              <SymbolIcon name="doneAll" className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
