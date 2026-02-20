import type { Metadata } from "next";
import { AuthDecoration } from "@/components/auth/AuthDecoration";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { InputField } from "@/components/auth/InputField";
import { ArrowRight, Mail } from "@/components/auth/icons";
import { PasswordField } from "@/components/auth/PasswordField";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";

export const metadata: Metadata = {
  title: "ChatApp - Sign In",
  description: "Sign in to ChatApp and connect with your team in real-time.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <main className="w-full max-w-md">
        <AuthLogo />

        <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-800">
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">Sign In</h2>

          <form className="space-y-5" action="#" method="post">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@company.com"
              autoComplete="email"
              icon={<Mail className="h-5 w-5" />}
            />

            <PasswordField />

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-bold text-white transition-colors hover:bg-emerald-600"
            >
              Sign In
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <AuthDivider />
          <SocialLoginButton />
        </section>

        <AuthFooter />
        <AuthDecoration />
      </main>
    </div>
  );
}
