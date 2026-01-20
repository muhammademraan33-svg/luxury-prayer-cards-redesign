import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

type QrErrorLevel = "L" | "M" | "Q" | "H";

interface QrCodeBadgeProps {
  value: string;
  size: number;
  /** Defaults to "M" (often scans more reliably than "H" at smaller sizes). */
  level?: QrErrorLevel;
  /** Extra classes for the outer badge container. */
  className?: string;
  /** Extra classes for the padding wrapper (controls quiet zone). */
  paddingClassName?: string;
}

export function QrCodeBadge({
  value,
  size,
  level = "M",
  className,
  paddingClassName,
}: QrCodeBadgeProps) {
  return (
    <div
      className={cn("rounded-lg", className)}
      style={{
        backgroundColor: "hsl(var(--qr-bg))",
        color: "hsl(var(--qr-fg))",
      }}
    >
      <div className={cn("p-3", paddingClassName)}>
        <QRCodeSVG
          value={value}
          size={size}
          level={level}
          includeMargin={true}
          fgColor="currentColor"
          bgColor="transparent"
          shapeRendering="crispEdges"
          style={{ shapeRendering: "crispEdges" }}
        />
      </div>
    </div>
  );
}
