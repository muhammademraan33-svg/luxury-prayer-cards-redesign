import { useState, useRef, useEffect } from 'react';
import { CardSideData, backgroundTextures, TextElement } from '@/types/businessCard';
import { CardElement } from '@/types/cardElements';
import { ElementRenderer } from '@/components/elements/ElementRenderer';
import { Input } from '@/components/ui/input';

interface EditorCanvasProps {
  sideData: CardSideData;
  orientation: 'landscape' | 'portrait';
  zoom: number;
  onTextUpdate: (texts: TextElement[]) => void;
  onElementsUpdate: (elements: CardElement[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null, type: 'text' | 'element' | null) => void;
}

export const EditorCanvas = ({
  sideData,
  orientation,
  zoom,
  onTextUpdate,
  onElementsUpdate,
  selectedId,
  onSelect,
}: EditorCanvasProps) => {
  const baseWidth = orientation === 'landscape' ? 400 : 260;
  const baseHeight = orientation === 'landscape' ? 260 : 400;
  const width = baseWidth * zoom;
  const height = baseHeight * zoom;

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState<'text' | 'element' | null>(null);

  const [activePointerId, setActivePointerId] = useState<number | null>(null);
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | null>(null);
  const [itemStart, setItemStart] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const elements = sideData.elements || [];

  useEffect(() => {
    if (editingTextId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTextId]);

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
    const borderWidth = 3 * zoom;

    switch (sideData.frameStyle) {
      case 'solid':
        return { border: `${borderWidth}px solid ${color}` };
      case 'double':
        return { border: `${borderWidth + 1}px double ${color}` };
      case 'ornate':
        return {
          border: `${borderWidth - 1}px solid ${color}`,
          boxShadow: `inset 0 0 0 ${4 * zoom}px transparent, inset 0 0 0 ${6 * zoom}px ${color}`,
        };
      case 'dashed':
        return { border: `${borderWidth}px dashed ${color}` };
      case 'dotted':
        return { border: `${borderWidth}px dotted ${color}` };
      default:
        return {};
    }
  };

  const handleTextChange = (textId: string, newContent: string) => {
    const updatedTexts = sideData.texts.map((t) =>
      t.id === textId ? { ...t, content: newContent } : t
    );
    onTextUpdate(updatedTexts);
  };

  const stopPointerInteraction = () => {
    setActivePointerId(null);
    setPointerStart(null);
    setItemStart(null);
    setHasMoved(false);
    setDraggingId(null);
    setDraggingType(null);
  };

  const getTextPosition = (textEl: TextElement, index: number) => {
    if (textEl.style.x !== undefined && textEl.style.y !== undefined) {
      return { x: textEl.style.x * zoom, y: textEl.style.y * zoom };
    }
    const totalTexts = sideData.texts.length;
    const spacing = 30 * zoom;
    const startY = (height - (totalTexts - 1) * spacing) / 2;
    return { x: width / 2, y: startY + index * spacing };
  };

  const handleTextPointerDown = (e: React.PointerEvent, textId: string, index: number) => {
    e.stopPropagation();
    if (editingTextId && editingTextId !== textId) setEditingTextId(null);

    onSelect(textId, 'text');
    const textEl = sideData.texts.find((t) => t.id === textId)!;
    const pos = { x: textEl.style.x, y: textEl.style.y };

    setDraggingType('text');
    setActivePointerId(e.pointerId);
    setPointerStart({ x: e.clientX, y: e.clientY });
    setItemStart(pos);
    setHasMoved(false);

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleElementPointerDown = (e: React.PointerEvent, elementId: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === elementId);
    if (!element || element.locked) return;

    if (editingTextId) setEditingTextId(null);
    onSelect(elementId, 'element');

    setDraggingType('element');
    setActivePointerId(e.pointerId);
    setPointerStart({ x: e.clientX, y: e.clientY });
    setItemStart({ x: element.x, y: element.y });
    setHasMoved(false);

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleCardPointerMove = (e: React.PointerEvent) => {
    if (!selectedId || !pointerStart || !itemStart) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;

    const dx = (e.clientX - pointerStart.x) / zoom;
    const dy = (e.clientY - pointerStart.y) / zoom;
    const threshold = 3;

    const moved = Math.abs(dx) + Math.abs(dy) > threshold;
    if (!hasMoved && moved) {
      setHasMoved(true);
      setDraggingId(selectedId);
    }

    if (!moved) return;

    const x = Math.max(20, Math.min(baseWidth - 20, itemStart.x + dx));
    const y = Math.max(20, Math.min(baseHeight - 20, itemStart.y + dy));

    if (draggingType === 'text') {
      const updatedTexts = sideData.texts.map((t) =>
        t.id === selectedId ? { ...t, style: { ...t.style, x, y } } : t
      );
      onTextUpdate(updatedTexts);
    } else if (draggingType === 'element') {
      const updatedElements = elements.map((el) =>
        el.id === selectedId ? { ...el, x, y } : el
      );
      onElementsUpdate(updatedElements);
    }
  };

  const handleCardPointerUp = (e: React.PointerEvent) => {
    if (!selectedId) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;

    const didMove = hasMoved;
    const tappedId = selectedId;
    const type = draggingType;

    stopPointerInteraction();

    if (!didMove && type === 'text') {
      setEditingTextId(tappedId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === cardRef.current) {
      onSelect(null, null);
      setEditingTextId(null);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/30 overflow-auto p-8">
      <div
        ref={cardRef}
        className="relative rounded-sm shadow-2xl"
        style={{
          width,
          height,
          ...getBackgroundStyle(),
          ...getFrameStyle(),
          cursor: draggingId ? 'grabbing' : 'default',
        }}
        onClick={handleCanvasClick}
        onPointerMove={handleCardPointerMove}
        onPointerUp={handleCardPointerUp}
        onPointerCancel={stopPointerInteraction}
      >
        {/* Elements Layer */}
        {elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={{
              ...element,
              x: element.x * zoom,
              y: element.y * zoom,
              width: element.width * zoom,
              height: element.height * zoom,
            }}
            isSelected={selectedId === element.id}
            isDragging={draggingId === element.id}
            onPointerDown={(e) => handleElementPointerDown(e, element.id)}
            onImagePanZoom={(id, updates) => {
              const updatedElements = elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
              );
              onElementsUpdate(updatedElements);
            }}
          />
        ))}

        {/* Text Layer */}
        {sideData.texts.map((textEl, index) => {
          const isEditing = editingTextId === textEl.id;
          const isSelected = selectedId === textEl.id;
          const isDragging = draggingId === textEl.id;
          const pos = getTextPosition(textEl, index);

          return (
            <div
              key={textEl.id}
              className={`absolute transition-shadow ${
                !isEditing ? 'cursor-grab hover:ring-2 hover:ring-primary/50 rounded' : ''
              } ${isDragging ? 'cursor-grabbing' : ''} ${
                isSelected ? 'ring-2 ring-primary rounded' : ''
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) scale(${textEl.style.scaleX}, ${textEl.style.scaleY})`,
                fontFamily: textEl.style.fontFamily,
                fontSize: textEl.style.fontSize * zoom,
                color: textEl.style.color,
                whiteSpace: 'nowrap',
                touchAction: !isEditing ? 'none' : 'auto',
              }}
              onPointerDown={(e) => handleTextPointerDown(e, textEl.id, index)}
            >
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={textEl.content}
                  onChange={(e) => handleTextChange(textEl.id, e.target.value)}
                  onBlur={() => setEditingTextId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      setEditingTextId(null);
                    }
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="bg-background/90 text-foreground min-w-[100px] text-center p-1 h-auto"
                  style={{
                    fontFamily: textEl.style.fontFamily,
                    fontSize: textEl.style.fontSize * zoom,
                  }}
                />
              ) : (
                <span className="px-1">{textEl.content || 'Double-click to edit'}</span>
              )}
            </div>
          );
        })}

        {/* Logo overlay */}
        {sideData.logo && (
          <img
            src={sideData.logo}
            alt="Card logo"
            className="absolute pointer-events-none"
            style={{
              left: sideData.logoX * zoom,
              top: sideData.logoY * zoom,
              transform: `translate(-50%, -50%) scale(${sideData.logoScale})`,
              opacity: sideData.logoOpacity,
              maxWidth: '40%',
              maxHeight: '40%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Metallic shine effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />
      </div>
    </div>
  );
};
