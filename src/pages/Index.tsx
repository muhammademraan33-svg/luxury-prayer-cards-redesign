import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Truck, Clock, Heart, Star, CheckCircle2, ArrowRight, Gift, Image, Upload, X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CardMockup } from '@/components/CardMockup';

interface PhotoUploadItem {
  src: string;
  qty: number;
  size?: '16x20' | '18x24';
}

interface CartItem {
  id: string;
  size: string;
  price: number;
  quantity: number;
  imagePreview: string | PhotoUploadItem[];
  packSize?: number;
}

const Index = () => {
  const [photoUploads, setPhotoUploads] = useState<Record<string, string>>({});
  const [multiPhotoUploads, setMultiPhotoUploads] = useState<Record<string, PhotoUploadItem[]>>({});
  const [photoQuantities, setPhotoQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handlePhotoUpload = (size: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoUploads(prev => ({ ...prev, [size]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleMultiPhotoUpload = (size: string, files: FileList) => {
    const newImages: PhotoUploadItem[] = [];
    let loaded = 0;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({ src: e.target?.result as string, qty: 1, size: '16x20' });
        loaded++;
        if (loaded === files.length) {
          setMultiPhotoUploads(prev => ({
            ...prev,
            [size]: [...(prev[size] || []), ...newImages]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (size: string) => {
    setPhotoUploads(prev => {
      const updated = { ...prev };
      delete updated[size];
      return updated;
    });
  };

  const removeMultiPhoto = (size: string, index: number) => {
    setMultiPhotoUploads(prev => ({
      ...prev,
      [size]: prev[size]?.filter((_, i) => i !== index) || []
    }));
  };

  const clearMultiPhotos = (size: string) => {
    setMultiPhotoUploads(prev => {
      const updated = { ...prev };
      delete updated[size];
      return updated;
    });
  };

  const handleAddToCart = (size: string, price: number, packSize?: number) => {
    const qty = photoQuantities[size] || 1;
    
    if (packSize) {
      // Multi-photo pack
      const images = multiPhotoUploads[size] || [];
      if (images.length === 0) {
        toast.error('Please upload at least one photo');
        return;
      }
      
      const newItem: CartItem = {
        id: `${size}-${Date.now()}`,
        size,
        price,
        quantity: qty,
        imagePreview: images,
        packSize,
      };
      
      setCart(prev => [...prev, newItem]);
      setCartOpen(true);
      clearMultiPhotos(size);
      setPhotoQuantities(prev => ({ ...prev, [size]: 1 }));
      toast.success(`Added ${qty}x ${size} pack(s) to cart`);
    } else {
      // Single photo
      if (!photoUploads[size]) {
        toast.error('Please upload a photo first');
        return;
      }
      
      const newItem: CartItem = {
        id: `${size}-${Date.now()}`,
        size,
        price,
        quantity: qty,
        imagePreview: photoUploads[size],
      };
      
      setCart(prev => [...prev, newItem]);
      setCartOpen(true);
      removePhoto(size);
      setPhotoQuantities(prev => ({ ...prev, [size]: 1 }));
      toast.success(`Added ${qty}x ${size} photo(s) to cart`);
    }
  };

  const updateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Metal card pricing - starter set + additional sets
  const metalBasePrice = 97;
  const metalAdditionalSetPrice = 87;
  const metalCardsPerSet = 55;

  // Prayer card pricing - simple starter + per-card
  const prayerCardPricing = {
    starterQty: 72,
    starterPrice: 67,
    perCardPrice: 0.77,
    freePhotos: 1,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-foreground">LuxuryPrayerCards.com</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">How It Works</a>
            </nav>
            
            {/* Cart Button */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle>Your Cart ({cartItemCount} items)</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col flex-1 pt-4 min-h-0">
                  {cart.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {cart.map((item) => {
                          const totalPrints = Array.isArray(item.imagePreview) 
                            ? item.imagePreview.reduce((sum, p) => sum + p.qty, 0)
                            : 1;
                          return (
                          <div key={item.id} className="flex gap-4 p-3 border border-border rounded-lg">
                            <div className="w-16 h-20 flex-shrink-0 overflow-hidden border border-border">
                              {Array.isArray(item.imagePreview) ? (
                                <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center">
                                  <span className="text-xs font-bold text-primary">{item.imagePreview.length} photos</span>
                                  <span className="text-[10px] text-muted-foreground">{totalPrints} prints</span>
                                </div>
                              ) : (
                                <img
                                  src={item.imagePreview}
                                  alt={`${item.size} photo`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground">
                                {item.size} {item.packSize ? 'Prints' : 'Print'}
                              </p>
                              <p className="text-primary font-bold">${item.price.toFixed(2)} {item.packSize ? 'per pack' : 'each'}</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 ml-auto text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex-shrink-0 pt-4 border-t border-border mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                        </div>
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => {
                            // For now, redirect to design page - in production this would go to a checkout flow
                            setCartOpen(false);
                            toast.success('Proceeding to checkout...', {
                              description: 'You will be redirected to complete your order.'
                            });
                            // Redirect to design page with first cart item
                            const firstItem = cart[0];
                            if (firstItem) {
                              window.location.href = `/design?type=paper&quantity=${firstItem.packSize || 72}`;
                            }
                          }}
                        >
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left">
              <p className="text-primary font-medium mb-4 tracking-wide">
                TRUSTED BY 10,000+ FAMILIES NATIONWIDE
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Honor Their Memory with{' '}
                <span className="text-primary">Beautiful</span> Prayer Cards
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Create stunning keepsakes that family and friends will treasure forever. 
                From classic paper cards to premium metal finishes — delivered in as fast as 48 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link to="/design?type=paper&quantity=55">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-7 shadow-xl">
                    Design Prayer Cards
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2">
                    See Pricing
                  </Button>
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">48-Hour Rush Available</span>
                </div>
              </div>
            </div>
            
            {/* Right - Product Preview */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Paper Card Preview */}
                <div className="relative group">
                  <CardMockup variant="paper" className="w-full" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-4 py-1.5 shadow-lg">
                    <span className="text-sm font-semibold text-foreground">Paper Cards</span>
                  </div>
                </div>
                
                {/* Metal Card Preview */}
                <div className="relative group mt-8">
                  <CardMockup variant="metal" className="w-full" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-4 py-1.5 shadow-lg">
                    <span className="text-sm font-semibold text-foreground">Metal Cards</span>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                FREE Memorial Photo
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof Bar */}
      <section className="border-y border-border bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span className="text-muted-foreground text-sm">(2,500+ reviews)</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl text-primary">10,000+</span>
              <span className="text-muted-foreground text-sm ml-2">Families Served</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl text-primary">48hr</span>
              <span className="text-muted-foreground text-sm ml-2">Rush Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}

      {/* Photo Prayer Cards Section - PRIMARY */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Photo Prayer Cards</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Beautiful glossy cardstock prayer cards — the classic choice families have trusted for generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Paper Cards */}
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Paper Cards</h3>
                <p className="text-primary font-bold text-sm mb-4">55 Cards + 1 Memorial Photo</p>
                
                <div className="mb-4 flex items-center gap-3 justify-center">
                  <span className="text-2xl text-foreground/60 line-through">$125</span>
                  <span className="text-5xl font-bold text-foreground" style={{ fontVariantNumeric: 'lining-nums' }}>$67</span>
                  <span className="bg-green-500/20 text-green-600 text-xs font-bold px-2 py-1 rounded">Save $58</span>
                </div>
                
                <p className="text-foreground/80 text-sm mb-4">
                  Need more? Add cards for just ${prayerCardPricing.perCardPrice.toFixed(2)} each
                </p>

                <Link to="/design?type=paper&quantity=55" className="block">
                  <Button size="lg" className="w-full font-semibold text-lg py-6">
                    Start Designing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-foreground/70 text-xs mt-3">Thick glossy cardstock</p>
              </CardContent>
            </Card>

            {/* Metal Cards */}
            <Card className="bg-secondary/50 border-secondary overflow-hidden">
              <CardContent className="p-8 text-center">
                <span className="inline-block bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full mb-3">
                  PREMIUM
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-2">Metal Cards</h3>
                <p className="text-primary font-bold text-sm mb-4">55 Cards + 1 Memorial Photo</p>
                
                <div className="mb-4 flex items-center gap-3 justify-center">
                  <span className="text-2xl text-foreground/60 line-through">$175</span>
                  <span className="text-5xl font-bold text-foreground" style={{ fontVariantNumeric: 'lining-nums' }}>$97</span>
                  <span className="bg-green-500/20 text-green-600 text-xs font-bold px-2 py-1 rounded">Save $78</span>
                </div>
                
                <p className="text-foreground/80 text-sm mb-4">
                  Additional sets of 55: $77 each
                </p>

                <Link to="/design?type=metal&quantity=55" className="block">
                  <Button size="lg" variant="secondary" className="w-full font-semibold text-lg py-6">
                    Start Designing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-foreground/70 text-xs mt-3">Premium metal finish</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-foreground/70 text-sm mt-6">
            Full color both sides • 72-Hour $10 • 48-Hour Rush $17
          </p>
        </div>
      </section>



      {/* Celebration of Life Memorial Photos */}
      <section id="memorial-photos" className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              MEMORIAL PHOTOS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Celebration of Life Photos</h2>
            <p className="text-muted-foreground mt-2">Professional-quality prints for the service and home display.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { size: '4x6', price: 12, aspect: '3/2', packSize: 20, extraPrice: 0.57 },
              { size: '5x7', price: 17, aspect: '5/7', packSize: 12, extraPrice: 0.67 },
              { size: '8x10', price: 7, aspect: '4/5' },
              { size: '11x14', price: 17, aspect: '11/14' },
              { size: '16x20', price: 17, aspect: '4/5', isMemorial: true, memorialLabel: '16x20 Memorial Photo' },
              { size: '18x24', price: 27, aspect: '4/5', isMemorial: true, memorialLabel: '18x24 Memorial Photo' },
            ].map((photo) => {
              // Calculate total prints and price for pack items
              const uploads = multiPhotoUploads[photo.size] || [];
              const totalPrints = photo.packSize 
                ? uploads.reduce((sum, p) => sum + p.qty, 0)
                : 1;
              const extraPrints = photo.packSize ? Math.max(0, totalPrints - photo.packSize) : 0;
              const extraCost = extraPrints * (photo.extraPrice || 0);
              
              // For memorial photos, price is now per-item
              const totalPrice = (photo as any).isMemorial 
                ? photo.price * (uploads.length || 0)
                : (photo.price + extraCost);
              
              return (
              <Card key={photo.size} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Image className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {(photo as any).memorialLabel || photo.size} {photo.packSize && <span className="text-sm font-normal text-muted-foreground">Pack of {photo.packSize}</span>}
                        </p>
                        <p className="text-primary font-bold">
                          ${photo.price.toFixed(2)} {!photo.packSize && <span className="text-muted-foreground font-normal text-sm">each</span>}
                        </p>
                        {photo.packSize && photo.extraPrice && (
                          <p className="text-xs text-muted-foreground">+${photo.extraPrice.toFixed(2)}/print over {photo.packSize}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show total price for memorial photos */}
                  {(photo as any).isMemorial && uploads.length > 0 && (
                    <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Photos:</span>
                        <span className="font-semibold">{uploads.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total prints:</span>
                        <span className="font-semibold">{uploads.reduce((sum, p) => sum + p.qty, 0)}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-1 pt-1 border-t border-border">
                        <span>Total:</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Show total price if over pack size */}
                  {photo.packSize && totalPrints > 0 && (
                    <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total prints:</span>
                        <span className="font-semibold">{totalPrints}</span>
                      </div>
                      {extraPrints > 0 && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>Extra prints ({extraPrints} × ${photo.extraPrice?.toFixed(2)}):</span>
                          <span>+${extraCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold mt-1 pt-1 border-t border-border">
                        <span>Total:</span>
                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {!(photo as any).isMemorial && !photo.packSize && (
                      <div>
                        <Label htmlFor={`qty-${photo.size}`} className="text-sm text-muted-foreground">
                          Quantity
                        </Label>
                        <Input 
                          id={`qty-${photo.size}`}
                          type="number" 
                          min="1" 
                          value={photoQuantities[photo.size] || 1}
                          onChange={(e) => setPhotoQuantities(prev => ({ ...prev, [photo.size]: parseInt(e.target.value) || 1 }))}
                          className="mt-1"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Upload Photo{photo.packSize || (photo as any).isMemorial ? 's' : ''}
                      </Label>
                      
                      {(photo.packSize || (photo as any).isMemorial) ? (
                        // Multi-photo upload for packs and memorial photos
                        <>
                          {uploads.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {uploads.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 border border-border rounded-lg">
                                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden" style={{ aspectRatio: photo.aspect }}>
                                    <img 
                                      src={img.src} 
                                      alt={`Preview ${idx + 1}`} 
                                      className="w-full h-full object-cover border border-border"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-1 flex-1">
                                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Qty:</Label>
                                    <Input 
                                      type="number"
                                      min="1"
                                      value={img.qty}
                                      onChange={(e) => {
                                        const newQty = parseInt(e.target.value) || 1;
                                        setMultiPhotoUploads(prev => ({
                                          ...prev,
                                          [photo.size]: prev[photo.size]?.map((p, i) => 
                                            i === idx ? { ...p, qty: newQty } : p
                                          ) || []
                                        }));
                                      }}
                                      className="w-14 h-8 text-sm"
                                    />
                                  </div>
                                  <button
                                    onClick={() => removeMultiPhoto(photo.size, idx)}
                                    className="bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <label 
                            htmlFor={`upload-${photo.size}`}
                            className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {uploads.length > 0 
                                ? 'Add more photos' 
                                : 'Choose files'}
                            </span>
                            <input 
                              id={`upload-${photo.size}`}
                              type="file" 
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) handleMultiPhotoUpload(photo.size, e.target.files);
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        // Single photo upload
                        <>
                          {photoUploads[photo.size] ? (
                            <div className="mt-1 relative" style={{ aspectRatio: photo.aspect }}>
                              <img 
                                src={photoUploads[photo.size]} 
                                alt="Preview" 
                                className="w-full h-full object-cover border border-border"
                              />
                              <button
                                onClick={() => removePhoto(photo.size)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label 
                              htmlFor={`upload-${photo.size}`}
                              className="mt-1 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
                            >
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Choose file</span>
                              <input 
                                id={`upload-${photo.size}`}
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePhotoUpload(photo.size, file);
                                }}
                              />
                            </label>
                          )}
                        </>
                      )}
                    </div>

                    <Button 
                      onClick={() => handleAddToCart(photo.size, totalPrice, photo.packSize || ((photo as any).isMemorial ? -1 : undefined))}
                      className="w-full mt-2"
                      variant={((photo.packSize || (photo as any).isMemorial) ? uploads.length > 0 : photoUploads[photo.size]) ? 'default' : 'outline'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart {((photo.packSize || (photo as any).isMemorial) && uploads.length > 0) && `- $${totalPrice.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Professional lustre finish • Arrives ready to frame • Add to any order
          </p>
        </div>
      </section>

      {/* Features - Simplified */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-background border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Fully Personalized</h3>
                  <p className="text-muted-foreground text-sm">Upload photos, choose templates, add prayers or verses.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Premium Quality</h3>
                  <p className="text-muted-foreground text-sm">Metal cards that last forever, or classic glossy cardstock.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground text-sm">Choose from 48-72 hour delivery options.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Design</h3>
              <p className="text-muted-foreground text-sm">Upload photos and personalize your cards.</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Order</h3>
              <p className="text-muted-foreground text-sm">Review and complete checkout.</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Receive</h3>
              <p className="text-muted-foreground text-sm">Delivered in 48 hours, ready for the service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Trusted by Families Everywhere</h2>
            <p className="text-muted-foreground">See why thousands choose us during their most important moments</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">
                  "During the hardest week of our lives, this company made everything so easy. The cards arrived in 2 days and were absolutely stunning. Every guest wanted to keep one."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Sarah M.</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">
                  "The metal finish is incredible — it feels like an heirloom, not just a card. My mother would have loved knowing her memory is preserved so beautifully."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">MT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Maria T.</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">
                  "I was worried about ordering online for something so important, but the quality exceeded all expectations. The customer service was compassionate and helpful."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">JR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">James R.</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-16 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create beautiful memorial cards in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/design">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-10 py-7 shadow-xl">
                Start Designing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-lg font-bold text-foreground">LuxuryPrayerCards.com</span>
            <p className="text-muted-foreground text-sm">© 2025 Luxury Prayer Cards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
