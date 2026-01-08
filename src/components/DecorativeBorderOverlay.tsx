import React from 'react';

export type DecorativeBorderType = 
  | 'none' 
  | 'elegant-scroll' 
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
  { id: 'elegant-scroll', name: 'Elegant Scroll' },
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
      case 'elegant-scroll':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Elegant scrollwork corners - compact design stays in corners */}
            {/* Top Left */}
            <path d="M3 15 Q3 3 15 3" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M5 12 Q5 5 12 5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M3 10 C2 7 5 5 8 6 C6 4 9 2 12 3" fill="none" stroke={strokeColor} strokeWidth="0.7" />
            <circle cx="7" cy="7" r="1.2" fill={fillColor} />
            
            {/* Top Right */}
            <path d="M97 15 Q97 3 85 3" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M95 12 Q95 5 88 5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M97 10 C98 7 95 5 92 6 C94 4 91 2 88 3" fill="none" stroke={strokeColor} strokeWidth="0.7" />
            <circle cx="93" cy="7" r="1.2" fill={fillColor} />
            
            {/* Bottom Left - adjusted to be more visible */}
            <path d="M3 135 Q3 145 15 145" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M5 137 Q5 143 12 143" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M3 138 C2 141 5 143 8 142 C6 144 9 146 12 145" fill="none" stroke={strokeColor} strokeWidth="0.7" />
            <circle cx="7" cy="141" r="1.2" fill={fillColor} />
            
            {/* Bottom Right - adjusted to be more visible */}
            <path d="M97 135 Q97 145 85 145" fill="none" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M95 137 Q95 143 88 143" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M97 138 C98 141 95 143 92 142 C94 144 91 146 88 145" fill="none" stroke={strokeColor} strokeWidth="0.7" />
            <circle cx="93" cy="141" r="1.2" fill={fillColor} />
          </svg>
        );

      case 'simple-line':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Elegant double-line border - pulled in from edges */}
            <rect x="4" y="5" width="92" height="140" fill="none" stroke={strokeColor} strokeWidth="1.2" rx="1" />
            <rect x="7" y="8" width="86" height="134" fill="none" stroke={strokeColor} strokeWidth="0.5" rx="1" />
          </svg>
        );

      case 'ornate-frame':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            <MetallicGradients />
            {/* Outer frame - stays close to edges but with margin */}
            <rect x="3" y="3" width="94" height="144" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <rect x="5" y="5" width="90" height="140" fill="none" stroke={strokeColor} strokeWidth="0.8" />
            
            {/* Corner ornaments - compact and in corners only */}
            {/* Top Left */}
            <path d="M3 11 Q6 8 9 11 Q6 14 3 11" fill={fillColor} />
            <path d="M11 3 Q8 6 11 9 Q14 6 11 3" fill={fillColor} />
            <circle cx="7" cy="7" r="2" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Top Right */}
            <path d="M97 11 Q94 8 91 11 Q94 14 97 11" fill={fillColor} />
            <path d="M89 3 Q92 6 89 9 Q86 6 89 3" fill={fillColor} />
            <circle cx="93" cy="7" r="2" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Bottom Left - adjusted upward */}
            <path d="M3 139 Q6 142 9 139 Q6 136 3 139" fill={fillColor} />
            <path d="M11 145 Q8 142 11 139 Q14 142 11 145" fill={fillColor} />
            <circle cx="7" cy="142" r="2" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Bottom Right - adjusted upward */}
            <path d="M97 139 Q94 142 91 139 Q94 136 97 139" fill={fillColor} />
            <path d="M89 145 Q92 142 89 139 Q86 142 89 145" fill={fillColor} />
            <circle cx="93" cy="142" r="2" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Center top ornament - smaller */}
            <path d="M47 3 Q50 6 53 3 Q50 9 47 3" fill={fillColor} />
            
            {/* Center bottom ornament - adjusted upward */}
            <path d="M47 145 Q50 142 53 145 Q50 139 47 145" fill={fillColor} />
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
