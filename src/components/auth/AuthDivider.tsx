export function AuthDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-xs font-semibold tracking-widest text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
          Or continue with
        </span>
      </div>
    </div>
  );
}
