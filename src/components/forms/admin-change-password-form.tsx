"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePassword } from "@/lib/validators";

export function AdminChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccess(null);
    const nextErrors: Record<string, string> = {};
    if (!currentPassword) nextErrors.currentPassword = "Enter your current password.";
    if (!newPassword) nextErrors.newPassword = "Enter a new password.";
    else if (!validatePassword(newPassword)) {
      nextErrors.newPassword = "At least 8 characters with uppercase, lowercase, and a number.";
    }
    if (newPassword !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setErrors({ form: data.error ?? "Could not update password." });
        return;
      }
      setSuccess(data.message ?? "Your password has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrors({ form: "Network error. Try again." });
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
        <Label htmlFor="admin-change-current">Current password</Label>
        <div className="relative">
          <Input
            id="admin-change-current"
            type={showCurrent ? "text" : "password"}
            className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-3 pr-10 text-left shadow-inner shadow-slate-200/40 backdrop-blur"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-slate-400"
            onClick={() => setShowCurrent((v) => !v)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.currentPassword ? <p className="text-xs text-rose-500">{errors.currentPassword}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-change-new">New password</Label>
        <div className="relative">
          <Input
            id="admin-change-new"
            type={showNew ? "text" : "password"}
            className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-3 pr-10 text-left shadow-inner shadow-slate-200/40 backdrop-blur"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-slate-400"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.newPassword ? <p className="text-xs text-rose-500">{errors.newPassword}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-change-confirm">Confirm new password</Label>
        <Input
          id="admin-change-confirm"
          type={showNew ? "text" : "password"}
          className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-3 pr-3 text-left shadow-inner shadow-slate-200/40 backdrop-blur"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        {errors.confirmPassword ? <p className="text-xs text-rose-500">{errors.confirmPassword}</p> : null}
      </div>

      <Button
        type="button"
        className="h-12 w-full rounded-2xl bg-slate-900 shadow-md shadow-slate-900/15 hover:bg-slate-800"
        onClick={() => void handleSubmit()}
        disabled={submitting}
      >
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </div>
  );
}
