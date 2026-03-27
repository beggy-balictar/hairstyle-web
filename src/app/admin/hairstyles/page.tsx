import { Scissors } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminHairstylesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Hairstyle catalog management" description="Control the hairstyle records that feed recommendation scoring and preview-generation workflows." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Add or edit hairstyle entries</CardTitle>
            <CardDescription>Use this for database-ready CRUD fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input className="h-11 rounded-2xl" placeholder="Hairstyle name" />
            <Textarea className="min-h-[120px] rounded-2xl" placeholder="Description, styling notes, maintenance level, and suitability rules" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input className="h-11 rounded-2xl" placeholder="Category" />
              <Input className="h-11 rounded-2xl" placeholder="Maintenance level" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button className="rounded-2xl">Save hairstyle</Button>
              <Button variant="outline" className="rounded-2xl">Archive hairstyle</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Backend behavior</CardTitle>
            <CardDescription>These controls line up with version 1 admin functionality.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-500">
            <div className="rounded-2xl border border-slate-200 px-4 py-3">Create hairstyle entries used by the recommendation engine.</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">Update name, description, category, active status, and reference media.</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">Deactivate styles without deleting historical recommendation references.</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">Map styles to face-shape compatibility and scoring rules in separate tables or JSON fields.</div>
          </CardContent>
        </Card>
      </div>
      <EmptyPanel title="Catalog table and media manager" description="Connect this section to hairstyle CRUD routes, Cloudinary asset upload, and PostgreSQL hairstyle tables. No example hairstyle rows are rendered here." icon={Scissors} />
    </div>
  );
}