import { Camera } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { QuickActions } from "@/components/customer/quick-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerAnalyzePage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Analyze" description="Capture or upload a facial image, then hand it off to the AI analysis and recommendation pipeline." />
      <QuickActions />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>AI pipeline connection points</CardTitle>
            <CardDescription>Use this page as the main workflow entry for facial analysis and recommendation generation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-500">
            <div className="rounded-2xl border border-slate-200 px-4 py-3">1. Validate and upload image</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">2. Store upload record in PostgreSQL</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">3. Send image reference to Python AI service</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">4. Save analysis results and top 5 recommendations</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">5. Display preview images and allow favorite/save actions</div>
          </CardContent>
        </Card>
      </div>
      <EmptyPanel title="Live camera, upload preview, and results zone" description="Connect this space to your camera component, file preview card, AI loading state, and recommendation results list." icon={Camera} />
    </div>
  );
}