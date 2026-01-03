import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, Line, FabricObject } from 'fabric';
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

  const CANVAS_WIDTH = data.orientation === 'landscape' ? 400 : 260;
  const CANVAS_HEIGHT = data.orientation === 'landscape' ? 260 : 400;

  const drawFrame = useCallback((canvas: FabricCanvas) => {
    // Remove existing frame elements
    const existingFrame = canvas.getObjects().filter(obj => 
      obj.name === 'frame' || obj.name === 'innerFrame' || 
      obj.name?.startsWith('corner') || obj.name === 'shadowFrame'
    );
    existingFrame.forEach(obj => canvas.remove(obj));

    const frameColor = data.frameColor;
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    switch (data.frameStyle) {
      case 'solid':
        canvas.add(new Rect({
          left: 1, top: 1, width: width - 2, height: height - 2,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          selectable: false, evented: false, name: 'frame',
        }));
        break;
      case 'double':
        canvas.add(new Rect({
          left: 2, top: 2, width: width - 4, height: height - 4,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          selectable: false, evented: false, name: 'frame',
        }));
        canvas.add(new Rect({
          left: 8, top: 8, width: width - 16, height: height - 16,
          fill: 'transparent', stroke: frameColor, strokeWidth: 1,
          selectable: false, evented: false, name: 'innerFrame',
        }));
        break;
      case 'gradient':
        canvas.add(new Rect({
          left: 2, top: 2, width: width - 4, height: height - 4,
          fill: 'transparent', stroke: frameColor, strokeWidth: 3,
          selectable: false, evented: false, name: 'frame',
        }));
        break;
      case 'ornate':
        canvas.add(new Rect({
          left: 2, top: 2, width: width - 4, height: height - 4,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          selectable: false, evented: false, name: 'frame',
        }));
        canvas.add(new Rect({
          left: 8, top: 8, width: width - 16, height: height - 16,
          fill: 'transparent', stroke: frameColor, strokeWidth: 1,
          selectable: false, evented: false, name: 'innerFrame',
        }));
        break;
      case 'dashed':
        canvas.add(new Rect({
          left: 4, top: 4, width: width - 8, height: height - 8,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          strokeDashArray: [10, 5],
          selectable: false, evented: false, name: 'frame',
        }));
        break;
      case 'dotted':
        canvas.add(new Rect({
          left: 4, top: 4, width: width - 8, height: height - 8,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          strokeDashArray: [2, 4],
          selectable: false, evented: false, name: 'frame',
        }));
        break;
      case 'inset':
        canvas.add(new Rect({
          left: 12, top: 12, width: width - 24, height: height - 24,
          fill: 'transparent', stroke: frameColor, strokeWidth: 1,
          selectable: false, evented: false, name: 'frame',
        }));
        canvas.add(new Rect({
          left: 16, top: 16, width: width - 32, height: height - 32,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          selectable: false, evented: false, name: 'innerFrame',
        }));
        break;
      case 'shadow':
        canvas.add(new Rect({
          left: 8, top: 8, width: width - 12, height: height - 12,
          fill: 'rgba(0,0,0,0.1)', stroke: 'transparent', strokeWidth: 0,
          selectable: false, evented: false, name: 'shadowFrame',
        }));
        canvas.add(new Rect({
          left: 4, top: 4, width: width - 12, height: height - 12,
          fill: 'transparent', stroke: frameColor, strokeWidth: 2,
          selectable: false, evented: false, name: 'frame',
        }));
        break;
      case 'corner':
        const cornerSize = 20;
        const cornerConfigs = [
          { x1: 4, y1: 4, x2: 4 + cornerSize, y2: 4 }, // top-left h
          { x1: 4, y1: 4, x2: 4, y2: 4 + cornerSize }, // top-left v
          { x1: width - 4, y1: 4, x2: width - 4 - cornerSize, y2: 4 }, // top-right h
          { x1: width - 4, y1: 4, x2: width - 4, y2: 4 + cornerSize }, // top-right v
          { x1: 4, y1: height - 4, x2: 4 + cornerSize, y2: height - 4 }, // bottom-left h
          { x1: 4, y1: height - 4, x2: 4, y2: height - 4 - cornerSize }, // bottom-left v
          { x1: width - 4, y1: height - 4, x2: width - 4 - cornerSize, y2: height - 4 }, // bottom-right h
          { x1: width - 4, y1: height - 4, x2: width - 4, y2: height - 4 - cornerSize }, // bottom-right v
        ];
        cornerConfigs.forEach((cfg, i) => {
          canvas.add(new Line([cfg.x1, cfg.y1, cfg.x2, cfg.y2], {
            stroke: frameColor, strokeWidth: 2,
            selectable: false, evented: false, name: `corner${i}`,
          }));
        });
        break;
    }

    // Send frames to back
    canvas.getObjects().filter(obj => 
      obj.name === 'frame' || obj.name === 'innerFrame' || 
      obj.name?.startsWith('corner') || obj.name === 'shadowFrame'
    ).forEach(obj => canvas.sendObjectToBack(obj));
  }, [data.frameStyle, data.frameColor, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Dispose previous canvas if exists
    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
      objectsRef.current.clear();
    }

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
      objectsRef.current.clear();
      delete (window as any).__exportCardCanvas;
    };
  }, [CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Update background image
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const existingBg = canvas.getObjects().find(obj => obj.name === 'backgroundImage');
    if (existingBg) {
      canvas.remove(existingBg);
    }

    if (data.logo) {
      FabricImage.fromURL(data.logo, { crossOrigin: 'anonymous' }).then((img) => {
        const scaleX = CANVAS_WIDTH / (img.width || 1);
        const scaleY = CANVAS_HEIGHT / (img.height || 1);
        const scale = Math.max(scaleX, scaleY) * data.logoScale;
        
        img.set({
          left: CANVAS_WIDTH / 2 + (data.logoX - 200),
          top: CANVAS_HEIGHT / 2 + (data.logoY - 130),
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'center',
          name: 'backgroundImage',
        });

        img.on('modified', () => {
          onUpdate({
            logoX: 200 + ((img.left || CANVAS_WIDTH / 2) - CANVAS_WIDTH / 2),
            logoY: 130 + ((img.top || CANVAS_HEIGHT / 2) - CANVAS_HEIGHT / 2),
            logoScale: (img.scaleX || scale) / Math.max(scaleX, scaleY),
          });
        });

        canvas.add(img);
        canvas.sendObjectToBack(img);
        drawFrame(canvas);
        canvas.renderAll();
      });
    } else {
      canvas.backgroundColor = data.backgroundColor;
      drawFrame(canvas);
      canvas.renderAll();
    }
  }, [data.logo, data.logoX, data.logoY, data.logoScale, data.backgroundColor, CANVAS_WIDTH, CANVAS_HEIGHT, drawFrame, onUpdate]);

  // Update frame
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    drawFrame(canvas);
    canvas.renderAll();
  }, [data.frameStyle, data.frameColor, drawFrame]);

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

    // Adjust position for orientation
    const adjustedX = data.orientation === 'portrait' ? style.x * 0.65 : style.x;
    const adjustedY = data.orientation === 'portrait' ? style.y * 1.54 : style.y;

    if (!textObj) {
      textObj = new FabricText(text, {
        left: adjustedX,
        top: adjustedY,
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
            x: data.orientation === 'portrait' ? (textObj!.left || adjustedX) / 0.65 : textObj!.left || style.x,
            y: data.orientation === 'portrait' ? (textObj!.top || adjustedY) / 1.54 : textObj!.top || style.y,
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
        left: adjustedX,
        top: adjustedY,
        scaleX: style.scaleX,
        scaleY: style.scaleY,
        ...extraProps,
      });
    }

    canvas.renderAll();
  }, [onUpdate, data.orientation]);

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

  return (
    <div className="relative overflow-hidden shadow-2xl rounded-sm">
      <canvas ref={canvasRef} className="block" />
      <div className="absolute bottom-2 right-2 text-xs text-white/50 bg-black/20 px-2 py-1 rounded pointer-events-none">
        Click & drag to edit
      </div>
    </div>
  );
};