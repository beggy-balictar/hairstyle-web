"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, RefreshCw, Ruler, ScanFace, Sparkles, Upload, Video, Waves, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { getFaceLandmarker } from "@/lib/face-landmarker";
import { classifyFaceShapeFromLandmarks } from "@/lib/face-shape-classifier";
import { classifyHairTypeFromImage } from "@/lib/hair-type-classifier";
import { classifyHairLengthFromImage } from "@/lib/hair-length-classifier";
import type { FaceShapeAnalysis } from "@/types/face-shape";
import type { HairTypeAnalysis } from "@/types/hair-type";
import type { HairLengthAnalysis } from "@/types/hair-length";

const shapeTips: Record<string, string[]> = {
  triangle: ["Add volume on top or around the temples.", "Avoid styles that make the jawline look heavier."],
  oval: ["Most cuts work well with this balance.", "Use bangs or side parts based on style preference, not shape correction."],
  round: ["Use height on top to lengthen the face.", "Prefer tapered sides over bulky side volume."],
  square: ["Layered or textured cuts can soften strong edges.", "Keep some movement around the forehead or crown."],
  oblong: ["Reduce excessive height on top.", "Use styles with side volume to balance face length."],
  diamond: ["Add width around the forehead or chin area.", "Fringes and layered sides often work well."],
  rectangle: ["Avoid very tall top-heavy cuts.", "Side texture or fringe helps reduce perceived length."],
};

const hairTips: Record<string, string[]> = {
  straight: ["Layering and volume-building styles help avoid a flat look.", "Texturizing products can add movement."],
  wavy: ["Medium layering usually works well with natural bend.", "Use lightweight products that define waves without weighing them down."],
  curly: ["Cuts that preserve shape and reduce bulk tend to work best.", "Moisture-focused styling usually improves curl definition."],
};

const hairLengthTips: Record<string, string[]> = {
  short: ["Pixie, crop, or tapered styles will usually follow the existing visible length well.", "Add texture at the crown if you want more apparent volume."],
  medium: ["Layered bobs, lobs, and shoulder-skimming cuts usually suit this range.", "Use internal layers if you want movement without losing too much length."],
  long: ["Long layers help keep length while avoiding heaviness.", "Face-framing sections can keep long hair from overwhelming the face shape."],
};

type StatusTone = "idle" | "busy" | "success" | "error";

function formatPct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

function dataUrlToImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The selected image could not be loaded."));
    img.src = dataUrl;
  });
}

