import { SectionHeader } from "@/components/shared/section-header";
import { QuickActions } from "@/components/customer/quick-actions";
import { FaceShapeAnalyzer } from "@/components/customer/face-shape-analyzer";

export default function CustomerAnalyzePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analyze"
        description="Capture or upload a portrait for on-device landmark detection. Save results to get personalized style suggestions."
      />
      <QuickActions />
      <FaceShapeAnalyzer />
    </div>
  );
}
