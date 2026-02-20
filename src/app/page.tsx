import Link from "next/link";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ChatApp</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">You are signed in.</p>
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
        </header>

        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Authentication is active with Clerk. This route is protected by middleware.
        </p>

        <div className="flex gap-3">
          <SignOutButton>
            <button className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600">
              Sign out
            </button>
          </SignOutButton>
          <Link
            href="/sign-up"
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Create another account
          </Link>
        </div>
      </section>
    </main>
  );
}
