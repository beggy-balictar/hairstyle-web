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
      <SectionHeader title="Hairstyle management" description="" />
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Add or edit hairstyle entries</CardTitle>
            
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
      </div>
      <EmptyPanel title="Catalog table" description="all hairstyle" icon={Scissors} />
    </div>
  );
}
