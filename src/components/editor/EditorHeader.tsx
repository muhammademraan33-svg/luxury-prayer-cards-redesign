import { Button } from '@/components/ui/button';
import { 
  Download, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut,
  FlipHorizontal,
} from 'lucide-react';
import { BusinessCardData } from '@/types/businessCard';
import { cn } from '@/lib/utils';
interface EditorHeaderProps {
  cardData: BusinessCardData;
  activeSide: 'front' | 'back';
  onSideChange: (side: 'front' | 'back') => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const EditorHeader = ({
  cardData,
  activeSide,
  onSideChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onDownload,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: EditorHeaderProps) => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left section - Logo */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-foreground">LuxuryPrayerCards.com</span>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onUndo} 
            disabled={!canUndo}
            className="h-8 w-8"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRedo} 
            disabled={!canRedo}
            className="h-8 w-8"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center section - Side toggle */}
      <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
        <button
          onClick={() => onSideChange('front')}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            activeSide === 'front' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Front
        </button>
        <button
          onClick={() => onSideChange('back')}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
            activeSide === 'back' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Back
        </button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onSideChange(activeSide === 'front' ? 'back' : 'front')}
          className="h-7 w-7"
        >
          <FlipHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onZoomOut}
            className="h-7 w-7"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onZoomIn}
            className="h-7 w-7"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={onDownload} size="sm">
          <Download className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </header>
  );
};
