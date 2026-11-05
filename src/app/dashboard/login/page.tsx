"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/dashboard/auth/LoginForm";
import { useAuth } from "@/components/dashboard/auth/AuthProvider";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard/overview");
  }, [loading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-dash-line bg-dash-card p-8 shadow-[0_20px_60px_-30px_rgba(120,90,30,0.35)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dash-gold">Truffles Rooftop</p>
        <h1 className="mt-2 font-serif text-3xl text-dash-ink">Dashboard</h1>
        <p className="mb-8 mt-2 text-sm text-dash-muted">Sign in to manage reservations.</p>
        <LoginForm />
      </div>
    </div>
  );
}
