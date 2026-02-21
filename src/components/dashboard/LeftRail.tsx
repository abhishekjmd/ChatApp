import { SignOutButton } from "@clerk/nextjs";
import { leftNavItems } from "./data";
import { SymbolIcon } from "./SymbolIcon";

type LeftRailProps = {
  user: {
    name: string;
    imageUrl: string;
  };
  activeNav: string;
  onSelectNav: (navId: string) => void;
};

export function LeftRail({ user, activeNav, onSelectNav }: LeftRailProps) {
  return (
    <>
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
              onClick={() => onSelectNav(item.id)}
              className={
                activeNav === item.id
                  ? "rounded-lg bg-emerald-500/10 p-2 text-emerald-500"
                  : "p-2 text-slate-400 transition-colors hover:text-white"
              }
            >
              <SymbolIcon name={item.icon} className="h-5 w-5" />
            </button>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-4 pb-4">
          <button
            type="button"
            aria-label="Settings"
            className="p-2 text-slate-400 transition-colors hover:text-white"
          >
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

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-800 bg-slate-900/95 px-2 py-2 backdrop-blur lg:hidden"
        aria-label="Mobile Primary"
      >
        {leftNavItems
          .filter((item) => item.id === "messages" || item.id === "contacts")
          .map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => onSelectNav(item.id)}
              className={
                activeNav === item.id
                  ? "rounded-lg bg-emerald-500/10 p-2 text-emerald-500"
                  : "rounded-lg p-2 text-slate-400 transition-colors hover:text-white"
              }
            >
              <SymbolIcon name={item.icon} className="h-5 w-5" />
            </button>
          ))}
        <button type="button" aria-label="Settings" className="rounded-lg p-2 text-slate-400 transition-colors hover:text-white">
          <SymbolIcon name="settings" className="h-5 w-5" />
        </button>
        <SignOutButton>
          <button type="button" className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
            Sign out
          </button>
        </SignOutButton>
      </nav>
    </>
  );
}
