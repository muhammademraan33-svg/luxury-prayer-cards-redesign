import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';

interface BoundedContainerProps {
  /** Content to render inside the bounded container */
  children: React.ReactNode;
  /** Fixed maximum width in pixels or percentage */
  maxWidth: number | string;
  /** Fixed maximum height in pixels or percentage (optional) */
  maxHeight?: number | string;
  /** Minimum scale before content gets clipped (default: 0.5) */
  minScale?: number;
  /** Additional className for the outer container */
  className?: string;
  /** Style for the outer container */
  style?: React.CSSProperties;
  /** Whether to center content horizontally */
  centerHorizontal?: boolean;
  /** Whether to center content vertically */
  centerVertical?: boolean;
  /** Callback when scale changes */
  onScaleChange?: (scale: number) => void;
}

/**
 * BoundedContainer ensures content never exceeds its defined boundaries.
 * Content is scaled down (not the container) when it would overflow.
 * The container size remains fixed regardless of content scaling.
 */
export function BoundedContainer({
  children,
  maxWidth,
  maxHeight,
  minScale = 0.5,
  className = '',
  style,
  centerHorizontal = true,
  centerVertical = false,
  onScaleChange,
}: BoundedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const computeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScaleRef = useRef(1);

  const compute = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Reset scale to measure natural size
    content.style.transform = 'scale(1)';
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const contentWidth = content.scrollWidth;
    const contentHeight = content.scrollHeight;

    if (containerWidth <= 0 || contentWidth <= 0) {
      setScale(1);
      return;
    }

    // Calculate scale needed to fit width
    let newScale = 1;
    if (contentWidth > containerWidth) {
      newScale = Math.min(newScale, containerWidth / contentWidth);
    }

    // Also check height if maxHeight is set
    if (maxHeight && containerHeight > 0 && contentHeight > containerHeight) {
      newScale = Math.min(newScale, containerHeight / contentHeight);
    }

    // Clamp to minimum scale
    newScale = Math.max(minScale, newScale);

    // Only update if change is significant (>1% difference)
    if (Math.abs(lastScaleRef.current - newScale) > 0.01) {
      lastScaleRef.current = newScale;
      setScale(newScale);
      onScaleChange?.(newScale);
    }
  }, [minScale, maxHeight, onScaleChange]);

  useLayoutEffect(() => {
    // Debounce compute to prevent rapid re-renders
    if (computeTimeoutRef.current) {
      clearTimeout(computeTimeoutRef.current);
    }

    computeTimeoutRef.current = setTimeout(compute, 10);

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
      computeTimeoutRef.current = setTimeout(compute, 10);
    });
    ro.observe(container);

    // Recompute when fonts load
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
  }, [compute, children]);

  const containerStyle: React.CSSProperties = {
    width: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    height: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : 'auto',
    maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
    overflow: 'hidden',
    display: 'flex',
    alignItems: centerVertical ? 'center' : 'flex-start',
    justifyContent: centerHorizontal ? 'center' : 'flex-start',
    ...style,
  };

  const contentStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: centerHorizontal ? 'center' : 'left',
    whiteSpace: 'nowrap',
    willChange: scale < 1 ? 'transform' : 'auto',
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <div ref={contentRef} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

/**
 * Hook to track initial slider value and detect when it returns to initial
 */
export function useSliderResetTracking<T extends number | string>(
  initialValue: T,
  currentValue: T,
  tolerance: number = 0.5
) {
  const initialRef = useRef<T>(initialValue);
  const [isAtInitial, setIsAtInitial] = useState(true);

  useLayoutEffect(() => {
    // Store the very first value as the initial
    if (initialRef.current === undefined) {
      initialRef.current = initialValue;
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof currentValue === 'number' && typeof initialRef.current === 'number') {
      const diff = Math.abs(currentValue - initialRef.current);
      setIsAtInitial(diff <= tolerance);
    } else {
      setIsAtInitial(currentValue === initialRef.current);
    }
  }, [currentValue, tolerance]);

  return {
    isAtInitial,
    initialValue: initialRef.current,
    reset: () => initialRef.current,
  };
}
