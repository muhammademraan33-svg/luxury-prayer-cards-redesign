import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, ImageIcon, Trash2, Plus, Minus, MapPin, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

// Photo sizes and pricing
const PHOTO_SIZES = [
  { id: '4x6', name: '4×6', price: 5, width: 4, height: 6 },
  { id: '5x7', name: '5×7', price: 7, width: 5, height: 7 },
  { id: '8x10', name: '8×10', price: 12, width: 8, height: 10 },
  { id: '11x14', name: '11×14', price: 18, width: 11, height: 14 },
  { id: '16x20', name: '16×20', price: 25, width: 16, height: 20 },
  { id: '18x24', name: '18×24', price: 35, width: 18, height: 24 },
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

      toast.success('Order submitted successfully! We\'ll send a confirmation email shortly.');
      setStep(4); // Confirmation step
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-amber-400">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Celebration of Life Photos</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            {['Size & Qty', 'Upload Photo', 'Shipping', 'Confirm'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  step > i + 1 ? 'bg-green-600/20 text-green-400' :
                  step === i + 1 ? 'bg-amber-600/20 text-amber-400' : 'bg-slate-700/50 text-slate-500'
                }`}>
                  {step > i + 1 ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <div className={`w-8 h-0.5 mx-1 ${step > i + 1 ? 'bg-green-600' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: Size & Quantity Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Print Size</h2>
              <p className="text-slate-400">Premium glossy finish • Vibrant colors • Ships in 72 hours</p>
            </div>

            {/* Size Selection */}
            <RadioGroup value={selectedSize} onValueChange={(v) => setSelectedSize(v as PhotoSize)} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {PHOTO_SIZES.map((size) => (
                <div key={size.id}>
                  <RadioGroupItem value={size.id} id={size.id} className="peer sr-only" />
                  <Label
                    htmlFor={size.id}
                    className="flex flex-col items-center justify-center p-6 bg-slate-800 border-2 border-slate-700 rounded-xl cursor-pointer transition-all hover:border-slate-600 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-500/10"
                  >
                    <span className="text-2xl font-bold text-white mb-1">{size.name}</span>
                    <span className="text-3xl font-bold text-amber-400">${size.price}</span>
                    <span className="text-slate-400 text-sm">per print</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Quantity Selection */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">Quantity</h3>
                  <p className="text-slate-400 text-sm">How many {currentSizeConfig.name} prints do you need?</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold text-white min-w-[3ch] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= 99}
                    className="h-10 w-10 border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <Card className="bg-amber-900/20 border-amber-600/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-300">Your Order</p>
                    <p className="text-white font-medium">{quantity}× {currentSizeConfig.name} Prints</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">${totalPrice}</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 text-lg"
            >
              Continue to Upload Photo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Photo Upload */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Upload Your Photo</h2>
              <p className="text-slate-400">High resolution photos work best for large format prints</p>
            </div>

            {/* Photo Preview */}
            <div className="flex flex-col items-center gap-6">
              <div
                ref={previewRef}
                className="relative bg-slate-800 rounded-lg overflow-hidden shadow-2xl"
                style={{
                  width: '100%',
                  maxWidth: '400px',
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon className="h-16 w-16 mb-4" />
                    <p>No photo uploaded</p>
                  </div>
                )}
                
                {/* Size badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                <Button
                  onClick={() => photoInputRef.current?.click()}
                  variant="outline"
                  className="border-amber-600 text-amber-400 hover:bg-amber-600/10 px-8 py-6 text-lg"
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Upload Photo
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => photoInputRef.current?.click()}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add More
                  </Button>
                  <Button
                    onClick={() => removePhoto(selectedPhotoIndex)}
                    variant="outline"
                    className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}

              {/* Photo Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhotoIndex === index ? 'border-amber-500' : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => {
                  if (photos.length === 0) {
                    toast.error('Please upload at least one photo');
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Shipping */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-amber-400" />
              <Label className="text-white font-semibold text-lg">Shipping Address</Label>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Full Name *</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Smith"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Email *</Label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Street Address *</Label>
                <Input
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label className="text-slate-400">City *</Label>
                  <Input
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="New York"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">State *</Label>
                  <Input
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="NY"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">ZIP *</Label>
                  <Input
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="10001"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Phone Number *</Label>
                <Input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Order Summary */}
            <Card className="bg-amber-900/20 border-amber-600/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-300">Your Order</p>
                    <p className="text-white font-medium">{quantity}× {currentSizeConfig.name} Celebration Photos</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">${totalPrice}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Order Confirmed!</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Thank you for your order. We'll send a confirmation email to <span className="text-white">{customerEmail}</span> with tracking information once your prints ship.
            </p>
            <div className="bg-slate-800 rounded-xl p-6 max-w-sm mx-auto">
              <p className="text-slate-400 mb-2">Order Summary</p>
              <p className="text-white font-medium">{quantity}× {currentSizeConfig.name} Celebration Photos</p>
              <p className="text-2xl font-bold text-amber-400 mt-2">${totalPrice}</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignPhotos;
