import { forwardRef } from 'react';
import { BusinessCardData } from '@/types/businessCard';

interface BusinessCardPreviewProps {
  data: BusinessCardData;
}

export const BusinessCardPreview = forwardRef<HTMLDivElement, BusinessCardPreviewProps>(
  ({ data }, ref) => {
    const getFrameStyles = () => {
      switch (data.frameStyle) {
        case 'solid':
          return {
            border: `2px solid ${data.frameColor}`,
          };
        case 'double':
          return {
            border: `4px double ${data.frameColor}`,
          };
        case 'gradient':
          return {
            border: '3px solid transparent',
            backgroundImage: `linear-gradient(${data.backgroundColor}, ${data.backgroundColor}), linear-gradient(135deg, ${data.frameColor}, ${data.accentColor})`,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          };
        case 'ornate':
          return {
            border: `2px solid ${data.frameColor}`,
            boxShadow: `inset 0 0 0 4px ${data.backgroundColor}, inset 0 0 0 5px ${data.frameColor}`,
          };
        default:
          return {};
      }
    };

    const isOrnate = data.frameStyle === 'ornate';

    return (
      <div
        ref={ref}
        className={`metal-card w-[400px] h-[260px] p-8 relative overflow-hidden flex flex-col justify-center items-center text-center ${isOrnate ? 'ornate-frame' : ''}`}
        style={{
          backgroundColor: data.backgroundColor,
          fontFamily: data.fontFamily,
          ...getFrameStyles(),
        }}
      >
        {/* Logo/Image */}
        {data.logo && (
          <img
            src={data.logo}
            alt="Card image"
            className="w-16 h-16 object-contain rounded-lg mb-3"
          />
        )}

        {/* Main Content */}
        <div className="space-y-2">
          <p
            className="text-sm uppercase tracking-[0.2em] font-medium"
            style={{ color: data.accentColor }}
          >
            {data.name}
          </p>
          
          <h2
            className="text-2xl font-semibold leading-tight"
            style={{ color: data.textColor }}
          >
            {data.title}
          </h2>
          
          {data.subtitle && (
            <p
              className="text-base italic"
              style={{ color: data.textColor, opacity: 0.85 }}
            >
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 space-y-1">
          {data.line1 && (
            <p
              className="text-sm"
              style={{ color: data.textColor, opacity: 0.9 }}
            >
              {data.line1}
            </p>
          )}
          {data.line2 && (
            <p
              className="text-sm"
              style={{ color: data.textColor, opacity: 0.75 }}
            >
              {data.line2}
            </p>
          )}
          {data.line3 && (
            <p
              className="text-xs mt-2"
              style={{ color: data.accentColor }}
            >
              {data.line3}
            </p>
          )}
        </div>

        {/* Subtle decorative element */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${data.accentColor} 0%, transparent 50%)`,
          }}
        />
      </div>
    );
  }
);

BusinessCardPreview.displayName = 'BusinessCardPreview';
