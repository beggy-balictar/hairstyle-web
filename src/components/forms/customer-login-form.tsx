"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { validateEmail } from "@/lib/validators";

interface CustomerLoginFormProps {
  nextPath?: string;
}

export function CustomerLoginForm({ nextPath }: Readonly<CustomerLoginFormProps>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErrors({ form: data.error ?? "Sign-in failed." });
        return;
      }
      router.push(nextPath ?? ROUTES.customerDashboard);
    } catch {
      setErrors({ form: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="customer-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="customer-email"
            type="email"
            className="h-12 rounded-2xl pl-10"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer-password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            id="customer-password"
            type={showPassword ? "text" : "password"}
            className="h-12 rounded-2xl pl-10 pr-10"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
      </div>
      {errors.form ? <p className="text-xs text-red-500">{errors.form}</p> : null}
      <Button className="h-12 w-full rounded-2xl" onClick={() => void handleSubmit()} disabled={submitting}>
        {submitting ? "Opening dashboard..." : "Login"}
      </Button>
      <div className="text-center text-sm text-slate-500">
        No account yet?{" "}
        <Link href={ROUTES.register} className="font-medium text-slate-900 underline underline-offset-4">
          Create one here
        </Link>
      </div>
    </div>
  );
}
