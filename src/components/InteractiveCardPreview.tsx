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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

    const texture = backgroundTextures.find(t => t.value === sideData.background.texture);
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

  const handleTextClick = (e: React.MouseEvent, textId: string) => {
    if (!editable) return;
    e.stopPropagation();
    setEditingId(textId);
  };

  const handleTextChange = (textId: string, newContent: string) => {
    if (!onTextUpdate) return;
    const updatedTexts = sideData.texts.map(t => 
      t.id === textId ? { ...t, content: newContent } : t
    );
    onTextUpdate(updatedTexts);
  };

  const handleInputBlur = () => {
    setEditingId(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, textId: string) => {
    if (!editable || editingId === textId) return;
    e.preventDefault();
    
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return;
    
    const text = sideData.texts.find(t => t.id === textId);
    if (!text) return;
    
    setDraggingId(textId);
    setDragOffset({
      x: e.clientX - cardRect.left - (text.style.x || width / 2),
      y: e.clientY - cardRect.top - (text.style.y || height / 2)
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !cardRef.current || !onTextUpdate) return;
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(width - 20, e.clientX - cardRect.left - dragOffset.x));
    const y = Math.max(20, Math.min(height - 20, e.clientY - cardRect.top - dragOffset.y));
    
    const updatedTexts = sideData.texts.map(t => 
      t.id === draggingId 
        ? { ...t, style: { ...t.style, x, y } } 
        : t
    );
    onTextUpdate(updatedTexts);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
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

  return (
    <div
      ref={cardRef}
      className="metal-card relative overflow-hidden rounded-sm select-none"
      style={{
        width,
        height,
        ...getBackgroundStyle(),
        ...getFrameStyle(),
        cursor: draggingId ? 'grabbing' : 'default',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
            className={`absolute transition-shadow ${editable && !isEditing ? 'cursor-grab hover:ring-2 hover:ring-primary/50 rounded' : ''} ${isDragging ? 'cursor-grabbing ring-2 ring-primary' : ''}`}
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${textEl.style.scaleX}, ${textEl.style.scaleY})`,
              fontFamily: textEl.style.fontFamily,
              fontSize: textEl.style.fontSize,
              color: textEl.style.color,
              whiteSpace: 'nowrap',
            }}
            onClick={(e) => handleTextClick(e, textEl.id)}
            onMouseDown={(e) => handleMouseDown(e, textEl.id)}
          >
            {isEditing ? (
              <Input
                ref={inputRef}
                value={textEl.content}
                onChange={(e) => handleTextChange(textEl.id, e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="bg-white/90 text-black min-w-[100px] text-center p-1 h-auto"
                style={{
                  fontFamily: textEl.style.fontFamily,
                  fontSize: textEl.style.fontSize,
                }}
              />
            ) : (
              <span className={editable ? 'pointer-events-none' : ''}>
                {textEl.content || 'Click to edit'}
              </span>
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
        />
      )}

      {/* Subtle metallic shine effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />
      
      {/* Edit hint */}
      {editable && !editingId && !draggingId && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/70 bg-background/80 px-2 py-0.5 rounded">
          Click text to edit • Drag to move
        </div>
      )}
    </div>
  );
};
