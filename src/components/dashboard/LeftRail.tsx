import { SignOutButton } from "@clerk/nextjs";
import { leftNavItems } from "./data";
import { SymbolIcon } from "./SymbolIcon";

type LeftRailProps = {
  user: {
    name: string;
    imageUrl: string;
  };
};

export function LeftRail({ user }: LeftRailProps) {
  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center border-r border-slate-800 bg-slate-900 py-4 lg:flex">
      <div className="mb-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-900">
          <SymbolIcon name="chat" className="h-5 w-5" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6" aria-label="Primary">
        {leftNavItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            className={item.active ? "rounded-lg bg-emerald-500/10 p-2 text-emerald-500" : "p-2 text-slate-400 transition-colors hover:text-white"}
          >
            <SymbolIcon name={item.icon} className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-4 pb-4">
        <button type="button" aria-label="Settings" className="p-2 text-slate-400 transition-colors hover:text-white">
          <SymbolIcon name="settings" className="h-5 w-5" />
        </button>

        <div className="size-10 overflow-hidden rounded-full border-2 border-emerald-500" title={user.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.imageUrl} alt={`${user.name} profile`} className="h-full w-full object-cover" />
        </div>

        <SignOutButton>
          <button type="button" className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
