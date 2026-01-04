import { useState, useRef, useCallback } from 'react';
import { CardElement, ShapeElement, IconElement, StickerElement, LineElement, ImageElement } from '@/types/cardElements';
import {
  Heart,
  Star,
  Crown,
  Sparkles,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Music,
  Camera,
  Gift,
  Cake,
  Baby,
  Church,
  Cross,
  Bird,
  CircleDot,
  GraduationCap,
  Award,
  Trophy,
} from 'lucide-react';

// Icon component mapper
const iconComponents: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heart, Star, Crown, Sparkles, Flower2, Sun, Moon, Cloud,
  Music, Camera, Gift, Cake, Baby, Church, Cross, Bird,
  CircleDot, GraduationCap, Award, Trophy,
};

interface ElementRendererProps {
  element: CardElement;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onImagePanZoom?: (id: string, updates: { scale?: number; panX?: number; panY?: number }) => void;
}

export const ElementRenderer = ({
  element,
  isSelected,
  isDragging,
  onPointerDown,
  onImagePanZoom,
}: ElementRendererProps) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    cursor: element.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  };

  const renderShape = (el: ShapeElement) => {
    const shapeStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: el.fill,
      border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : 'none',
    };

    switch (el.shape) {
      case 'circle':
        return (
          <div
            style={{ ...shapeStyle, borderRadius: '50%' }}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${el.width / 2}px solid transparent`,
              borderRight: `${el.width / 2}px solid transparent`,
              borderBottom: `${el.height}px solid ${el.fill}`,
            }}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          />
        );
      case 'star':
        return (
          <div
            style={baseStyle}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          >
            <svg viewBox="0 0 24 24" fill={el.fill} className="w-full h-full">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
        );
      case 'heart':
        return (
          <div
            style={baseStyle}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          >
            <svg viewBox="0 0 24 24" fill={el.fill} className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      case 'diamond':
        return (
          <div
            style={{
              ...shapeStyle,
              transform: `translate(-50%, -50%) rotate(${el.rotation + 45}deg)`,
            }}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          />
        );
      case 'hexagon':
        return (
          <div
            style={baseStyle}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          >
            <svg viewBox="0 0 24 24" fill={el.fill} className="w-full h-full">
              <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
            </svg>
          </div>
        );
      case 'oval':
        return (
          <div
            style={{ ...shapeStyle, borderRadius: '50%', height: el.height * 0.6 }}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          />
        );
      default: // rectangle
        return (
          <div
            style={{ ...shapeStyle, borderRadius: 4 }}
            onPointerDown={onPointerDown}
            className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          />
        );
    }
  };

  const renderIcon = (el: IconElement) => {
    const IconComponent = iconComponents[el.icon];
    if (!IconComponent) return null;

    return (
      <div
        style={baseStyle}
        onPointerDown={onPointerDown}
        className={isSelected ? 'ring-2 ring-primary ring-offset-2 rounded' : ''}
      >
        <IconComponent className="w-full h-full" style={{ color: el.color }} />
      </div>
    );
  };

  const renderSticker = (el: StickerElement) => {
    return (
      <div
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: el.width * 0.8,
          lineHeight: 1,
        }}
        onPointerDown={onPointerDown}
        className={isSelected ? 'ring-2 ring-primary ring-offset-2 rounded' : ''}
      >
        {el.emoji}
      </div>
    );
  };

  const renderLine = (el: LineElement) => {
    const borderStyle = el.lineStyle === 'dashed' ? 'dashed' : el.lineStyle === 'dotted' ? 'dotted' : 'solid';
    
    return (
      <div
        style={{
          ...baseStyle,
          height: el.thickness,
          backgroundColor: el.lineStyle === 'solid' ? el.color : 'transparent',
          borderTop: el.lineStyle !== 'solid' ? `${el.thickness}px ${borderStyle} ${el.color}` : 'none',
        }}
        onPointerDown={onPointerDown}
        className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      />
    );
  };

  const renderImage = (el: ImageElement) => {
    const scale = el.scale || 1;
    const panX = el.panX || 0;
    const panY = el.panY || 0;
    
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
    const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
    const pointerCache = useRef<Map<number, PointerEvent>>(new Map());

    const getDistance = (p1: PointerEvent, p2: PointerEvent) => {
      return Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
    };

    const handleImagePointerDown = useCallback((e: React.PointerEvent) => {
      if (!isSelected) {
        onPointerDown(e);
        return;
      }
      
      e.stopPropagation();
      pointerCache.current.set(e.pointerId, e.nativeEvent);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      
      if (pointerCache.current.size === 1) {
        // Single pointer - start panning
        setIsPanning(true);
        panStartRef.current = { x: e.clientX, y: e.clientY, panX, panY };
      } else if (pointerCache.current.size === 2) {
        // Two pointers - start pinch zoom
        const pointers = Array.from(pointerCache.current.values());
        pinchStartRef.current = {
          distance: getDistance(pointers[0], pointers[1]),
          scale,
        };
      }
    }, [isSelected, onPointerDown, panX, panY, scale]);

    const handleImagePointerMove = useCallback((e: React.PointerEvent) => {
      if (!isSelected || !onImagePanZoom) return;
      
      pointerCache.current.set(e.pointerId, e.nativeEvent);
      
      if (pointerCache.current.size === 2 && pinchStartRef.current) {
        // Pinch zoom
        const pointers = Array.from(pointerCache.current.values());
        const currentDistance = getDistance(pointers[0], pointers[1]);
        const scaleChange = currentDistance / pinchStartRef.current.distance;
        const newScale = Math.max(0.5, Math.min(3, pinchStartRef.current.scale * scaleChange));
        onImagePanZoom(el.id, { scale: newScale });
      } else if (pointerCache.current.size === 1 && panStartRef.current && isPanning) {
        // Panning
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        const maxPan = (scale - 1) * 50;
        const newPanX = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panX + dx));
        const newPanY = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panY + dy));
        onImagePanZoom(el.id, { panX: newPanX, panY: newPanY });
      }
    }, [isSelected, onImagePanZoom, el.id, isPanning, scale]);

    const handleImagePointerUp = useCallback((e: React.PointerEvent) => {
      pointerCache.current.delete(e.pointerId);
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      
      if (pointerCache.current.size < 2) {
        pinchStartRef.current = null;
      }
      if (pointerCache.current.size === 0) {
        setIsPanning(false);
        panStartRef.current = null;
      }
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
      if (!isSelected || !onImagePanZoom) return;
      e.preventDefault();
      e.stopPropagation();
      
      const delta = -e.deltaY * 0.001;
      const newScale = Math.max(0.5, Math.min(3, scale + delta));
      onImagePanZoom(el.id, { scale: newScale });
    }, [isSelected, onImagePanZoom, el.id, scale]);

    return (
      <div
        style={{
          ...baseStyle,
          overflow: 'hidden',
          borderRadius: el.borderRadius,
          cursor: isSelected ? (isPanning ? 'grabbing' : 'grab') : baseStyle.cursor,
        }}
        onPointerDown={handleImagePointerDown}
        onPointerMove={handleImagePointerMove}
        onPointerUp={handleImagePointerUp}
        onPointerCancel={handleImagePointerUp}
        onWheel={handleWheel}
        className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      >
        <img
          src={el.src}
          alt="Card element"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            objectFit: 'cover',
            transform: `translate(${(1 - scale) * 50 + panX}%, ${(1 - scale) * 50 + panY}%)`,
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>
    );
  };

  switch (element.type) {
    case 'shape':
      return renderShape(element as ShapeElement);
    case 'icon':
      return renderIcon(element as IconElement);
    case 'sticker':
      return renderSticker(element as StickerElement);
    case 'line':
      return renderLine(element as LineElement);
    case 'image':
      return renderImage(element as ImageElement);
    default:
      return null;
  }
};
