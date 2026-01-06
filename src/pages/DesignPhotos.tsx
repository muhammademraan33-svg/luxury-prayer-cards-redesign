import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, ImageIcon, Trash2, Plus, Minus, MapPin, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

// Photo sizes and pricing
const PHOTO_SIZES = [
  { id: '4x6', name: '4×6', price: 0.37, width: 4, height: 6 },
  { id: '5x7', name: '5×7', price: 0.47, width: 5, height: 7 },
  { id: '8x10', name: '8×10', price: 7, width: 8, height: 10 },
  { id: '11x14', name: '11×14', price: 17, width: 11, height: 14 },
  { id: '16x20', name: '16×20', price: 27, width: 16, height: 20 },
  { id: '18x24', name: '18×24', price: 37, width: 18, height: 24 },
] as const;

type PhotoSize = typeof PHOTO_SIZES[number]['id'];

const DesignPhotos = () => {
  const [searchParams] = useSearchParams();
  
  // Initialize size from URL param
  const initialSize = searchParams.get('size') || '16x20';
  const validSize = PHOTO_SIZES.find(s => s.id === initialSize.replace('×', 'x'))?.id || '16x20';
  
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(validSize);
  const [quantity, setQuantity] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoZoom, setPhotoZoom] = useState<number[]>([]);
  const [photoPanX, setPhotoPanX] = useState<number[]>([]);
  const [photoPanY, setPhotoPanY] = useState<number[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  // Shipping state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentSizeConfig = PHOTO_SIZES.find(s => s.id === selectedSize) || PHOTO_SIZES[2];
  const totalPrice = currentSizeConfig.price * quantity;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos(prev => [...prev, result]);
        setPhotoZoom(prev => [...prev, 1]);
        setPhotoPanX(prev => [...prev, 0]);
        setPhotoPanY(prev => [...prev, 0]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoZoom(prev => prev.filter((_, i) => i !== index));
    setPhotoPanX(prev => prev.filter((_, i) => i !== index));
    setPhotoPanY(prev => prev.filter((_, i) => i !== index));
    if (selectedPhotoIndex >= photos.length - 1) {
      setSelectedPhotoIndex(Math.max(0, photos.length - 2));
    }
  };

  const updateQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  const getAspectRatio = () => {
    return currentSizeConfig.width / currentSizeConfig.height;
  };

  const captureImage = async (): Promise<string | null> => {
    if (!previewRef.current) return null;
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000',
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }
    
    if (!customerName.trim() || !customerEmail.trim() || !shippingStreet.trim() || 
        !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim() || !shippingPhone.trim()) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const designUrl = await captureImage();
      
      // Insert order into database
      const { error } = await supabase.from('orders').insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: shippingPhone,
        shipping_address: shippingStreet,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
        package_name: `Celebration Photo ${currentSizeConfig.name}`,
        total_cards: 0,
        total_photos: quantity,
        total_price: totalPrice,
        front_design_url: designUrl,
        shipping_type: 'express',
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Order submitted successfully!');
      setStep(4);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm tracking-wide">Back</span>
          </Link>
          <h1 className="text-sm font-light tracking-[0.2em] text-foreground uppercase">Celebration of Life</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-1 text-xs tracking-wide">
            {['Select Size', 'Upload', 'Shipping', 'Complete'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 transition-all ${
                  step > i + 1 ? 'text-foreground' :
                  step === i + 1 ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    step > i + 1 ? 'bg-primary text-primary-foreground border-primary' :
                    step === i + 1 ? 'border-primary text-primary' : 'border-muted text-muted-foreground'
                  }`}>
                    {step > i + 1 ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Step 1: Size & Quantity Selection */}
        {step === 1 && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-light text-foreground tracking-wide mb-3">Select Print Size</h2>
              <p className="text-muted-foreground text-sm tracking-wide">Museum-quality prints • Archival paper • Ships within 72 hours</p>
            </div>

            {/* Size Selection */}
            <RadioGroup value={selectedSize} onValueChange={(v) => setSelectedSize(v as PhotoSize)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PHOTO_SIZES.map((size) => (
                <div key={size.id}>
                  <RadioGroupItem value={size.id} id={size.id} className="peer sr-only" />
                  <Label
                    htmlFor={size.id}
                    className="flex flex-col items-center justify-center p-6 bg-card border border-border cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    <span className="text-xl font-light text-foreground tracking-wide mb-2">{size.name}</span>
                    <span className="text-2xl font-light text-foreground">${size.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Quantity Selection */}
            <div className="bg-card border border-border p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground font-light text-lg tracking-wide">Quantity</h3>
                  <p className="text-muted-foreground text-sm mt-1">Number of {currentSizeConfig.name} prints</p>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 border border-border text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-2xl font-light text-foreground min-w-[3ch] text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= 99}
                    className="w-10 h-10 border border-border text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-b border-border py-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm tracking-wide">Order Total</p>
                  <p className="text-foreground font-light mt-1">{quantity} × {currentSizeConfig.name} Print{quantity > 1 ? 's' : ''}</p>
                </div>
                <p className="text-4xl font-light text-foreground">${totalPrice}</p>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-light tracking-wide py-7 text-base transition-colors"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Photo Upload */}
        {step === 2 && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-light text-foreground tracking-wide mb-3">Upload Your Photo</h2>
              <p className="text-muted-foreground text-sm tracking-wide">High resolution recommended for best results</p>
            </div>

            {/* Photo Preview */}
            <div className="flex flex-col items-center gap-8">
              <div
                ref={previewRef}
                className="relative bg-card border border-border overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  aspectRatio: getAspectRatio(),
                }}
              >
                {photos[selectedPhotoIndex] ? (
                  <img
                    src={photos[selectedPhotoIndex]}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: `scale(${photoZoom[selectedPhotoIndex] || 1}) translate(${photoPanX[selectedPhotoIndex] || 0}%, ${photoPanY[selectedPhotoIndex] || 0}%)`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-4 stroke-1" />
                    <p className="text-sm tracking-wide">No photo uploaded</p>
                  </div>
                )}
                
                {/* Size badge */}
                <div className="absolute bottom-4 right-4 bg-background/80 text-foreground px-3 py-1.5 text-xs tracking-wide border border-border">
                  {currentSizeConfig.name}
                </div>
              </div>

              {/* Upload Button */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                multiple
              />
              
              {photos.length === 0 ? (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="border border-border text-foreground hover:bg-secondary px-10 py-4 text-sm tracking-wide transition-colors flex items-center gap-3"
                >
                  <ImageIcon className="h-4 w-4 stroke-1" />
                  Select Photo
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="border border-border text-foreground hover:bg-secondary px-6 py-3 text-sm tracking-wide transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4 stroke-1" />
                    Add More
                  </button>
                  <button
                    onClick={() => removePhoto(selectedPhotoIndex)}
                    className="border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 px-6 py-3 text-sm tracking-wide transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4 stroke-1" />
                    Remove
                  </button>
                </div>
              )}

              {/* Photo Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`w-16 h-16 overflow-hidden border transition-all ${
                        selectedPhotoIndex === index ? 'border-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-border text-foreground hover:bg-secondary py-4 text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <Button
                onClick={() => {
                  if (photos.length === 0) {
                    toast.error('Please upload at least one photo');
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-light tracking-wide py-4 text-sm transition-colors"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Shipping */}
        {step === 3 && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-light text-foreground tracking-wide mb-3">Shipping Details</h2>
              <p className="text-muted-foreground text-sm tracking-wide">Where should we send your prints?</p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs tracking-wide uppercase">Full Name</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Smith"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs tracking-wide uppercase">Email</Label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs tracking-wide uppercase">Street Address</Label>
                <Input
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label className="text-muted-foreground text-xs tracking-wide uppercase">City</Label>
                  <Input
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="New York"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs tracking-wide uppercase">State</Label>
                  <Input
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="NY"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs tracking-wide uppercase">ZIP</Label>
                  <Input
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="10001"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs tracking-wide uppercase">Phone</Label>
                <Input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
                  required
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-b border-border py-8 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm tracking-wide">Order Total</p>
                  <p className="text-foreground font-light mt-1">{quantity} × {currentSizeConfig.name} Print{quantity > 1 ? 's' : ''}</p>
                </div>
                <p className="text-4xl font-light text-foreground">${totalPrice}</p>
              </div>
            </div>

            <div className="flex gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-border text-foreground hover:bg-secondary py-4 text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-light tracking-wide py-4 text-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Place Order <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="text-center space-y-10 py-16">
            <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mx-auto">
              <Check className="h-6 w-6 text-primary stroke-1" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-foreground tracking-wide mb-4">Order Confirmed</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                Thank you for your order. A confirmation email will be sent to <span className="text-foreground">{customerEmail}</span> with tracking information.
              </p>
            </div>
            <div className="border border-border p-8 max-w-sm mx-auto">
              <p className="text-muted-foreground text-xs tracking-wide uppercase mb-3">Order Summary</p>
              <p className="text-foreground font-light text-lg">{quantity} × {currentSizeConfig.name}</p>
              <p className="text-3xl font-light text-foreground mt-4">${totalPrice}</p>
            </div>
            <Link to="/">
              <button className="border border-border text-foreground hover:bg-secondary px-8 py-4 text-sm tracking-wide transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Return Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignPhotos;
