import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function CustomerLoginPage({ searchParams }: Props) {
  const q = new URLSearchParams();
  const next = searchParams.next;
  if (typeof next === "string" && next.startsWith("/")) {
    q.set("next", next);
  }
  q.set("tab", "admin");
  redirect(`${ROUTES.roleLogin}?${q.toString()}`);
}