export function FaceShapeAnalyzer() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState("Upload a clear front-facing image or use the camera to begin analysis.");
  const [statusTone, setStatusTone] = useState<StatusTone>("idle");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceShapeAnalysis | null>(null);
  const [hairAnalysis, setHairAnalysis] = useState<HairTypeAnalysis | null>(null);
  const [hairLengthAnalysis, setHairLengthAnalysis] = useState<HairLengthAnalysis | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const topShapeScores = useMemo(() => {
    if (!analysis) return [];
    return Object.entries(analysis.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [analysis]);

  const topHairScores = useMemo(() => {
    if (!hairAnalysis) return [];
    return Object.entries(hairAnalysis.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [hairAnalysis]);

  const topHairLengthScores = useMemo(() => {
    if (!hairLengthAnalysis) return [];
    return Object.entries(hairLengthAnalysis.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [hairLengthAnalysis]);

  async function runAnalysisFromDataUrl(dataUrl: string) {
    try {
      setIsAnalyzing(true);
      setStatusTone("busy");
      setStatus("Loading face landmark model...");
      setPreviewUrl(dataUrl);
      setAnalysis(null);
      setHairAnalysis(null);
      setHairLengthAnalysis(null);

      const image = await dataUrlToImage(dataUrl);
      const landmarker = await getFaceLandmarker();

      setStatus("Analyzing face landmarks...");
      const detection = landmarker.detect(image);
      const landmarks = detection.faceLandmarks?.[0];

      if (!landmarks) {
        throw new Error("No face was detected. Use a front-facing image with good lighting and minimal tilt.");
      }

      const shapeResult = classifyFaceShapeFromLandmarks(landmarks);
      setStatus("Analyzing visible hair texture...");
      const hairResult = await classifyHairTypeFromImage(image, landmarks);
      setStatus("Estimating visible hair length...");
      const hairLengthResult = await classifyHairLengthFromImage(image, landmarks);

      setAnalysis(shapeResult);
      setHairAnalysis(hairResult);
      setHairLengthAnalysis(hairLengthResult);
      setStatusTone("success");
      setStatus(
        `Detected face shape: ${shapeResult.shape} (${formatPct(shapeResult.confidence)}). Hair type: ${hairResult.type} (${formatPct(hairResult.confidence)}). Hair length: ${hairLengthResult.length} (${formatPct(hairLengthResult.confidence)}).`,
      );
    } catch (error) {
      setStatusTone("error");
      setStatus(error instanceof Error ? error.message : "Face and hair analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function onFileChange(file?: File) {
    if (!file) return;
    setStatusTone("busy");
    setStatus(`Preparing image: ${file.name}`);
    const dataUrl = await fileToDataUrl(file);
    await runAnalysisFromDataUrl(dataUrl);
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setIsCameraOpen(true);
      setStatusTone("busy");
      setStatus("Camera ready. Position your face and visible hair inside the frame, then capture an image.");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setStatusTone("error");
      setStatus("Camera access was denied or is unavailable on this device.");
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  }

  async function captureFrame() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      setStatusTone("error");
      setStatus("Could not access the canvas for capture.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    await runAnalysisFromDataUrl(dataUrl);
    closeCamera();
  }

  function resetAnalyzer() {
    setPreviewUrl(null);
    setAnalysis(null);
    setHairAnalysis(null);
    setHairLengthAnalysis(null);
    setStatusTone("idle");
    setStatus("Upload a clear front-facing image or use the camera to begin analysis.");
    closeCamera();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <ScanFace className="h-5 w-5" /> Face shape, hair type, and hair length detection
          </CardTitle>
          <CardDescription>
            One upload now runs all three analyses: MediaPipe extracts facial landmarks for face-shape classification, then the
            same image is sampled for straight, wavy, or curly hair texture and short, medium, or long visible hair length.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void onFileChange(event.target.files?.[0]);
              }}
            />
            <Button className="h-12 rounded-2xl" onClick={() => inputRef.current?.click()} disabled={isAnalyzing}>
              <Upload className="mr-2 h-4 w-4" /> Upload image
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl" onClick={() => void openCamera()} disabled={isAnalyzing}>
              <Camera className="mr-2 h-4 w-4" /> Open camera
            </Button>
            <Button
              variant="ghost"
              className="h-12 rounded-2xl"
              onClick={resetAnalyzer}
              disabled={isAnalyzing && !analysis && !hairAnalysis && !hairLengthAnalysis}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <Alert
            className={
              statusTone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : statusTone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : statusTone === "busy"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
            }
          >
            {status}
          </Alert>

          {isCameraOpen ? (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-100">
                  <Video className="h-4 w-4" /> Live camera preview
                </span>
                <Button variant="ghost" className="h-9 rounded-xl text-white hover:bg-slate-800 hover:text-white" onClick={closeCamera}>
                  <XCircle className="mr-2 h-4 w-4" /> Close
                </Button>
              </div>
              <video ref={videoRef} className="aspect-video w-full rounded-2xl bg-black object-cover" playsInline muted />
              <Button className="h-11 rounded-2xl" onClick={() => void captureFrame()} disabled={isAnalyzing}>
                Capture and analyze
              </Button>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Selected preview" className="h-full min-h-[300px] w-full object-cover" />
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">
                  <ScanFace className="h-10 w-10 text-slate-300" />
                  <p className="max-w-sm text-sm">
                    Use a straight, well-lit photo with the forehead, sides of the face, and hair texture clearly visible for the most reliable result.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Detected face shape</p>
                  <h3 className="mt-2 text-2xl font-semibold capitalize text-slate-900">{analysis ? analysis.shape : "Waiting"}</h3>
                  <p className="mt-2 text-sm text-slate-600">{analysis ? analysis.summary : "No face-shape result yet."}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Detected hair type</p>
                  <h3 className="mt-2 flex items-center gap-2 text-2xl font-semibold capitalize text-slate-900">
                    <Waves className="h-5 w-5 text-slate-500" /> {hairAnalysis ? hairAnalysis.type : "Waiting"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{hairAnalysis ? hairAnalysis.summary : "No hair-type result yet."}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Detected hair length</p>
                  <h3 className="mt-2 flex items-center gap-2 text-2xl font-semibold capitalize text-slate-900">
                    <Ruler className="h-5 w-5 text-slate-500" /> {hairLengthAnalysis ? hairLengthAnalysis.length : "Waiting"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{hairLengthAnalysis ? hairLengthAnalysis.summary : "No hair-length result yet."}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Face-shape confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{analysis ? formatPct(analysis.confidence) : "--"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Hair-type confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{hairAnalysis ? formatPct(hairAnalysis.confidence) : "--"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Hair-length confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{hairLengthAnalysis ? formatPct(hairLengthAnalysis.confidence) : "--"}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recommended styling direction</p>
                <div className="mt-3 grid gap-3 xl:grid-cols-3">
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(analysis ? shapeTips[analysis.shape] : ["Face-shape styling suggestions will appear after the first successful scan."]).map((tip) => (
                      <li key={tip} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(hairAnalysis ? hairTips[hairAnalysis.type] : ["Hair-type recommendations will appear after the first successful scan."]).map((tip) => (
                      <li key={tip} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(hairLengthAnalysis ? hairLengthTips[hairLengthAnalysis.length] : ["Hair-length recommendations will appear after the first successful scan."]).map((tip) => (
                      <li key={tip} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Face-shape measurement ratios</CardTitle>
            <CardDescription>These normalized facial values feed the face-shape classifier.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              {analysis ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Face length to dominant width</span>
                    <span className="font-medium">{analysis.metrics.lengthToWidthRatio.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Jaw width to forehead width</span>
                    <span className="font-medium">{analysis.metrics.jawToForeheadRatio.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Cheekbone width to jaw width</span>
                    <span className="font-medium">{analysis.metrics.cheekToJawRatio.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Cheekbone width to forehead width</span>
                    <span className="font-medium">{analysis.metrics.cheekToForeheadRatio.toFixed(3)}</span>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">No face-shape ratios yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Hair profile metrics
            </CardTitle>
            <CardDescription>
              The hair modules sample the visible hair region from the same upload and score texture plus visible length extent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              {hairAnalysis ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Texture score</span>
                    <span className="font-medium">{hairAnalysis.metrics.textureScore.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Orientation entropy</span>
                    <span className="font-medium">{hairAnalysis.metrics.orientationEntropy.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Vertical dominance</span>
                    <span className="font-medium">{hairAnalysis.metrics.verticalDominance.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Wave oscillation</span>
                    <span className="font-medium">{hairAnalysis.metrics.waveOscillation.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Curliness index</span>
                    <span className="font-medium">{hairAnalysis.metrics.curlinessIndex.toFixed(3)}</span>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">No hair-type metrics yet.</div>
              )}
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {hairLengthAnalysis ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Below-chin length ratio</span>
                    <span className="font-medium">{hairLengthAnalysis.metrics.belowChinLengthRatio.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Lower hair coverage</span>
                    <span className="font-medium">{hairLengthAnalysis.metrics.lowerCoverage.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Lower-half hair coverage</span>
                    <span className="font-medium">{hairLengthAnalysis.metrics.lowerHalfCoverage.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Side coverage</span>
                    <span className="font-medium">{hairLengthAnalysis.metrics.sideCoverage.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Hair-seed confidence</span>
                    <span className="font-medium">{hairLengthAnalysis.metrics.hairSeedConfidence.toFixed(3)}</span>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-500">No hair-length metrics yet.</div>
              )}
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top hair-type alternatives</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {topHairScores.length > 0 ? (
                  topHairScores.map(([type, score]) => (
                    <div key={type} className="flex items-center justify-between capitalize">
                      <span>{type}</span>
                      <span>{formatPct(score)}</span>
                    </div>
                  ))
                ) : (
                  <p>--</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top hair-length alternatives</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {topHairLengthScores.length > 0 ? (
                  topHairLengthScores.map(([length, score]) => (
                    <div key={length} className="flex items-center justify-between capitalize">
                      <span>{length}</span>
                      <span>{formatPct(score)}</span>
                    </div>
                  ))
                ) : (
                  <p>--</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top face-shape alternatives</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {topShapeScores.length > 0 ? (
                  topShapeScores.map(([shape, score]) => (
                    <div key={shape} className="flex items-center justify-between capitalize">
                      <span>{shape}</span>
                      <span>{formatPct(score)}</span>
                    </div>
                  ))
                ) : (
                  <p>--</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
