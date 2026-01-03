import { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, Line, IText, FabricObject } from 'fabric';
import { BusinessCardData, TextElementStyle } from '@/types/businessCard';
import { FloatingTextToolbar } from './FloatingTextToolbar';

declare module 'fabric' {
  interface FabricObject {
    name?: string;
  }
}

interface TextStyleState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

interface InteractiveCardCanvasProps {
  data: BusinessCardData;
  onUpdate: (updates: Partial<BusinessCardData>) => void;
  onExport: (canvas: HTMLCanvasElement) => void;
}

export const InteractiveCardCanvas = ({ data, onUpdate, onExport }: InteractiveCardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const objectsRef = useRef<Map<string, IText | FabricImage>>(new Map());
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [textStyles, setTextStyles] = useState<Record<string, TextStyleState>>({});

  const CANVAS_WIDTH = data.orientation === 'landscape' ? 400 : 260;
  const CANVAS_HEIGHT = data.orientation === 'landscape' ? 260 : 400;

  const getStyleKey = (elementName: string): keyof BusinessCardData | null => {
    const styleMap: Record<string, keyof BusinessCardData> = {
      name: 'nameStyle',
      title: 'titleStyle',
      subtitle: 'subtitleStyle',
      line1: 'line1Style',
      line2: 'line2Style',
      line3: 'line3Style',
    };
    return styleMap[elementName] || null;
  };

  const getTextKey = (elementName: string): keyof BusinessCardData | null => {
    const textMap: Record<string, keyof BusinessCardData> = {
      name: 'name',
      title: 'title',
      subtitle: 'subtitle',
      line1: 'line1',
      line2: 'line2',
      line3: 'line3',
    };
    return textMap[elementName] || null;
  };

  const drawFrame = useCallback((canvas: FabricCanvas) => {
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
          { x1: 4, y1: 4, x2: 4 + cornerSize, y2: 4 },
          { x1: 4, y1: 4, x2: 4, y2: 4 + cornerSize },
          { x1: width - 4, y1: 4, x2: width - 4 - cornerSize, y2: 4 },
          { x1: width - 4, y1: 4, x2: width - 4, y2: 4 + cornerSize },
          { x1: 4, y1: height - 4, x2: 4 + cornerSize, y2: height - 4 },
          { x1: 4, y1: height - 4, x2: 4, y2: height - 4 - cornerSize },
          { x1: width - 4, y1: height - 4, x2: width - 4 - cornerSize, y2: height - 4 },
          { x1: width - 4, y1: height - 4, x2: width - 4, y2: height - 4 - cornerSize },
        ];
        cornerConfigs.forEach((cfg, i) => {
          canvas.add(new Line([cfg.x1, cfg.y1, cfg.x2, cfg.y2], {
            stroke: frameColor, strokeWidth: 2,
            selectable: false, evented: false, name: `corner${i}`,
          }));
        });
        break;
    }

    canvas.getObjects().filter(obj => 
      obj.name === 'frame' || obj.name === 'innerFrame' || 
      obj.name?.startsWith('corner') || obj.name === 'shadowFrame'
    ).forEach(obj => canvas.sendObjectToBack(obj));
  }, [data.frameStyle, data.frameColor, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

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

    // Selection events
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj?.name && obj instanceof IText) {
        setSelectedElement(obj.name);
        updateToolbarPosition(obj);
      }
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      if (obj?.name && obj instanceof IText) {
        setSelectedElement(obj.name);
        updateToolbarPosition(obj);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    canvas.on('object:moving', (e) => {
      if (e.target?.name && e.target instanceof IText) {
        updateToolbarPosition(e.target);
      }
    });

    canvas.on('object:scaling', (e) => {
      if (e.target?.name && e.target instanceof IText) {
        updateToolbarPosition(e.target);
      }
    });

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

  const updateToolbarPosition = (obj: FabricObject) => {
    if (!containerRef.current) return;
    const objCenter = obj.getCenterPoint();
    const objBottom = (obj.top || 0) + ((obj.height || 0) * (obj.scaleY || 1)) / 2;
    
    setToolbarPosition({
      x: objCenter.x,
      y: objBottom + 15, // Position below the text
    });
  };

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
    extraProps: Partial<IText> = {}
  ) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let textObj = objectsRef.current.get(id) as IText | undefined;

    const adjustedX = data.orientation === 'portrait' ? style.x * 0.65 : style.x;
    const adjustedY = data.orientation === 'portrait' ? style.y * 1.54 : style.y;

    const styleState = textStyles[id] || { isBold: false, isItalic: false, isUnderline: false };

    if (!textObj) {
      textObj = new IText(text, {
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
        fontWeight: styleState.isBold ? 'bold' : 'normal',
        fontStyle: styleState.isItalic ? 'italic' : 'normal',
        underline: styleState.isUnderline,
        ...extraProps,
      });

      textObj.on('modified', () => {
        const styleKey = getStyleKey(id);
        if (styleKey) {
          onUpdate({
            [styleKey]: {
              ...style,
              x: data.orientation === 'portrait' ? (textObj!.left || adjustedX) / 0.65 : textObj!.left || style.x,
              y: data.orientation === 'portrait' ? (textObj!.top || adjustedY) / 1.54 : textObj!.top || style.y,
              scaleX: textObj!.scaleX || 1,
              scaleY: textObj!.scaleY || 1,
            },
          });
        }
      });

      textObj.on('changed', () => {
        const textKey = getTextKey(id);
        if (textKey && textObj) {
          onUpdate({ [textKey]: textObj.text || '' });
        }
      });

      textObj.on('editing:exited', () => {
        const textKey = getTextKey(id);
        if (textKey && textObj) {
          onUpdate({ [textKey]: textObj.text || '' });
        }
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
        fontWeight: styleState.isBold ? 'bold' : (extraProps.fontWeight || 'normal'),
        fontStyle: styleState.isItalic ? 'italic' : (extraProps.fontStyle || 'normal'),
        underline: styleState.isUnderline,
        ...extraProps,
      });
    }

    canvas.renderAll();
  }, [onUpdate, data.orientation, textStyles]);

  // Update all text elements
  useEffect(() => {
    updateTextElement('name', data.name, data.nameStyle, { charSpacing: 200 });
    updateTextElement('title', data.title, data.titleStyle);
    updateTextElement('subtitle', data.subtitle, data.subtitleStyle, { opacity: 0.85 });
    updateTextElement('line1', data.line1, data.line1Style, { opacity: 0.9 });
    updateTextElement('line2', data.line2, data.line2Style, { opacity: 0.75 });
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

  const handleStyleChange = (updates: Partial<TextElementStyle>) => {
    if (!selectedElement) return;
    const styleKey = getStyleKey(selectedElement);
    if (styleKey) {
      const currentStyle = data[styleKey] as TextElementStyle;
      onUpdate({ [styleKey]: { ...currentStyle, ...updates } });
    }
  };

  const handleBoldChange = (bold: boolean) => {
    if (!selectedElement) return;
    setTextStyles(prev => ({
      ...prev,
      [selectedElement]: { ...prev[selectedElement], isBold: bold }
    }));
    const textObj = objectsRef.current.get(selectedElement) as IText | undefined;
    if (textObj) {
      textObj.set('fontWeight', bold ? 'bold' : 'normal');
      fabricRef.current?.renderAll();
    }
  };

  const handleItalicChange = (italic: boolean) => {
    if (!selectedElement) return;
    setTextStyles(prev => ({
      ...prev,
      [selectedElement]: { ...prev[selectedElement], isItalic: italic }
    }));
    const textObj = objectsRef.current.get(selectedElement) as IText | undefined;
    if (textObj) {
      textObj.set('fontStyle', italic ? 'italic' : 'normal');
      fabricRef.current?.renderAll();
    }
  };

  const handleUnderlineChange = (underline: boolean) => {
    if (!selectedElement) return;
    setTextStyles(prev => ({
      ...prev,
      [selectedElement]: { ...prev[selectedElement], isUnderline: underline }
    }));
    const textObj = objectsRef.current.get(selectedElement) as IText | undefined;
    if (textObj) {
      textObj.set('underline', underline);
      fabricRef.current?.renderAll();
    }
  };

  const currentStyle = selectedElement 
    ? (data[getStyleKey(selectedElement) as keyof BusinessCardData] as TextElementStyle)
    : null;

  const currentTextStyles = selectedElement ? textStyles[selectedElement] : null;

  return (
    <div ref={containerRef} className="relative overflow-visible">
      <FloatingTextToolbar
        style={currentStyle || { fontFamily: 'Playfair Display', fontSize: 14, color: '#000', x: 0, y: 0, scaleX: 1, scaleY: 1 }}
        isBold={currentTextStyles?.isBold || false}
        isItalic={currentTextStyles?.isItalic || false}
        isUnderline={currentTextStyles?.isUnderline || false}
        position={toolbarPosition}
        onStyleChange={handleStyleChange}
        onBoldChange={handleBoldChange}
        onItalicChange={handleItalicChange}
        onUnderlineChange={handleUnderlineChange}
        visible={!!selectedElement && !!currentStyle}
      />
      <div className="overflow-hidden shadow-2xl rounded-sm">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="mt-3 text-center text-xs text-muted-foreground">
        Double-click text to edit • Drag to move • Corner handles to resize
      </div>
    </div>
  );
};