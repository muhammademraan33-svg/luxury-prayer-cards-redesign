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
  const computeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const compute = useCallback(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const available = container.clientWidth;
    const needed = el.scrollWidth;
    
    if (!available || !needed || available <= 0 || needed <= 0) {
      setScale(1);
      return;
    }
    
    const next = Math.min(1, Math.max(minScale, available / needed));
    // Only update if change is significant to prevent jitter
    setScale(prev => Math.abs(prev - next) > 0.01 ? next : prev);
  }, [minScale]);

  useLayoutEffect(() => {
    // Debounce compute to prevent rapid re-renders
    if (computeTimeoutRef.current) {
      clearTimeout(computeTimeoutRef.current);
    }
    
    computeTimeoutRef.current = setTimeout(() => {
      compute();
    }, 10);

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
      computeTimeoutRef.current = setTimeout(compute, 10);
    });
    ro.observe(container);

    // Also recompute when fonts load
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).fonts?.ready?.then?.(() => {
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
      computeTimeoutRef.current = setTimeout(compute, 50);
    }).catch?.(() => undefined);

    return () => {
      ro.disconnect();
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
    };
  }, [text, minScale, compute]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        maxWidth, 
        width: "100%",
        display: "flex", 
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        ref={textRef}
        style={{
          ...style,
          display: "inline-block",
          whiteSpace: "nowrap",
          lineHeight: 1.2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: scale < 1 ? 'transform' : 'auto',
        }}
      >
        {text}
      </span>
    </div>
  );
}
