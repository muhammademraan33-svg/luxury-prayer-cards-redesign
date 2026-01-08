import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Info } from "lucide-react";

interface PrintPreviewSampleProps {
  open: boolean;
  onClose: () => void;
  frontPreview?: string;
  backPreview?: string;
  hasRoundedCorners?: boolean;
  cardWidth?: string;
  cardHeight?: string;
}

export function PrintPreviewSample({
  open,
  onClose,
  frontPreview,
  backPreview,
  hasRoundedCorners = false,
  cardWidth = "2.5in",
  cardHeight = "4.25in",
}: PrintPreviewSampleProps) {
  // Signs365 contour cut specifications:
  // - 1/8" bleed on all sides
  // - CutContour spot color for cut line
  // - 0.01pt stroke for cut line
  // - Rounded corners: typically 0.125" radius
  
  const bleed = "0.125in"; // 1/8" bleed
  const cornerRadius = hasRoundedCorners ? "0.125in" : "0";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            Print-Ready Preview (Signs365 Compliant)
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Specifications Info */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-white mb-2">Contour Cut Specifications:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Card Size: {cardWidth} × {cardHeight}</li>
                  <li>Bleed: 1/8" (0.125") on all sides</li>
                  <li>Final Output: {parseFloat(cardWidth) + 0.25}in × {parseFloat(cardHeight) + 0.25}in</li>
                  <li>Cut Line: Magenta "CutContour" spot color, 0.01pt stroke</li>
                  {hasRoundedCorners && <li>Corner Radius: 0.125" (1/8")</li>}
                  <li>File Format: PDF with vector cut line</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Front Card Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 text-center">Front Card</h3>
              <div 
                className="relative bg-slate-700 p-8 rounded-lg"
                style={{ minHeight: "300px" }}
              >
                {/* Bleed area indicator */}
                <div className="absolute inset-4 border-2 border-dashed border-red-400/50 pointer-events-none" style={{ borderRadius: hasRoundedCorners ? '12px' : '0' }}>
                  <span className="absolute -top-5 left-0 text-[10px] text-red-400">Bleed Area</span>
                </div>
                
                {/* Cut line (CutContour) */}
                <div 
                  className="absolute border-2 border-magenta-500"
                  style={{ 
                    inset: '24px',
                    borderColor: '#FF00FF',
                    borderRadius: hasRoundedCorners ? '8px' : '0',
                  }}
                >
                  <span className="absolute -top-5 right-0 text-[10px] text-fuchsia-400">Cut Line (CutContour)</span>
                </div>

                {/* Safe zone */}
                <div 
                  className="absolute border border-green-400/50"
                  style={{ 
                    inset: '32px',
                    borderRadius: hasRoundedCorners ? '6px' : '0',
                  }}
                >
                  <span className="absolute -bottom-5 left-0 text-[10px] text-green-400">Safe Zone</span>
                </div>

                {/* Card preview */}
                <div 
                  className="relative w-full h-48 bg-slate-600 flex items-center justify-center overflow-hidden"
                  style={{ 
                    margin: '16px',
                    borderRadius: hasRoundedCorners ? '8px' : '0',
                  }}
                >
                  {frontPreview ? (
                    <img src={frontPreview} alt="Front" className="w-full h-full object-cover" style={{ borderRadius: hasRoundedCorners ? '8px' : '0' }} />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">Front Card Preview</p>
                      <p className="text-xs mt-1">Photo + Name + Dates</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back Card Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 text-center">Back Card</h3>
              <div 
                className="relative bg-slate-700 p-8 rounded-lg"
                style={{ minHeight: "300px" }}
              >
                {/* Bleed area indicator */}
                <div className="absolute inset-4 border-2 border-dashed border-red-400/50 pointer-events-none" style={{ borderRadius: hasRoundedCorners ? '12px' : '0' }}>
                  <span className="absolute -top-5 left-0 text-[10px] text-red-400">Bleed Area</span>
                </div>
                
                {/* Cut line (CutContour) */}
                <div 
                  className="absolute border-2"
                  style={{ 
                    inset: '24px',
                    borderColor: '#FF00FF',
                    borderRadius: hasRoundedCorners ? '8px' : '0',
                  }}
                >
                  <span className="absolute -top-5 right-0 text-[10px] text-fuchsia-400">Cut Line (CutContour)</span>
                </div>

                {/* Safe zone */}
                <div 
                  className="absolute border border-green-400/50"
                  style={{ 
                    inset: '32px',
                    borderRadius: hasRoundedCorners ? '6px' : '0',
                  }}
                >
                  <span className="absolute -bottom-5 left-0 text-[10px] text-green-400">Safe Zone</span>
                </div>

                {/* Card preview */}
                <div 
                  className="relative w-full h-48 bg-white flex items-center justify-center overflow-hidden"
                  style={{ 
                    margin: '16px',
                    borderRadius: hasRoundedCorners ? '8px' : '0',
                  }}
                >
                  {backPreview ? (
                    <img src={backPreview} alt="Back" className="w-full h-full object-cover" style={{ borderRadius: hasRoundedCorners ? '8px' : '0' }} />
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="text-4xl mb-2">📜</div>
                      <p className="text-sm">Back Card Preview</p>
                      <p className="text-xs mt-1">Prayer Text + QR Code</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2 border-dashed border-red-400"></div>
              <span className="text-slate-400">Bleed (extends 1/8" past cut)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border-2" style={{ borderColor: '#FF00FF' }}></div>
              <span className="text-slate-400">Cut Line (CutContour)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 border border-green-400"></div>
              <span className="text-slate-400">Safe Zone (keep text inside)</span>
            </div>
          </div>

          {/* What You'll Receive */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-semibold mb-2">What You'll Receive After Order:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Print-ready PDF files for front and back</li>
              <li>• Vector cut line layer (CutContour) ready for Signs365</li>
              <li>• Proper bleed extended to edges</li>
              <li>• CMYK color mode for accurate printing</li>
              {hasRoundedCorners && <li>• Rounded corner contour cut path</li>}
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-300">
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
