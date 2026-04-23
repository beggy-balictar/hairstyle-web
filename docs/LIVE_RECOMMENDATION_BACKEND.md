# Live camera hairstyle recommendation — backend requirements & logic

This document describes how the **StyleHair / HairStudio** stack supports live face capture, try-on history, catalog filtering, image upload, AI hooks, PostgreSQL, and mobile performance concerns.

## 1. Goals

- **Live camera**: browser `getUserMedia` (mobile web) with preview; optional **MediaPipe Face Landmarker** (or similar) on the client for landmarks and alignment.
- **Try-on overlay**: real-time positioning is **client-side** (Canvas/WebGL). The server stores **reference images** (`Hairstyle.sampleImageUrl`) and metadata; the app composites hair assets over the video/canvas frame.
- **Upload path**: same pipeline as camera after `POST /api/upload/face` with `uploadType=UPLOAD`.
- **Recommendations**: not hairstyle thumbnails only — server runs **scoring** (`scoreHairstyles`) using face shape, hair type, hair length, and **user catalog preference** (men / women / all).
- **User preference**: `HairstyleCatalogPreference` on `CustomerProfile` — **user-selected**, not inferred identity. Optional per-request override on analyze.

## 2. PostgreSQL (Prisma) models

| Model / field | Role |
|---------------|------|
| `CustomerProfile.hairstyleCatalogPreference` | `MENS` \| `WOMENS` \| `ALL` — filters catalog before scoring. |
| `FaceUpload.captureMeta` | JSON from client: e.g. `lightingScore`, `alignmentScore`, `faceDetected`, `fps`, `deviceTier` for QA and tuning. |
| `FaceUpload.uploadType` | `CAMERA` \| `UPLOAD` |
| `FaceAnalysis` + `Recommendation` + `RecommendationItem` | Persisted AI-style analysis and ranked suggestions. |
| `TryOnHistory` | Per-user log of try-on events, optional `faceUploadId`, `feedbackRating` / `feedbackNote` for improving models. |

Run after schema changes:

```bash
cd hairstyle-web
npx prisma generate
npx prisma db push
```

## 3. HTTP API (Next.js)

| Method | Path | Auth | Purpose |
|--------|------|------|-----------|
| `POST` | `/api/upload/face` | Customer | Multipart `file`, `uploadType`, optional `captureMeta` (JSON string). Saves image + metadata. |
| `POST` | `/api/analyze/face` | Customer | Body: `faceUploadId`, `faceShape`, `hairType`, `hairLength`, optional `catalogPreference`. Loads profile default if omitted. Filters catalog, scores, persists analysis + recommendations. |
| `GET` / `PATCH` | `/api/customer/recommendation-preferences` | Customer | Read/update `hairstyleCatalogPreference`. |
| `GET` | `/api/customer/hairstyles` | Customer | Active catalog for overlays / picker. |
| `GET` / `POST` | `/api/customer/try-on/history` | Customer | List recent try-ons; append event (+ optional feedback). |
| `GET` | `/api/customer/profile` | Customer | Display name + email for UI. |

**AI model (external)**  
Client-side or server-side workers can call your ML service (TensorFlow Serving, custom GPU API, etc.). Recommended pattern:

1. Client runs landmark / segmentation model (or sends a downscaled frame to `POST /api/integrations/...` if you add it).
2. Client derives `FaceShapeAnalysis`, `HairTypeAnalysis`, `HairLengthAnalysis` (or server does from image).
3. Client calls `POST /api/analyze/face` with structured JSON — **server trusts signed-in user**, validates enums, persists results.

Add a dedicated integration route when you wire a vendor; keep secrets in env (`AI_API_KEY`, etc.).

## 4. Functional flow (happy path)

1. User grants **camera** permission; app shows `<video>` + overlay `<canvas>`.
2. **Quality loop** (client): sample frames → estimate brightness (lighting) and simple head pose / alignment; warn if dark or off-center; block capture if `no face` (landmark confidence).
3. User picks **catalog preference** (men / women / all) → `PATCH /api/customer/recommendation-preferences`.
4. User selects a **try-on hairstyle** from strip → overlay asset on canvas; `POST /api/customer/try-on/history` logs selection (optional `clientLatencyMs`).
5. **Snapshot** → `FormData`: `file`, `uploadType=CAMERA`, `captureMeta` JSON.
6. **Analyze** → `POST /api/analyze/face` with analysis payload + optional `catalogPreference`.
7. **Recommendations** tab reads stored `RecommendationItem` rows (future: `GET` by `recommendationId` if you expose it).

## 5. Error handling & performance

- **No face**: client does not enable “Save / Analyze” until landmarks detected; show inline error.
- **Rate limits**: throttle analyze calls per user (Redis or DB counter) in production.
- **Mobile**: downscale frames before upload (e.g. max 720p), prefer `image/jpeg` 0.85, debounce try-on overlay redraws with `requestAnimationFrame`.

## 6. Security

- All customer routes use **Bearer** or session cookie + `requireCustomerSession`.
- Never return reset tokens in production responses (password reset is separate).
- Validate image MIME + size on upload (already enforced).

## 7. Future work checklist

- [ ] Email reset links (SMTP / Resend).
- [ ] Server-side face model route + queue for heavy GPU jobs.
- [ ] `GET /api/customer/recommendations/latest` for mobile results screen.
- [ ] CDN for hairstyle overlay assets (PNG with alpha).
- [ ] Admin analytics from `TryOnHistory` + `captureMeta` aggregates.
