import { useState, useRef, useEffect } from 'react';
import { CardSideData, backgroundTextures, TextElement } from '@/types/businessCard';
import { Input } from '@/components/ui/input';

interface InteractiveCardPreviewProps {
  sideData: CardSideData;
  orientation: 'landscape' | 'portrait';
  onTextUpdate?: (texts: TextElement[]) => void;
  editable?: boolean;
}

export const InteractiveCardPreview = ({ 
  sideData, 
  orientation, 
  onTextUpdate,
  editable = false 
}: InteractiveCardPreviewProps) => {
  const width = orientation === 'landscape' ? 400 : 260;
  const height = orientation === 'landscape' ? 260 : 400;
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Pointer/touch handling (mobile-friendly)
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [activePointerId, setActivePointerId] = useState<number | null>(null);
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | null>(null);
  const [textStart, setTextStart] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const getBackgroundStyle = (): React.CSSProperties => {
    if (sideData.background.texture === 'custom-photo' && sideData.background.customImage) {
      return {
        backgroundImage: `url(${sideData.background.customImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    const texture = backgroundTextures.find((t) => t.value === sideData.background.texture);
    if (texture) {
      const base: React.CSSProperties = { background: texture.preview };

      if (sideData.background.texture.startsWith('brushed')) {
        return {
          ...base,
          backgroundImage: `${texture.preview}, repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)`,
        };
      }

      return base;
    }

    return { backgroundColor: '#fefefe' };
  };

  const getFrameStyle = (): React.CSSProperties => {
    const color = sideData.frameColor;

    switch (sideData.frameStyle) {
      case 'solid':
        return { border: `3px solid ${color}` };
      case 'double':
        return { border: `4px double ${color}` };
      case 'gradient':
        return {
          border: '3px solid transparent',
          backgroundImage: `${getBackgroundStyle().background || '#fff'}, linear-gradient(135deg, ${color}, #f5d77a)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        };
      case 'ornate':
        return {
          border: `2px solid ${color}`,
          boxShadow: `inset 0 0 0 4px transparent, inset 0 0 0 6px ${color}`,
        };
      case 'dashed':
        return { border: `3px dashed ${color}` };
      case 'dotted':
        return { border: `3px dotted ${color}` };
      case 'inset':
        return {
          border: `2px solid ${color}`,
          boxShadow: `inset 0 0 0 8px transparent, inset 0 0 0 10px ${color}`,
        };
      case 'shadow':
        return {
          border: `2px solid ${color}`,
          boxShadow: `4px 4px 0 rgba(0,0,0,0.2)`,
        };
      default:
        return {};
    }
  };

  const renderCornerFrame = () => {
    if (sideData.frameStyle !== 'corner') return null;
    const color = sideData.frameColor;

    return (
      <>
        <div className="absolute top-3 left-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute top-3 left-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        <div className="absolute top-3 right-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute top-3 right-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 left-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 left-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 right-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 right-3 w-0.5 h-6" style={{ backgroundColor: color }} />
      </>
    );
  };

  const handleTextChange = (textId: string, newContent: string) => {
    if (!onTextUpdate) return;
    const updatedTexts = sideData.texts.map((t) => (t.id === textId ? { ...t, content: newContent } : t));
    onTextUpdate(updatedTexts);
  };

  const stopPointerInteraction = () => {
    setActivePointerId(null);
    setActiveTextId(null);
    setPointerStart(null);
    setTextStart(null);
    setHasMoved(false);
    setDraggingId(null);
  };

  const handleInputBlur = () => {
    setEditingId(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Calculate text positions - stack vertically in center by default
  const getTextPosition = (textEl: TextElement, index: number) => {
    if (textEl.style.x !== undefined && textEl.style.y !== undefined) {
      return { x: textEl.style.x, y: textEl.style.y };
    }
    // Default: stack vertically centered
    const totalTexts = sideData.texts.length;
    const spacing = 30;
    const startY = (height - (totalTexts - 1) * spacing) / 2;
    return { x: width / 2, y: startY + index * spacing };
  };

  const handleTextPointerDown = (e: React.PointerEvent, textId: string, index: number) => {
    if (!editable) return;
    // If an input is open, tapping elsewhere should close it.
    if (editingId && editingId !== textId) setEditingId(null);

    const pos = getTextPosition(sideData.texts.find((t) => t.id === textId)!, index);

    setActiveTextId(textId);
    setActivePointerId(e.pointerId);
    setPointerStart({ x: e.clientX, y: e.clientY });
    setTextStart({ x: pos.x, y: pos.y });
    setHasMoved(false);

    // Keep receiving events even if pointer leaves the element while dragging.
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleCardPointerMove = (e: React.PointerEvent) => {
    if (!activeTextId || !onTextUpdate) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;
    if (!pointerStart || !textStart) return;

    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const threshold = 3;

    const moved = Math.abs(dx) + Math.abs(dy) > threshold;
    if (!hasMoved && moved) {
      setHasMoved(true);
      setDraggingId(activeTextId);
    }

    if (!moved) return;

    const x = Math.max(20, Math.min(width - 20, textStart.x + dx));
    const y = Math.max(20, Math.min(height - 20, textStart.y + dy));

    const updatedTexts = sideData.texts.map((t) =>
      t.id === activeTextId ? { ...t, style: { ...t.style, x, y } } : t
    );
    onTextUpdate(updatedTexts);
  };

  const handleCardPointerUp = (e: React.PointerEvent) => {
    if (!activeTextId) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;

    const didMove = hasMoved;
    const tappedTextId = activeTextId;

    stopPointerInteraction();

    // Tap (no drag) => enter edit mode (mobile-friendly)
    if (editable && !didMove) {
      setEditingId(tappedTextId);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`metal-card relative overflow-hidden rounded-sm ${editingId ? '' : 'select-none'}`}
      style={{
        width,
        height,
        ...getBackgroundStyle(),
        ...getFrameStyle(),
        cursor: draggingId ? 'grabbing' : 'default',
      }}
      onPointerMove={handleCardPointerMove}
      onPointerUp={handleCardPointerUp}
      onPointerCancel={stopPointerInteraction}
      onPointerLeave={stopPointerInteraction}
    >
      {renderCornerFrame()}

      {/* Text Content - Positioned absolutely */}
      {sideData.texts.map((textEl, index) => {
        const isEditing = editingId === textEl.id;
        const isDragging = draggingId === textEl.id;
        const pos = getTextPosition(textEl, index);

        return (
          <div
            key={textEl.id}
            className={`absolute transition-shadow ${
              editable && !isEditing ? 'cursor-grab hover:ring-2 hover:ring-primary/50 rounded' : ''
            } ${isDragging ? 'cursor-grabbing ring-2 ring-primary' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${textEl.style.scaleX}, ${textEl.style.scaleY})`,
              fontFamily: textEl.style.fontFamily,
              fontSize: textEl.style.fontSize,
              color: textEl.style.color,
              whiteSpace: 'nowrap',
              touchAction: editable && !isEditing ? 'none' : 'auto',
            }}
            onPointerDown={(e) => handleTextPointerDown(e, textEl.id, index)}
          >
            {isEditing ? (
              <Input
                ref={inputRef}
                value={textEl.content}
                onChange={(e) => handleTextChange(textEl.id, e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-background/90 text-foreground min-w-[100px] text-center p-1 h-auto"
                style={{
                  fontFamily: textEl.style.fontFamily,
                  fontSize: textEl.style.fontSize,
                }}
              />
            ) : (
              <span>{textEl.content || 'Tap to edit'}</span>
            )}
          </div>
        );
      })}

      {/* Logo overlay */}
      {sideData.logo && (
        <img
          src={sideData.logo}
          alt="Card logo"
          className="absolute"
          style={{
            left: sideData.logoX,
            top: sideData.logoY,
            transform: `translate(-50%, -50%) scale(${sideData.logoScale})`,
            opacity: sideData.logoOpacity,
            maxWidth: '40%',
            maxHeight: '40%',
            objectFit: 'contain',
          }}
          loading="lazy"
        />
      )}

      {/* Subtle metallic shine effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Edit hint */}
      {editable && !editingId && !draggingId && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/70 bg-background/80 px-2 py-0.5 rounded">
          Tap text to edit • Drag to move
        </div>
      )}
    </div>
  );
};
