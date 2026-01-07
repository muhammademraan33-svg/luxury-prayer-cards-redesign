import { CardSideData, backgroundTextures, BackgroundTexture } from '@/types/businessCard';

interface CardPreviewProps {
  sideData: CardSideData;
  orientation: 'landscape' | 'portrait';
}

export const CardPreview = ({ sideData, orientation }: CardPreviewProps) => {
  const width = orientation === 'landscape' ? 400 : 260;
  const height = orientation === 'landscape' ? 260 : 400;

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
      const textureName = sideData.background.texture;
      
      // Brushed metal effect - fine horizontal lines
      if (textureName.startsWith('brushed')) {
        return {
          ...base,
          backgroundImage: `
            ${texture.preview},
            repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.01) 3px, rgba(0,0,0,0.01) 4px)
          `,
        };
      }

      // Marble effect - subtle veining pattern
      if (textureName.startsWith('marble')) {
        const isLight = textureName === 'marble-white' || textureName === 'marble-white-grey';
        const veinColor = textureName === 'marble-black' ? 'rgba(60,60,60,0.2)' : 'rgba(180,180,180,0.15)';
        return {
          ...base,
          backgroundImage: `
            ${texture.preview},
            radial-gradient(ellipse 80% 40% at 20% 30%, ${veinColor} 0%, transparent 50%),
            radial-gradient(ellipse 60% 30% at 70% 60%, ${veinColor} 0%, transparent 40%),
            radial-gradient(ellipse 40% 60% at 40% 80%, ${veinColor} 0%, transparent 35%)
          `,
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
    const size = 24;
    
    return (
      <>
        {/* Top Left */}
        <div className="absolute top-3 left-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute top-3 left-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        {/* Top Right */}
        <div className="absolute top-3 right-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute top-3 right-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        {/* Bottom Left */}
        <div className="absolute bottom-3 left-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 left-3 w-0.5 h-6" style={{ backgroundColor: color }} />
        {/* Bottom Right */}
        <div className="absolute bottom-3 right-3 w-6 h-0.5" style={{ backgroundColor: color }} />
        <div className="absolute bottom-3 right-3 w-0.5 h-6" style={{ backgroundColor: color }} />
      </>
    );
  };

  return (
    <div
      className="metal-card relative overflow-hidden rounded-sm"
      style={{
        width,
        height,
        ...getBackgroundStyle(),
        ...getFrameStyle(),
      }}
    >
      {renderCornerFrame()}
      
      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        {sideData.texts.map((textEl) => (
          <div
            key={textEl.id}
            className="text-center"
            style={{
              fontFamily: textEl.style.fontFamily,
              fontSize: textEl.style.fontSize,
              color: textEl.style.color,
              transform: `scale(${textEl.style.scaleX}, ${textEl.style.scaleY})`,
            }}
          >
            {textEl.content}
          </div>
        ))}
      </div>

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

      {/* Realistic metallic shine effect for metal printing */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 25%, transparent 50%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0.08) 100%),
            radial-gradient(ellipse 80% 50% at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
};
