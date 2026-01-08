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
            {/* Classic corner flourishes */}
            {/* Top Left */}
            <path d="M4 20 L4 8 Q4 4 8 4 L20 4" fill="none" stroke={strokeColor} strokeWidth="1" />
            <path d="M4 15 Q8 10 15 10" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M10 4 Q10 8 6 12" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Top Right */}
            <path d="M96 20 L96 8 Q96 4 92 4 L80 4" fill="none" stroke={strokeColor} strokeWidth="1" />
            <path d="M96 15 Q92 10 85 10" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M90 4 Q90 8 94 12" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Bottom Left */}
            <path d="M4 130 L4 142 Q4 146 8 146 L20 146" fill="none" stroke={strokeColor} strokeWidth="1" />
            <path d="M4 135 Q8 140 15 140" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M10 146 Q10 142 6 138" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            
            {/* Bottom Right */}
            <path d="M96 130 L96 142 Q96 146 92 146 L80 146" fill="none" stroke={strokeColor} strokeWidth="1" />
            <path d="M96 135 Q92 140 85 140" fill="none" stroke={strokeColor} strokeWidth="0.6" />
            <path d="M90 146 Q90 142 94 138" fill="none" stroke={strokeColor} strokeWidth="0.6" />
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
