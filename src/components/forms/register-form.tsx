"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/lib/routes";
import { validateEmail, validatePassword, validatePhone } from "@/lib/validators";
import { cn } from "@/lib/utils";

const initialRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  birthDate: "",
  gender: "",
  agreeTerms: false,
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialRegister);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checklist = useMemo(
    () => [
      { label: "At least 8 characters", valid: form.password.length >= 8 },
      { label: "Includes an uppercase letter", valid: /[A-Z]/.test(form.password) },
      { label: "Includes a lowercase letter", valid: /[a-z]/.test(form.password) },
      { label: "Includes a number", valid: /\d/.test(form.password) },
    ],
    [form.password]
  );

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email format.";
    if (!validatePassword(form.password)) {
      nextErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    }
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";
    if (form.phone && !validatePhone(form.phone)) nextErrors.phone = "Enter a valid phone number format.";
    if (!form.birthDate) nextErrors.birthDate = "Birth date is required.";
    if (!form.gender) nextErrors.gender = "Select a gender option.";
    if (!form.agreeTerms) nextErrors.agreeTerms = "You must agree to the terms and privacy notice.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    router.push(ROUTES.customerLogin);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            className="h-12 rounded-2xl"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          {errors.firstName ? <p className="text-xs text-red-500">{errors.firstName}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            className="h-12 rounded-2xl"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          {errors.lastName ? <p className="text-xs text-red-500">{errors.lastName}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            className="h-12 rounded-2xl"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            className="h-12 rounded-2xl"
            placeholder="Optional"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birth-date">Birth date</Label>
          <Input
            id="birth-date"
            type="date"
            className="h-12 rounded-2xl"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
          {errors.birthDate ? <p className="text-xs text-red-500">{errors.birthDate}</p> : null}
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="Select an option" />
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
          {errors.gender ? <p className="text-xs text-red-500">{errors.gender}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              className="h-12 rounded-2xl pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              className="h-12 rounded-2xl pr-10"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-xs text-red-500">{errors.confirmPassword}</p> : null}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-3 text-sm font-medium">Password requirements</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={cn("h-4 w-4", item.valid ? "text-emerald-500" : "text-slate-300")} />
              <span className={item.valid ? "text-slate-700" : "text-slate-500"}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={form.agreeTerms}
          onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
        />
        <span>
          I agree to the account terms, privacy notice, and the storage of my uploaded facial images for recommendation history and future reference.
        </span>
      </label>
      {errors.agreeTerms ? <p className="text-xs text-red-500">{errors.agreeTerms}</p> : null}

      <Button className="h-12 w-full rounded-2xl" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </div>
  );
}
