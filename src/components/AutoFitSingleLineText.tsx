import { useLayoutEffect, useRef, useState, useCallback } from "react";

type AutoFitSingleLineTextProps = {
  text: string;
  minScale?: number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
};

export function AutoFitSingleLineText({
  text,
  minScale = 0.55,
  maxWidth = "90%",
  className,
  style,
}: AutoFitSingleLineTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [scale, setScale] = useState(1);
  const lastTextRef = useRef(text);
  const stableScaleRef = useRef(1);

  const compute = useCallback(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const available = container.clientWidth;
    const needed = el.scrollWidth;
    
    if (!available || !needed) {
      setScale(1);
      stableScaleRef.current = 1;
      return;
    }
    
    const next = Math.min(1, Math.max(minScale, available / needed));
    
    // Prevent oscillation: only update if change is significant (>1%)
    // or if text content actually changed
    const textChanged = lastTextRef.current !== text;
    const significantChange = Math.abs(next - stableScaleRef.current) > 0.01;
    
    if (textChanged || significantChange) {
      stableScaleRef.current = next;
      setScale(next);
      lastTextRef.current = text;
    }
  }, [text, minScale]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial compute
    compute();

    // Debounced resize observer to prevent jitter
    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    });
    ro.observe(container);

    // Also recompute when fonts load
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).fonts?.ready?.then?.(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    }).catch?.(() => undefined);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [compute]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        maxWidth, 
        width: "100%",
        display: "flex", 
        justifyContent: "center",
        overflow: "hidden", // Prevent any overflow
      }}
    >
      <span
        ref={textRef}
        style={{
          ...style,
          display: "inline-block",
          whiteSpace: "nowrap",
          lineHeight: 1.2,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
          maxWidth: "100%", // Ensure text doesn't exceed container
        }}
      >
        {text}
      </span>
    </div>
  );
}
