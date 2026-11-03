"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { isValidEmail } from "@/utils";
import { API_V1 } from "@/lib/backend";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error" | "invalid";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [already, setAlready] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${API_V1}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: trap, email: email.trim() }),
      });
      // 409 means this address is already subscribed, which is a fine outcome
      setAlready(res.status === 409);
      setStatus(res.ok || res.status === 409 ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-gold">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{already ? "You're already on our list. Thank you!" : "Thank you! You're on our list."}</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <Honeypot value={trap} onChange={setTrap} />
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "invalid" || status === "error") setStatus("idle");
          }}
          aria-label="Email address"
          className="flex-1 rounded-sm border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 transition focus:border-gold focus:outline-none"
          placeholder="Your email address"
        />
        <Button type="submit" variant="primary" size="sm" disabled={status === "sending"} className="shrink-0">
          {status === "sending" ? (
            "..."
          ) : (
            <span className="flex items-center gap-1">
              <span>Join</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </Button>
      </div>
      {(status === "invalid" || status === "error") && (
        <p role="alert" className="flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {status === "invalid" ? "Please enter a valid email address." : "We couldn't sign you up just now. Please try again."}
        </p>
      )}
    </form>
  );
}
