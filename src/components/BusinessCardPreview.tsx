import { forwardRef } from 'react';
import { BusinessCardData } from '@/types/businessCard';
import { Mail, Phone, Globe } from 'lucide-react';

interface BusinessCardPreviewProps {
  data: BusinessCardData;
}

export const BusinessCardPreview = forwardRef<HTMLDivElement, BusinessCardPreviewProps>(
  ({ data }, ref) => {
    const getFrameStyles = () => {
      switch (data.frameStyle) {
        case 'solid':
          return {
            border: `3px solid ${data.frameColor}`,
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
        case 'shadow':
          return {
            boxShadow: `0 0 0 3px ${data.frameColor}, 0 8px 32px -8px rgba(0,0,0,0.3)`,
          };
        default:
          return {};
      }
    };

    return (
      <div
        ref={ref}
        className="business-card w-[400px] h-[240px] p-6 relative overflow-hidden"
        style={{
          backgroundColor: data.backgroundColor,
          borderRadius: `${data.borderRadius}px`,
          fontFamily: data.fontFamily,
          ...getFrameStyles(),
        }}
      >
        <div className="flex h-full">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 w-20 flex items-start justify-center pt-2">
            {data.logo ? (
              <img
                src={data.logo}
                alt="Logo"
                className="w-16 h-16 object-contain rounded-lg"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{
                  backgroundColor: data.accentColor,
                  color: data.backgroundColor,
                }}
              >
                {data.company.charAt(0)}
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col justify-between pl-4">
            <div>
              <h2
                className="text-2xl font-bold leading-tight"
                style={{ color: data.textColor }}
              >
                {data.name}
              </h2>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: data.accentColor }}
              >
                {data.title}
              </p>
              <p
                className="text-sm mt-0.5 opacity-80"
                style={{ color: data.textColor }}
              >
                {data.company}
              </p>
            </div>

            <div className="space-y-1.5">
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail
                    className="w-3.5 h-3.5"
                    style={{ color: data.accentColor }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: data.textColor }}
                  >
                    {data.email}
                  </span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone
                    className="w-3.5 h-3.5"
                    style={{ color: data.accentColor }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: data.textColor }}
                  >
                    {data.phone}
                  </span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center gap-2">
                  <Globe
                    className="w-3.5 h-3.5"
                    style={{ color: data.accentColor }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: data.textColor }}
                  >
                    {data.website}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative accent */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 opacity-10 rounded-tl-full"
          style={{ backgroundColor: data.accentColor }}
        />
      </div>
    );
  }
);

BusinessCardPreview.displayName = 'BusinessCardPreview';
