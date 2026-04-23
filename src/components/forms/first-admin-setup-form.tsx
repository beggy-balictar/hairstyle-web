"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { validateEmail } from "@/lib/validators";

export function FirstAdminSetupForm() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/setup-status");
        const data = (await res.json()) as { needsSetup?: boolean; error?: string };
        if (!res.ok) {
          setErrors({ form: data.error ?? "Could not verify setup status." });
          setAllowed(false);
        } else {
          setAllowed(data.needsSetup === true);
          if (!data.needsSetup) {
            setErrors({
              form:
                "The first admin already exists. Sign in, then use Create admin in the dashboard to add more @stylehair.com accounts.",
            });
          }
        }
      } catch {
        setErrors({ form: "Network error." });
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
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
      const res = await fetch("/api/admin/register-first", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErrors({ form: data.error ?? "Setup failed." });
        return;
      }
      router.push(`${ROUTES.roleLogin}?tab=admin`);
    } catch {
      setErrors({ form: "Network error." });
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return <p className="text-sm text-slate-500">Checking whether first-time setup is available…</p>;
  }

  return (
    <div className="space-y-5">
      {errors.form ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-3 text-sm text-rose-800">
          {errors.form}
          {!allowed ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={ROUTES.roleLogin}
                className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white"
              >
                Admin login
              </a>
              <a
                href={ROUTES.createAdminHelp}
                className="inline-flex rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-medium text-rose-900"
              >
                Create admin help
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      {allowed ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="admin-setup-email">Admin email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="admin-setup-email"
                type="email"
                className="h-12 rounded-2xl pl-10"
                placeholder="your.name@stylehair.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email ? <p className="text-xs text-rose-500">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-setup-password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="admin-setup-password"
                type={showPassword ? "text" : "password"}
                className="h-12 rounded-2xl pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password ? <p className="text-xs text-rose-500">{errors.password}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-setup-confirm">Confirm password</Label>
            <Input
              id="admin-setup-confirm"
              type={showPassword ? "text" : "password"}
              className="h-12 rounded-2xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword}</p> : null}
          </div>

          <Button className="h-12 w-full rounded-2xl" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Creating…" : "Create administrator account"}
          </Button>
        </>
      ) : null}
    </div>
  );
}
