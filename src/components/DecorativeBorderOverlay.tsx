import React from 'react';

export type DecorativeBorderType = 
  | 'none' 
  | 'classic-corners' 
  | 'floral-vine' 
  | 'ornate-frame' 
  | 'art-deco' 
  | 'celtic-knot'
  | 'victorian'
  | 'baroque';

interface DecorativeBorderOverlayProps {
  type: DecorativeBorderType;
  color: string;
  opacity?: number;
}

export const DECORATIVE_BORDERS: { id: DecorativeBorderType; name: string }[] = [
  { id: 'none', name: 'No Border' },
  { id: 'classic-corners', name: 'Classic Corners' },
  { id: 'floral-vine', name: 'Floral Vine' },
  { id: 'ornate-frame', name: 'Ornate Frame' },
  { id: 'art-deco', name: 'Art Deco' },
  { id: 'celtic-knot', name: 'Celtic Knot' },
  { id: 'victorian', name: 'Victorian' },
  { id: 'baroque', name: 'Baroque' },
];

export const DecorativeBorderOverlay: React.FC<DecorativeBorderOverlayProps> = ({ 
  type, 
  color,
  opacity = 1 
}) => {
  if (type === 'none') return null;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity,
  };

  const svgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const renderBorder = () => {
    switch (type) {
      case 'classic-corners':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Top Left Corner */}
            <path d="M0 20 L0 0 L20 0" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M0 15 L0 5 L5 5 L5 0 L15 0" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="5" cy="5" r="2" fill={color} />
            
            {/* Top Right Corner */}
            <path d="M100 20 L100 0 L80 0" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M100 15 L100 5 L95 5 L95 0 L85 0" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="95" cy="5" r="2" fill={color} />
            
            {/* Bottom Left Corner */}
            <path d="M0 130 L0 150 L20 150" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M0 135 L0 145 L5 145 L5 150 L15 150" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="5" cy="145" r="2" fill={color} />
            
            {/* Bottom Right Corner */}
            <path d="M100 130 L100 150 L80 150" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M100 135 L100 145 L95 145 L95 150 L85 150" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="95" cy="145" r="2" fill={color} />
          </svg>
        );

      case 'floral-vine':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Top border with vine */}
            <path 
              d="M10 5 Q25 8 35 3 Q50 0 65 3 Q75 8 90 5" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8"
            />
            <path d="M15 3 Q17 6 15 8 Q13 6 15 3" fill={color} opacity="0.8" />
            <path d="M30 2 Q32 5 30 7 Q28 5 30 2" fill={color} opacity="0.8" />
            <path d="M50 1 Q53 4 50 6 Q47 4 50 1" fill={color} opacity="0.8" />
            <path d="M70 2 Q72 5 70 7 Q68 5 70 2" fill={color} opacity="0.8" />
            <path d="M85 3 Q87 6 85 8 Q83 6 85 3" fill={color} opacity="0.8" />
            
            {/* Bottom border with vine */}
            <path 
              d="M10 145 Q25 142 35 147 Q50 150 65 147 Q75 142 90 145" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8"
            />
            <path d="M15 147 Q17 144 15 142 Q13 144 15 147" fill={color} opacity="0.8" />
            <path d="M30 148 Q32 145 30 143 Q28 145 30 148" fill={color} opacity="0.8" />
            <path d="M50 149 Q53 146 50 144 Q47 146 50 149" fill={color} opacity="0.8" />
            <path d="M70 148 Q72 145 70 143 Q68 145 70 148" fill={color} opacity="0.8" />
            <path d="M85 147 Q87 144 85 142 Q83 144 85 147" fill={color} opacity="0.8" />
            
            {/* Left border */}
            <path 
              d="M5 20 Q8 40 3 60 Q0 75 3 90 Q8 110 5 130" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8"
            />
            
            {/* Right border */}
            <path 
              d="M95 20 Q92 40 97 60 Q100 75 97 90 Q92 110 95 130" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8"
            />
            
            {/* Corner flourishes */}
            <path d="M8 8 Q15 12 10 18 Q6 12 8 8" fill={color} opacity="0.6" />
            <path d="M92 8 Q85 12 90 18 Q94 12 92 8" fill={color} opacity="0.6" />
            <path d="M8 142 Q15 138 10 132 Q6 138 8 142" fill={color} opacity="0.6" />
            <path d="M92 142 Q85 138 90 132 Q94 138 92 142" fill={color} opacity="0.6" />
          </svg>
        );

      case 'ornate-frame':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Outer frame */}
            <rect x="3" y="4" width="94" height="142" fill="none" stroke={color} strokeWidth="0.6" />
            <rect x="6" y="7" width="88" height="136" fill="none" stroke={color} strokeWidth="1" />
            
            {/* Corner ornaments */}
            {/* Top Left */}
            <path d="M3 15 Q8 10 13 15 Q8 20 3 15" fill={color} />
            <path d="M15 4 Q10 9 15 14 Q20 9 15 4" fill={color} />
            <circle cx="10" cy="10" r="3" fill="none" stroke={color} strokeWidth="0.8" />
            
            {/* Top Right */}
            <path d="M97 15 Q92 10 87 15 Q92 20 97 15" fill={color} />
            <path d="M85 4 Q90 9 85 14 Q80 9 85 4" fill={color} />
            <circle cx="90" cy="10" r="3" fill="none" stroke={color} strokeWidth="0.8" />
            
            {/* Bottom Left */}
            <path d="M3 135 Q8 140 13 135 Q8 130 3 135" fill={color} />
            <path d="M15 146 Q10 141 15 136 Q20 141 15 146" fill={color} />
            <circle cx="10" cy="140" r="3" fill="none" stroke={color} strokeWidth="0.8" />
            
            {/* Bottom Right */}
            <path d="M97 135 Q92 140 87 135 Q92 130 97 135" fill={color} />
            <path d="M85 146 Q90 141 85 136 Q80 141 85 146" fill={color} />
            <circle cx="90" cy="140" r="3" fill="none" stroke={color} strokeWidth="0.8" />
            
            {/* Center top ornament */}
            <path d="M45 4 Q50 8 55 4 Q50 12 45 4" fill={color} />
            <path d="M48 2 L50 6 L52 2" fill="none" stroke={color} strokeWidth="0.5" />
            
            {/* Center bottom ornament */}
            <path d="M45 146 Q50 142 55 146 Q50 138 45 146" fill={color} />
            <path d="M48 148 L50 144 L52 148" fill="none" stroke={color} strokeWidth="0.5" />
          </svg>
        );

      case 'art-deco':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Art Deco geometric corners */}
            {/* Top Left */}
            <path d="M0 0 L25 0 L25 3 L3 3 L3 25 L0 25 Z" fill={color} opacity="0.3" />
            <path d="M0 0 L15 0 L0 15 Z" fill={color} opacity="0.5" />
            <path d="M5 0 L0 5" stroke={color} strokeWidth="0.5" />
            <path d="M10 0 L0 10" stroke={color} strokeWidth="0.5" />
            <circle cx="8" cy="8" r="2" fill="none" stroke={color} strokeWidth="1" />
            
            {/* Top Right */}
            <path d="M100 0 L75 0 L75 3 L97 3 L97 25 L100 25 Z" fill={color} opacity="0.3" />
            <path d="M100 0 L85 0 L100 15 Z" fill={color} opacity="0.5" />
            <path d="M95 0 L100 5" stroke={color} strokeWidth="0.5" />
            <path d="M90 0 L100 10" stroke={color} strokeWidth="0.5" />
            <circle cx="92" cy="8" r="2" fill="none" stroke={color} strokeWidth="1" />
            
            {/* Bottom Left */}
            <path d="M0 150 L25 150 L25 147 L3 147 L3 125 L0 125 Z" fill={color} opacity="0.3" />
            <path d="M0 150 L15 150 L0 135 Z" fill={color} opacity="0.5" />
            <path d="M5 150 L0 145" stroke={color} strokeWidth="0.5" />
            <path d="M10 150 L0 140" stroke={color} strokeWidth="0.5" />
            <circle cx="8" cy="142" r="2" fill="none" stroke={color} strokeWidth="1" />
            
            {/* Bottom Right */}
            <path d="M100 150 L75 150 L75 147 L97 147 L97 125 L100 125 Z" fill={color} opacity="0.3" />
            <path d="M100 150 L85 150 L100 135 Z" fill={color} opacity="0.5" />
            <path d="M95 150 L100 145" stroke={color} strokeWidth="0.5" />
            <path d="M90 150 L100 140" stroke={color} strokeWidth="0.5" />
            <circle cx="92" cy="142" r="2" fill="none" stroke={color} strokeWidth="1" />
            
            {/* Center sunburst top */}
            <path d="M50 0 L47 8 L50 6 L53 8 Z" fill={color} />
            <path d="M45 0 L46 5" stroke={color} strokeWidth="0.5" />
            <path d="M55 0 L54 5" stroke={color} strokeWidth="0.5" />
            
            {/* Center sunburst bottom */}
            <path d="M50 150 L47 142 L50 144 L53 142 Z" fill={color} />
            <path d="M45 150 L46 145" stroke={color} strokeWidth="0.5" />
            <path d="M55 150 L54 145" stroke={color} strokeWidth="0.5" />
          </svg>
        );

      case 'celtic-knot':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Celtic knot corners */}
            {/* Top Left */}
            <path 
              d="M5 5 Q10 0 15 5 Q20 10 15 15 Q10 20 5 15 Q0 10 5 5" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path 
              d="M10 2 L10 8 M2 10 L8 10" 
              stroke={color} 
              strokeWidth="0.6"
            />
            
            {/* Top Right */}
            <path 
              d="M95 5 Q90 0 85 5 Q80 10 85 15 Q90 20 95 15 Q100 10 95 5" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path 
              d="M90 2 L90 8 M98 10 L92 10" 
              stroke={color} 
              strokeWidth="0.6"
            />
            
            {/* Bottom Left */}
            <path 
              d="M5 145 Q10 150 15 145 Q20 140 15 135 Q10 130 5 135 Q0 140 5 145" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path 
              d="M10 148 L10 142 M2 140 L8 140" 
              stroke={color} 
              strokeWidth="0.6"
            />
            
            {/* Bottom Right */}
            <path 
              d="M95 145 Q90 150 85 145 Q80 140 85 135 Q90 130 95 135 Q100 140 95 145" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path 
              d="M90 148 L90 142 M98 140 L92 140" 
              stroke={color} 
              strokeWidth="0.6"
            />
            
            {/* Connecting lines */}
            <path d="M20 5 L80 5" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" />
            <path d="M20 145 L80 145" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" />
            <path d="M5 20 L5 130" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" />
            <path d="M95 20 L95 130" stroke={color} strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>
        );

      case 'victorian':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Victorian ornate border */}
            <rect x="4" y="6" width="92" height="138" fill="none" stroke={color} strokeWidth="0.8" rx="2" />
            
            {/* Top center medallion */}
            <ellipse cx="50" cy="6" rx="12" ry="4" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M42 6 Q50 2 58 6" fill="none" stroke={color} strokeWidth="0.5" />
            <path d="M46 6 L50 3 L54 6" fill={color} opacity="0.5" />
            
            {/* Bottom center medallion */}
            <ellipse cx="50" cy="144" rx="12" ry="4" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M42 144 Q50 148 58 144" fill="none" stroke={color} strokeWidth="0.5" />
            <path d="M46 144 L50 147 L54 144" fill={color} opacity="0.5" />
            
            {/* Corner scrollwork */}
            {/* Top Left */}
            <path d="M4 20 Q0 15 4 10 Q8 5 15 6" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M8 6 Q4 10 8 14" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="10" cy="10" r="1.5" fill={color} />
            
            {/* Top Right */}
            <path d="M96 20 Q100 15 96 10 Q92 5 85 6" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M92 6 Q96 10 92 14" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="90" cy="10" r="1.5" fill={color} />
            
            {/* Bottom Left */}
            <path d="M4 130 Q0 135 4 140 Q8 145 15 144" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M8 144 Q4 140 8 136" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="10" cy="140" r="1.5" fill={color} />
            
            {/* Bottom Right */}
            <path d="M96 130 Q100 135 96 140 Q92 145 85 144" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M92 144 Q96 140 92 136" fill="none" stroke={color} strokeWidth="0.5" />
            <circle cx="90" cy="140" r="1.5" fill={color} />
            
            {/* Side decorations */}
            <path d="M4 50 Q0 55 4 60 Q8 55 4 50" fill={color} opacity="0.4" />
            <path d="M4 90 Q0 95 4 100 Q8 95 4 90" fill={color} opacity="0.4" />
            <path d="M96 50 Q100 55 96 60 Q92 55 96 50" fill={color} opacity="0.4" />
            <path d="M96 90 Q100 95 96 100 Q92 95 96 90" fill={color} opacity="0.4" />
          </svg>
        );

      case 'baroque':
        return (
          <svg style={svgStyle} viewBox="0 0 100 150" preserveAspectRatio="none">
            {/* Baroque elaborate scrollwork */}
            {/* Top border */}
            <path 
              d="M10 8 Q20 2 30 8 Q40 14 50 8 Q60 2 70 8 Q80 14 90 8" 
              fill="none" 
              stroke={color} 
              strokeWidth="1"
            />
            <path 
              d="M15 4 Q20 8 25 4" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            <path 
              d="M45 4 Q50 8 55 4" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            <path 
              d="M75 4 Q80 8 85 4" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            
            {/* Bottom border */}
            <path 
              d="M10 142 Q20 148 30 142 Q40 136 50 142 Q60 148 70 142 Q80 136 90 142" 
              fill="none" 
              stroke={color} 
              strokeWidth="1"
            />
            <path 
              d="M15 146 Q20 142 25 146" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            <path 
              d="M45 146 Q50 142 55 146" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            <path 
              d="M75 146 Q80 142 85 146" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
            />
            
            {/* Corner flourishes - Top Left */}
            <path 
              d="M5 5 Q15 5 15 15 Q15 25 5 25" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path d="M8 8 Q12 12 8 16 Q4 12 8 8" fill={color} opacity="0.5" />
            <circle cx="12" cy="12" r="2" fill="none" stroke={color} strokeWidth="0.6" />
            
            {/* Corner flourishes - Top Right */}
            <path 
              d="M95 5 Q85 5 85 15 Q85 25 95 25" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path d="M92 8 Q88 12 92 16 Q96 12 92 8" fill={color} opacity="0.5" />
            <circle cx="88" cy="12" r="2" fill="none" stroke={color} strokeWidth="0.6" />
            
            {/* Corner flourishes - Bottom Left */}
            <path 
              d="M5 145 Q15 145 15 135 Q15 125 5 125" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path d="M8 142 Q12 138 8 134 Q4 138 8 142" fill={color} opacity="0.5" />
            <circle cx="12" cy="138" r="2" fill="none" stroke={color} strokeWidth="0.6" />
            
            {/* Corner flourishes - Bottom Right */}
            <path 
              d="M95 145 Q85 145 85 135 Q85 125 95 125" 
              fill="none" 
              stroke={color} 
              strokeWidth="1.2"
            />
            <path d="M92 142 Q88 138 92 134 Q96 138 92 142" fill={color} opacity="0.5" />
            <circle cx="88" cy="138" r="2" fill="none" stroke={color} strokeWidth="0.6" />
            
            {/* Side scrolls */}
            <path d="M3 60 Q7 65 3 70 Q-1 75 3 80" fill="none" stroke={color} strokeWidth="0.8" />
            <path d="M97 60 Q93 65 97 70 Q101 75 97 80" fill="none" stroke={color} strokeWidth="0.8" />
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
