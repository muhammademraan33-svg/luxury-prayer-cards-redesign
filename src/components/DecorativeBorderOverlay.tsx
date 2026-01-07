import React from 'react';

export type DecorativeBorderType = 
  | 'none' 
  | 'classic-corners' 
  | 'simple-line' 
  | 'ornate-frame';

export type MetallicColorType = 'gold' | 'silver' | 'rose-gold' | 'white';

interface DecorativeBorderOverlayProps {
  type: DecorativeBorderType;
  color: string;
  opacity?: number;
}

export const METALLIC_COLORS: { id: MetallicColorType; name: string; value: string; gradient: string }[] = [
  {
    id: 'gold',
    name: 'Gold',
    value: '#d4af37',
    gradient: 'url(#goldGradient)',
  },
  {
    id: 'silver',
    name: 'Silver',
    value: '#c0c0c0',
    gradient: 'url(#silverGradient)',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    value: '#b76e79',
    gradient: 'url(#rose-goldGradient)',
  },
  {
    id: 'white',
    name: 'White',
    value: '#f8f8f8',
    gradient: 'url(#whiteGradient)',
  },
];

const normalizeHex = (hex: string) => {
  const v = hex.trim().toLowerCase();
  // strip alpha if present (#RRGGBBAA)
  return v.startsWith('#') && v.length === 9 ? v.slice(0, 7) : v;
};

// Get the metallic gradient ID based on color value
const getMetallicGradientId = (color: string): string | null => {
  const normalized = normalizeHex(color);
  const metallic = METALLIC_COLORS.find((m) => normalizeHex(m.value) === normalized);
  return metallic ? metallic.id : null;
};

export const DECORATIVE_BORDERS: { id: DecorativeBorderType; name: string }[] = [
  { id: 'none', name: 'No Border' },
  { id: 'classic-corners', name: 'Classic Corners' },
  { id: 'simple-line', name: 'Simple Line' },
  { id: 'ornate-frame', name: 'Ornate Frame' },
];

export const DecorativeBorderOverlay: React.FC<DecorativeBorderOverlayProps> = ({
  type,
  color,
  opacity = 1,
}) => {
  if (type === 'none') return null;

  // Simple line border should always be fully opaque
  const effectiveOpacity = type === 'simple-line' ? 1 : opacity;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: effectiveOpacity,
  };

  const svgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };
  
  const metallicId = getMetallicGradientId(color);
  const strokeColor = metallicId ? `url(#${metallicId}Gradient)` : color;
  const fillColor = metallicId ? `url(#${metallicId}Gradient)` : color;
  
  // Metallic gradient definitions for SVG
  const MetallicGradients = () => (
    <defs>
      {/* Gold gradient - rich, warm gold with realistic shine */}
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff9e6" />
        <stop offset="15%" stopColor="#ffd700" />
        <stop offset="30%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#b8860b" />
        <stop offset="70%" stopColor="#d4af37" />
        <stop offset="85%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#fff9e6" />
      </linearGradient>
      
      {/* Silver gradient - cool, shiny silver */}
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="15%" stopColor="#e8e8e8" />
        <stop offset="30%" stopColor="#c0c0c0" />
        <stop offset="50%" stopColor="#a8a8a8" />
        <stop offset="70%" stopColor="#c0c0c0" />
        <stop offset="85%" stopColor="#e8e8e8" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
      
      {/* Rose Gold gradient - warm pink/copper tones */}
      <linearGradient id="rose-goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fce4e4" />
        <stop offset="15%" stopColor="#e8b4b8" />
        <stop offset="30%" stopColor="#b76e79" />
        <stop offset="50%" stopColor="#9e5a65" />
        <stop offset="70%" stopColor="#b76e79" />
        <stop offset="85%" stopColor="#e8b4b8" />
        <stop offset="100%" stopColor="#fce4e4" />
      </linearGradient>
      
      {/* White/Pearl gradient - subtle shimmer */}
      <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fafafa" />
        <stop offset="50%" stopColor="#f0f0f0" />
        <stop offset="75%" stopColor="#fafafa" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
    </defs>
  );

  const renderBorder = () => {
    switch (type) {
      case 'classic-corners':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Top Left Corner */}
            <path d="M0 20 L0 0 L20 0" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M0 15 L0 5 L5 5 L5 0 L15 0" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <circle cx="5" cy="5" r="2" fill={fillColor} />
            
            {/* Top Right Corner */}
            <path d="M100 20 L100 0 L80 0" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M100 15 L100 5 L95 5 L95 0 L85 0" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <circle cx="95" cy="5" r="2" fill={fillColor} />
            
            {/* Bottom Left Corner */}
            <path d="M0 130 L0 150 L20 150" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M0 135 L0 145 L5 145 L5 150 L15 150" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <circle cx="5" cy="145" r="2" fill={fillColor} />
            
            {/* Bottom Right Corner */}
            <path d="M100 130 L100 150 L80 150" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M100 135 L100 145 L95 145 L95 150 L85 150" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <circle cx="95" cy="145" r="2" fill={fillColor} />
          </svg>
        );

      case 'simple-line':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Elegant double-line border */}
            <rect x="4" y="5" width="92" height="140" fill="none" stroke={strokeColor} strokeWidth="1.2" rx="1" />
            <rect x="7" y="8" width="86" height="134" fill="none" stroke={strokeColor} strokeWidth="0.5" rx="1" />
          </svg>
        );

      case 'ornate-frame':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Outer frame */}
            <rect x="3" y="4" width="94" height="142" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <rect x="6" y="7" width="88" height="136" fill="none" stroke={strokeColor} strokeWidth="1" />
            
            {/* Corner ornaments */}
            {/* Top Left */}
            <path d="M3 15 Q8 10 13 15 Q8 20 3 15" fill={fillColor} />
            <path d="M15 4 Q10 9 15 14 Q20 9 15 4" fill={fillColor} />
            <circle cx="10" cy="10" r="3" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            
            {/* Top Right */}
            <path d="M97 15 Q92 10 87 15 Q92 20 97 15" fill={fillColor} />
            <path d="M85 4 Q90 9 85 14 Q80 9 85 4" fill={fillColor} />
            <circle cx="90" cy="10" r="3" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            
            {/* Bottom Left */}
            <path d="M3 135 Q8 140 13 135 Q8 130 3 135" fill={fillColor} />
            <path d="M15 146 Q10 141 15 136 Q20 141 15 146" fill={fillColor} />
            <circle cx="10" cy="140" r="3" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            
            {/* Bottom Right */}
            <path d="M97 135 Q92 140 87 135 Q92 130 97 135" fill={fillColor} />
            <path d="M85 146 Q90 141 85 136 Q80 141 85 146" fill={fillColor} />
            <circle cx="90" cy="140" r="3" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            
            {/* Center top ornament */}
            <path d="M45 4 Q50 8 55 4 Q50 12 45 4" fill={fillColor} />
            <path d="M48 2 L50 6 L52 2" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            
            {/* Center bottom ornament */}
            <path d="M45 146 Q50 142 55 146 Q50 138 45 146" fill={fillColor} />
            <path d="M48 148 L50 144 L52 148" fill="none" stroke={strokeColor} strokeWidth="0.5" />
          </svg>
        );


      default:
        return null;
    }
  };

  return (
    <div style={baseStyle}>
      {renderBorder()}
    </div>
  );
};
