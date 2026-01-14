import React from 'react';
import { DecorativeBorderOverlay, DecorativeBorderType } from './DecorativeBorderOverlay';

// Import backgrounds
import cloudsLightBg from '@/assets/backgrounds/clouds-light.jpg';
import sunsetCloudsBg from '@/assets/backgrounds/sunset-clouds.jpg';
import heavenlyRaysBg from '@/assets/backgrounds/heavenly-rays.jpg';
import starryNightBg from '@/assets/backgrounds/starry-night.jpg';

interface CardMockupProps {
  variant: 'paper' | 'metal';
  className?: string;
}

export const CardMockup: React.FC<CardMockupProps> = ({ variant, className = '' }) => {
  const isPaper = variant === 'paper';
  
  // Paper card uses clouds background with classic gold border
  // Metal card uses starry night with silver metallic look
  const background = isPaper ? cloudsLightBg : starryNightBg;
  const borderColor = isPaper ? '#d4af37' : '#c0c0c0';
  const textColor = isPaper ? '#1a1a2e' : '#ffffff';
  const borderType: DecorativeBorderType = 'classic-gold';
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: '2.5/3.5',
        borderRadius: '8px',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 4px 12px -4px rgba(0,0,0,0.2)',
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      />
      
      {/* Metal shimmer overlay for metal cards */}
      {!isPaper && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
        />
      )}
      
      {/* Border overlay */}
      <DecorativeBorderOverlay type={borderType} color={borderColor} />
      
      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
        {/* In Loving Memory */}
        <p 
          className="text-xs tracking-widest uppercase mb-3"
          style={{ 
            color: textColor, 
            fontFamily: 'Cormorant Garamond',
            opacity: 0.8,
          }}
        >
          In Loving Memory
        </p>
        
        {/* Photo placeholder - oval */}
        <div 
          className="w-16 h-20 rounded-full mb-3 flex items-center justify-center"
          style={{
            border: `2px solid ${borderColor}`,
            background: isPaper ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke={borderColor} viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        
        {/* Name placeholder */}
        <p 
          className="text-lg font-semibold mb-1"
          style={{ 
            color: textColor, 
            fontFamily: 'Great Vibes',
            fontSize: '20px',
          }}
        >
          Your Loved One
        </p>
        
        {/* Dates */}
        <p 
          className="text-xs mb-4"
          style={{ 
            color: textColor, 
            fontFamily: 'Cormorant Garamond',
            opacity: 0.9,
          }}
        >
          1950 – 2024
        </p>
        
        {/* Prayer excerpt */}
        <p 
          className="text-xs italic leading-relaxed max-w-[80%]"
          style={{ 
            color: textColor, 
            fontFamily: 'Cormorant Garamond',
            opacity: 0.85,
          }}
        >
          "The Lord is my shepherd; I shall not want..."
        </p>
      </div>
    </div>
  );
};