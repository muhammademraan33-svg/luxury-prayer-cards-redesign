import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, FabricObject } from 'fabric';
import { BusinessCardData, TextElementStyle } from '@/types/businessCard';

// Extend FabricObject to include custom name property
declare module 'fabric' {
  interface FabricObject {
    name?: string;
  }
}

interface InteractiveCardCanvasProps {
  data: BusinessCardData;
  onUpdate: (updates: Partial<BusinessCardData>) => void;
  onExport: (canvas: HTMLCanvasElement) => void;
}

export const InteractiveCardCanvas = ({ data, onUpdate, onExport }: InteractiveCardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const objectsRef = useRef<Map<string, FabricText | FabricImage>>(new Map());

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 260;

  const getFrameStyles = useCallback(() => {
    switch (data.frameStyle) {
      case 'solid':
        return { strokeWidth: 2, stroke: data.frameColor };
      case 'double':
        return { strokeWidth: 4, stroke: data.frameColor };
      case 'gradient':
      case 'ornate':
        return { strokeWidth: 3, stroke: data.frameColor };
      default:
        return { strokeWidth: 0, stroke: 'transparent' };
    }
  }, [data.frameStyle, data.frameColor]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: data.backgroundColor,
      selection: true,
    });

    fabricRef.current = canvas;

    // Expose export function
    const exportCanvas = () => {
      if (fabricRef.current) {
        canvas.discardActiveObject();
        canvas.renderAll();
        const exportedCanvas = canvas.toCanvasElement(3);
        onExport(exportedCanvas);
      }
    };
    
    (window as any).__exportCardCanvas = exportCanvas;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      delete (window as any).__exportCardCanvas;
    };
  }, []);

  // Update background and frame
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.backgroundColor = data.backgroundColor;
    
    // Update or create frame
    const existingFrame = canvas.getObjects().find(obj => obj.name === 'frame');
    if (existingFrame) {
      canvas.remove(existingFrame);
    }

    const frameStyles = getFrameStyles();
    if (frameStyles.strokeWidth > 0) {
      const frame = new Rect({
        left: frameStyles.strokeWidth / 2,
        top: frameStyles.strokeWidth / 2,
        width: CANVAS_WIDTH - frameStyles.strokeWidth,
        height: CANVAS_HEIGHT - frameStyles.strokeWidth,
        fill: 'transparent',
        stroke: frameStyles.stroke,
        strokeWidth: frameStyles.strokeWidth,
        rx: data.borderRadius,
        ry: data.borderRadius,
        selectable: false,
        evented: false,
        name: 'frame',
      });
      canvas.add(frame);
      canvas.sendObjectToBack(frame);
    }

    // Add ornate inner frame
    if (data.frameStyle === 'ornate') {
      const innerFrame = canvas.getObjects().find(obj => obj.name === 'innerFrame');
      if (innerFrame) canvas.remove(innerFrame);
      
      const inner = new Rect({
        left: 6,
        top: 6,
        width: CANVAS_WIDTH - 12,
        height: CANVAS_HEIGHT - 12,
        fill: 'transparent',
        stroke: data.frameColor,
        strokeWidth: 1,
        rx: Math.max(0, data.borderRadius - 4),
        ry: Math.max(0, data.borderRadius - 4),
        selectable: false,
        evented: false,
        name: 'innerFrame',
      });
      canvas.add(inner);
      canvas.sendObjectToBack(inner);
    }

    canvas.renderAll();
  }, [data.backgroundColor, data.frameStyle, data.frameColor, data.borderRadius, getFrameStyles]);

  // Create or update text elements
  const updateTextElement = useCallback((
    id: string,
    text: string,
    style: TextElementStyle,
    extraProps: Partial<FabricText> = {}
  ) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let textObj = objectsRef.current.get(id) as FabricText | undefined;

    if (!textObj) {
      textObj = new FabricText(text, {
        left: style.x,
        top: style.y,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fill: style.color,
        originX: 'center',
        originY: 'center',
        scaleX: style.scaleX,
        scaleY: style.scaleY,
        name: id,
        ...extraProps,
      });

      textObj.on('modified', () => {
        const styleKey = `${id}Style` as keyof BusinessCardData;
        onUpdate({
          [styleKey]: {
            ...style,
            x: textObj!.left || style.x,
            y: textObj!.top || style.y,
            scaleX: textObj!.scaleX || 1,
            scaleY: textObj!.scaleY || 1,
          },
        });
      });

      canvas.add(textObj);
      objectsRef.current.set(id, textObj);
    } else {
      textObj.set({
        text,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fill: style.color,
        left: style.x,
        top: style.y,
        scaleX: style.scaleX,
        scaleY: style.scaleY,
        ...extraProps,
      });
    }

    canvas.renderAll();
  }, [onUpdate]);

  // Update all text elements
  useEffect(() => {
    updateTextElement('name', data.name, data.nameStyle, { 
      fontWeight: '500',
      charSpacing: 200,
      fontSize: data.nameStyle.fontSize,
    });
    updateTextElement('title', data.title, data.titleStyle, { 
      fontWeight: '600',
    });
    updateTextElement('subtitle', data.subtitle, data.subtitleStyle, { 
      fontStyle: 'italic',
      opacity: 0.85,
    });
    updateTextElement('line1', data.line1, data.line1Style, { 
      opacity: 0.9,
    });
    updateTextElement('line2', data.line2, data.line2Style, { 
      opacity: 0.75,
    });
    updateTextElement('line3', data.line3, data.line3Style);
  }, [
    data.name, data.nameStyle,
    data.title, data.titleStyle,
    data.subtitle, data.subtitleStyle,
    data.line1, data.line1Style,
    data.line2, data.line2Style,
    data.line3, data.line3Style,
    updateTextElement
  ]);

  // Handle logo
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const existingLogo = objectsRef.current.get('logo');
    if (existingLogo) {
      canvas.remove(existingLogo);
      objectsRef.current.delete('logo');
    }

    if (data.logo) {
      FabricImage.fromURL(data.logo, { crossOrigin: 'anonymous' }).then((img) => {
        const maxSize = 64;
        const scale = Math.min(maxSize / (img.width || 1), maxSize / (img.height || 1));
        
        img.set({
          left: data.logoX,
          top: data.logoY,
          scaleX: scale * data.logoScale,
          scaleY: scale * data.logoScale,
          originX: 'center',
          originY: 'center',
          name: 'logo',
        });

        img.on('modified', () => {
          onUpdate({
            logoX: img.left || data.logoX,
            logoY: img.top || data.logoY,
            logoScale: (img.scaleX || scale) / scale,
          });
        });

        canvas.add(img);
        objectsRef.current.set('logo', img);
        canvas.renderAll();
      });
    }
  }, [data.logo, data.logoX, data.logoY, data.logoScale, onUpdate]);

  return (
    <div 
      className="relative overflow-hidden shadow-2xl"
      style={{ borderRadius: `${data.borderRadius}px` }}
    >
      <canvas ref={canvasRef} className="block" />
      <div className="absolute bottom-2 right-2 text-xs text-white/50 bg-black/20 px-2 py-1 rounded pointer-events-none">
        Click & drag to edit
      </div>
    </div>
  );
};
