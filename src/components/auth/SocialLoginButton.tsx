import { GoogleLogo } from "./icons";

export function SocialLoginButton() {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-slate-200 bg-transparent px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span className="flex items-center justify-center gap-3">
        <GoogleLogo className="h-5 w-5" />
        Sign in with Google
      </span>
    </button>
  );
}
