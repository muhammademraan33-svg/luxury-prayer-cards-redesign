import { useLayoutEffect, useRef, useState } from "react";

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
  }, [text, minScale]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ maxWidth, display: "flex", justifyContent: "center" }}
    >
      <span
        ref={textRef}
        style={{
          ...style,
          display: "inline-block",
          whiteSpace: "nowrap",
          lineHeight: 1,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {text}
      </span>
    </div>
  );
}
