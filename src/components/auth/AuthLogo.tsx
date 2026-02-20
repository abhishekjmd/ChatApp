import { MessageSquare } from "./icons";

export function AuthLogo() {
  return (
    <header className="mb-8 flex flex-col items-center">
      <div className="mb-3 rounded-xl bg-emerald-500/20 p-3">
        <MessageSquare className="h-10 w-10 text-emerald-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">ChatApp</h1>
      <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
        Connect with your team in real-time
      </p>
    </header>
  );
}
