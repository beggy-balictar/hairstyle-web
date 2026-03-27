"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEmail } from "@/lib/validators";
import { ROUTES } from "@/lib/routes";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid admin email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    router.push(ROUTES.adminDashboard);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="admin-email"
              type="email"
              className="h-12 rounded-2xl pl-10"
              placeholder="admin@stylehair.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="admin-password"
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
      </div>
      <Button className="h-12 w-full rounded-2xl" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Entering dashboard..." : "Sign in as admin"}
      </Button>
    </div>
  );
}
