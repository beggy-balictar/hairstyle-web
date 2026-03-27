"use client";

import { useState } from "react";
import { requestCameraAccess } from "@/lib/permissions";

export function useFaceActions() {
  const [permissionMessage, setPermissionMessage] = useState("");

  const onScan = async () => {
    try {
      const message = await requestCameraAccess();
      setPermissionMessage(message);
    } catch {
      setPermissionMessage("Camera access was not granted. The scan workflow can be connected after permission is allowed.");
    }
  };

  const onUploadChange = (file?: File) => {
    if (!file) return;
    setPermissionMessage(`Selected file: ${file.name}. Ready for PostgreSQL record creation and AI pipeline submission.`);
  };

  return {
    permissionMessage,
    onScan,
    onUploadChange,
  };
}