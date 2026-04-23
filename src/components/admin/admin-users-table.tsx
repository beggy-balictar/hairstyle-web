"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  customerProfile: { firstName: string; lastName: string; phone: string | null } | null;
};

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<UserRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/users", { credentials: "include" });
    const json = (await res.json()) as { users?: UserRow[]; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Could not load users.");
      setUsers([]);
    } else {
      setUsers(json.users ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => {
      const name = `${u.customerProfile?.firstName ?? ""} ${u.customerProfile?.lastName ?? ""}`.toLowerCase();
      return u.email.toLowerCase().includes(s) || name.includes(s);
    });
  }, [users, q]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: pendingDelete.id }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not delete account.");
        return;
      }
      setUsers((prev) => prev.filter((row) => row.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      setError("Network error while deleting account.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Accounts</CardTitle>
        <Input
          className="h-11 max-w-sm rounded-2xl"
          placeholder="Filter by email or name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!loading && !error ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px] table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="truncate font-medium text-slate-900">{u.email}</div>
                      {u.customerProfile ? (
                        <div className="truncate text-xs text-slate-500">
                          {u.customerProfile.firstName} {u.customerProfile.lastName}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 capitalize">{u.role.toLowerCase()}</td>
                    <td className="px-4 py-3 capitalize">{u.status.toLowerCase()}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl px-3"
                        disabled={deletingId === u.id}
                        onClick={() => setPendingDelete(u)}
                      >
                        {deletingId === u.id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
      <Dialog open={pendingDelete != null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-md rounded-3xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/40 p-0 shadow-2xl">
          <DialogHeader className="space-y-4 border-b border-rose-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg text-slate-900">Delete account?</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  Confirm removal of this user account.
                </DialogDescription>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700">
              <span className="font-medium text-slate-900">{pendingDelete?.email}</span>
            </div>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:min-w-[112px]"
              onClick={() => setPendingDelete(null)}
              disabled={deletingId != null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-11 w-full rounded-xl bg-rose-600 font-semibold text-white shadow-md shadow-rose-400/25 hover:bg-rose-700 sm:w-auto sm:min-w-[128px]"
              onClick={() => void handleDelete()}
              disabled={deletingId != null}
            >
              {deletingId ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
