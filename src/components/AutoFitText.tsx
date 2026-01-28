import { useLayoutEffect, useRef, useState } from "react";

type AutoFitTextProps = {
  text: string;
  minScale?: number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  allowWrap?: boolean;
};

export function AutoFitText({
  text,
  minScale = 0.55,
  maxWidth = "90%",
  className,
  style,
  allowWrap = false,
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const compute = () => {
      const available = container.clientWidth;
      const needed = el.scrollWidth;
      if (!available || !needed) {
        setScale(1);
        return;
      }
      
      // If wrapping is allowed and content would need significant shrinking,
      // let it wrap naturally instead of scaling down too much
      if (allowWrap && available / needed < 0.85) {
        setScale(1);
        return;
      }
      
      const next = Math.min(1, Math.max(minScale, available / needed));
      setScale(next);
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(container);

    // Also recompute when fonts load
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).fonts?.ready?.then?.(compute).catch?.(() => undefined);

    return () => ro.disconnect();
  }, [text, minScale, allowWrap]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        maxWidth, 
        display: "flex", 
        justifyContent: "center",
        overflow: "visible",
        width: "100%",
      }}
    >
      <span
        ref={textRef}
        style={{
          ...style,
          display: "inline-block",
          whiteSpace: allowWrap ? "normal" : "nowrap",
          wordBreak: allowWrap ? "break-word" : undefined,
          lineHeight: 1.2,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
          overflow: "visible",
          textAlign: "center",
        }}
      >
        {text}
      </span>
    </div>
  );
}
