import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
      <SignIn signUpUrl="/sign-up" forceRedirectUrl="/" />
    </main>
  );
}
