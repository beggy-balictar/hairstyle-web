"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { validateEmail } from "@/lib/validators";

export function CreateAdminAccountForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccess(null);
    const nextErrors: Record<string, string> = {};
    if (!validateEmail(email)) nextErrors.email = "Enter a valid email.";
    if (!email.toLowerCase().endsWith("@stylehair.com")) {
      nextErrors.email = "Use an @stylehair.com address (e.g. maria@stylehair.com).";
    }
    if (password.length < 8) nextErrors.password = "At least 8 characters.";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      nextErrors.password = "Include uppercase, lowercase, and a number.";
    }
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setErrors({ form: data.error ?? "Could not create admin." });
        return;
      }
      setSuccess(data.message ?? "Administrator created. They can sign in now.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch {
      setErrors({ form: "Network error." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">{success}</div>
      ) : null}
      {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}

      <div className="space-y-2">
        <Label htmlFor="new-admin-email">Admin email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="new-admin-email"
            type="email"
            className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-10 shadow-inner shadow-slate-200/40 backdrop-blur"
            placeholder="name@stylehair.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        {errors.email ? <p className="text-xs text-rose-500">{errors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-admin-password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="new-admin-password"
            type={showPassword ? "text" : "password"}
            className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-10 pr-10 shadow-inner shadow-slate-200/40 backdrop-blur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? <p className="text-xs text-rose-500">{errors.password}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-admin-confirm">Confirm password</Label>
        <Input
          id="new-admin-confirm"
          type={showPassword ? "text" : "password"}
          className="h-12 rounded-2xl border-slate-200 bg-white/80 shadow-inner shadow-slate-200/40 backdrop-blur"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword}</p> : null}
      </div>

      <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/25" onClick={() => void handleSubmit()} disabled={submitting}>
        <UserPlus className="mr-2 h-4 w-4" />
        {submitting ? "Creating…" : "Create administrator"}
      </Button>

      <p className="text-center text-xs text-slate-500">
        New admins use the same sign-in page:{" "}
        <a href={ROUTES.roleLogin} className="font-medium text-indigo-600 underline underline-offset-4">
          /login
        </a>
      </p>
    </div>
  );
}
