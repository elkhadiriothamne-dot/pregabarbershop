import { useEffect, useRef } from "react";

export function useWakeLock(enabled: boolean = true) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!("wakeLock" in navigator)) return;

    let released = false;

    const requestLock = async () => {
      try {
        if (document.visibilityState !== "visible") return;
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      } catch {
      }
    };

    const handleVisibility = () => {
      if (released) return;
      if (document.visibilityState === "visible") {
        requestLock();
      }
    };

    requestLock();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [enabled]);
}
