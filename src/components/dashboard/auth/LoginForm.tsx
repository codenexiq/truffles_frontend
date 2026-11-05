"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
      // Next keeps this page's state alive in the background after navigating away, so wipe the form now:
      // after signing out it must be empty (no leftover password) and ready to use again.
      setEmail("");
      setPassword("");
      setBusy(false);
      router.replace("/dashboard/overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-dash-line bg-dash-card px-4 py-3 text-sm text-dash-ink placeholder:text-dash-muted/70 focus:border-dash-gold focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dash-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dash-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !email || !password}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-dash-gold px-4 py-3 text-sm font-semibold text-dash-on-gold transition hover:bg-dash-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
