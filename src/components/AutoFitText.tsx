import { useLayoutEffect, useRef, useState, useCallback, useEffect, forwardRef } from "react";

type AutoFitTextProps = {
  text: string;
  minScale?: number;
  maxWidth?: string | number;
  className?: string;
  style?: React.CSSProperties;
  allowWrap?: boolean;
  /** Fixed container width - container will NOT change size based on content */
  containerWidth?: string | number;
  /** Fixed container height - for vertical containment */
  containerHeight?: string | number;
};

/**
 * AutoFitText renders text within a FIXED bounding container.
 * The container size is locked; only the content scales to fit.
 * Content that would overflow is scaled down (never clips or overflows).
 */
export const AutoFitText = forwardRef<HTMLDivElement, AutoFitTextProps>(
  function AutoFitText({
    text,
    minScale = 0.55,
    maxWidth = "100%",
    className,
    style,
    allowWrap = false,
    containerWidth,
    containerHeight,
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

      // Temporarily reset scale to measure natural dimensions
      el.style.transform = 'scale(1)';

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      const neededWidth = el.scrollWidth;
      const neededHeight = el.scrollHeight;
      
      if (!availableWidth || !neededWidth || availableWidth <= 0 || neededWidth <= 0) {
        setScale(1);
        lastComputedScaleRef.current = 1;
        return;
      }
      
      // If wrapping is allowed and content would need significant shrinking,
      // let it wrap naturally instead of scaling down too much
      if (allowWrap && availableWidth / neededWidth < 0.85) {
        setScale(1);
        lastComputedScaleRef.current = 1;
        return;
      }
      
      // Calculate scale needed to fit width
      let next = Math.min(1, availableWidth / neededWidth);
      
      // Also check height if container has defined height
      if (containerHeight && availableHeight > 0 && neededHeight > availableHeight) {
        next = Math.min(next, availableHeight / neededHeight);
      }
      
      // Clamp to minimum scale
      next = Math.max(minScale, next);
      
      // Only update if change is significant to prevent jitter (> 1% change)
      if (Math.abs(lastComputedScaleRef.current - next) > 0.01) {
        lastComputedScaleRef.current = next;
        setScale(next);
      }
    }, [minScale, allowWrap, containerHeight]);

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
    }, [text, minScale, allowWrap, containerHeight, compute]);

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
      height: containerHeight,
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
            whiteSpace: allowWrap ? "normal" : "nowrap",
            wordBreak: allowWrap ? "break-word" : undefined,
            lineHeight: 1.2,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: "center center",
            textAlign: "center",
            willChange: scale < 1 ? 'transform' : 'auto',
            maxWidth: '100%',
          }}
        >
          {text}
        </span>
      </div>
    );
  }
);
