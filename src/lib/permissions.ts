export async function requestCameraAccess() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((track) => track.stop());
  return "Camera access granted. The system is ready for facial scanning.";
}