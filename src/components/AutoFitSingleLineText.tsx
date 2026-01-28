import { useLayoutEffect, useRef, useState, useCallback, useEffect, forwardRef } from "react";

type AutoFitSingleLineTextProps = {
  text: string;
  minScale?: number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  /** Fixed container width - container will NOT change size based on content */
  containerWidth?: string | number;
};

/**
 * AutoFitSingleLineText renders text within a FIXED bounding container.
 * The container size is locked; only the content scales to fit.
 * Content that would overflow is scaled down (never clips or overflows).
 */
export const AutoFitSingleLineText = forwardRef<HTMLDivElement, AutoFitSingleLineTextProps>(
  function AutoFitSingleLineText({
    text,
    minScale = 0.55,
    maxWidth = "100%",
    className,
    style,
    containerWidth,
  }, forwardedRef) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const [scale, setScale] = useState(1);
    const computeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastComputedScaleRef = useRef(1);

    const compute = useCallback(() => {
      const container = containerRef.current;
      const el = textRef.current;
      if (!container || !el) return;

      // Temporarily reset scale to measure natural width
      el.style.transform = 'scale(1)';
      
      const available = container.clientWidth;
      const needed = el.scrollWidth;
      
      if (!available || !needed || available <= 0 || needed <= 0) {
        setScale(1);
        lastComputedScaleRef.current = 1;
        return;
      }
      
      // Calculate scale to fit content within container
      const next = Math.min(1, Math.max(minScale, available / needed));
      
      // Only update if change is significant to prevent jitter (> 1% change)
      if (Math.abs(lastComputedScaleRef.current - next) > 0.01) {
        lastComputedScaleRef.current = next;
        setScale(next);
      }
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

    // Recompute when text or style changes
    useEffect(() => {
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
      computeTimeoutRef.current = setTimeout(compute, 10);
    }, [text, style?.fontSize, compute]);

    // Container has FIXED dimensions - never changes based on content
    const containerStyle: React.CSSProperties = {
      width: containerWidth || '100%',
      maxWidth,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden", // CRITICAL: Never allow overflow
      position: "relative",
    };

    // Combine refs
    const setRefs = useCallback((node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    }, [forwardedRef]);

    return (
      <div
        ref={setRefs}
        className={className}
        style={containerStyle}
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
            // Prevent any overflow from scaled content
            maxWidth: '100%',
          }}
        >
          {text}
        </span>
      </div>
    );
  }
);
