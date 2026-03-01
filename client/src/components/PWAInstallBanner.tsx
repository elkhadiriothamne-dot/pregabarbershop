import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "pwa_install_banner_dismissed";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    ("standalone" in window.navigator && (window.navigator as any).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export function PWAInstallBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isIOS() && !isStandalone() && !isDismissed()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setVisible(false);
  };

  return (
    <div
      data-testid="banner-pwa-install"
      className="fixed bottom-0 inset-x-0 z-[9999] bg-card border-t p-3 flex items-start gap-3 shadow-lg animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm" data-testid="text-pwa-install-title">
          {t("pwa.installTitle")}
        </p>
        <p className="text-xs text-muted-foreground mt-1" data-testid="text-pwa-install-instructions">
          {t("pwa.installInstructions")}
          <Share className="inline-block w-3.5 h-3.5 mx-1 align-text-bottom" />
          {t("pwa.installInstructions2")}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={dismiss}
        data-testid="button-pwa-install-dismiss"
        aria-label={t("common.close")}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
