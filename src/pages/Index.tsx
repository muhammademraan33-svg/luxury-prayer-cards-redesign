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
import metalCardProduct from '@/assets/metal-card-product.jpg';
import paperCardsProduct from '@/assets/paper-cards-product.jpg';

interface PhotoUploadItem {
  src: string;
  qty: number;
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
  const [multiPhotoUploads, setMultiPhotoUploads] = useState<Record<string, { src: string; qty: number }[]>>({});
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
        newImages.push({ src: e.target?.result as string, qty: 1 });
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
  const metalPackages = [
    {
      id: 'good',
      name: 'Essential',
      quantity: 55,
      price: 117,
      photos: 2,
      description: '+ 2 FREE 16x20 Memorial Photos',
    },
    {
      id: 'better',
      badge: 'MOST POPULAR',
      name: 'Family',
      quantity: 110,
      price: 167,
      photos: 4,
      description: '+ 4 FREE 16x20 Memorial Photos',
    },
    {
      id: 'best',
      badge: 'BEST VALUE',
      name: 'Legacy',
      quantity: 165,
      price: 247,
      photos: 6,
      description: '+ 6 FREE 16x20 Memorial Photos',
    },
  ];

  const prayerCardPackages = [
    {
      id: 'starter',
      name: 'Starter',
      quantity: 72,
      price: 57,
      photos: 1,
      description: '+ 1 FREE 16x20 Memorial Photo',
    },
    {
      id: 'standard',
      badge: 'MOST POPULAR',
      name: 'Standard',
      quantity: 100,
      price: 77,
      photos: 2,
      description: '+ 2 FREE 16x20 Memorial Photos',
    },
    {
      id: 'large',
      name: 'Large',
      quantity: 150,
      price: 97,
      photos: 2,
      description: '+ 2 FREE 16x20 Memorial Photos',
    },
  ];

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
                        <Button className="w-full" size="lg">
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
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          Prayer Cards & Memorial Photos<br />
          <span className="text-primary">Delivered Fast</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Photo prayer cards, heirloom metal cards & celebration of life prints. Shipped fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link to="/design?type=paper&quantity=72">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-7 shadow-xl">
              Photo Prayer Cards
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/design">
            <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
              Metal Cards
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Heirloom Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">48-Hour Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Photo Boards Included</span>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden shadow-lg">
                <img src={paperCardsProduct} alt="Glossy Photo Prayer Cards" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Photo Prayer Cards</h3>
              <p className="text-muted-foreground text-sm">Classic glossy cardstock</p>
            </div>
            <div className="text-center">
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden shadow-lg">
                <img src={metalCardProduct} alt="Premium Metal Prayer Card" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Metal Prayer Cards</h3>
              <p className="text-muted-foreground text-sm">Heirloom quality that lasts forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Prayer Cards Section - PRIMARY */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Photo Prayer Cards</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Beautiful glossy cardstock prayer cards — the classic choice families have trusted for generations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {prayerCardPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={
                  pkg.badge
                    ? 'bg-primary/10 border-primary/30 relative overflow-hidden'
                    : 'bg-card border-border relative overflow-hidden'
                }
              >
                {pkg.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-primary font-bold text-sm mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-foreground">${pkg.price}</span>
                  </div>
                  
                  <p className="text-lg font-semibold text-foreground mb-6">
                    {pkg.quantity} Cards
                  </p>

                  <Link to={`/design?type=paper&quantity=${pkg.quantity}`} className="block">
                    <Button
                      size="lg"
                      className="w-full font-semibold text-lg py-6"
                      variant={pkg.badge ? 'default' : 'outline'}
                    >
                      Start Designing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Thick glossy cardstock • Full color both sides • 72-Hour +$10 • 48-Hour +$15 • Overnight +100% • +$7 per additional design
          </p>
        </div>
      </section>

      {/* Metal Cards Section - SECONDARY */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              PREMIUM UPGRADE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Metal Prayer Cards</h2>
            <p className="text-muted-foreground mt-2">Heirloom quality keepsakes that last forever.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {metalPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={
                  pkg.badge
                    ? 'bg-secondary/10 border-secondary/30 relative overflow-hidden'
                    : 'bg-card border-border relative overflow-hidden'
                }
              >
                {pkg.badge && (
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.badge}
                  </div>
                )}

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-primary font-bold text-sm mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-foreground">${pkg.price}</span>
                  </div>
                  
                  <p className="text-lg font-semibold text-foreground mb-6">
                    {pkg.quantity} Cards
                  </p>

                  <Link to={`/design?package=${pkg.id}`} className="block">
                    <Button
                      size="lg"
                      className="w-full font-semibold text-lg py-6"
                      variant={pkg.badge ? 'default' : 'outline'}
                    >
                      Start Designing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Premium metal finish • Full color both sides • 72-Hour +$10 • 48-Hour +$15 • Overnight +100%
          </p>

        </div>
      </section>


      {/* Celebration of Life Memorial Photos */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
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
              { size: '16x20', price: 27, aspect: '4/5' },
              { size: '18x24', price: 37, aspect: '3/4' },
            ].map((photo) => {
              // Calculate total prints and price for pack items
              const totalPrints = photo.packSize 
                ? (multiPhotoUploads[photo.size]?.reduce((sum, p) => sum + p.qty, 0) || 0)
                : 1;
              const extraPrints = photo.packSize ? Math.max(0, totalPrints - photo.packSize) : 0;
              const extraCost = extraPrints * (photo.extraPrice || 0);
              const totalPrice = photo.price + extraCost;
              
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
                          {photo.size} {photo.packSize && <span className="text-sm font-normal text-muted-foreground">Pack of {photo.packSize}</span>}
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
                    {!photo.packSize && (
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
                        Upload Photo{photo.packSize ? 's' : ''}
                      </Label>
                      
                      {photo.packSize ? (
                        // Multi-photo upload for packs
                        <>
                          {(multiPhotoUploads[photo.size]?.length || 0) > 0 && (
                            <div className="mt-2 space-y-2">
                              {multiPhotoUploads[photo.size]?.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 border border-border rounded-lg">
                                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden" style={{ aspectRatio: photo.aspect }}>
                                    <img 
                                      src={img.src} 
                                      alt={`Preview ${idx + 1}`} 
                                      className="w-full h-full object-cover border border-border"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 flex-1">
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
                                      className="w-16 h-8 text-sm"
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
                              {(multiPhotoUploads[photo.size]?.length || 0) > 0 
                                ? 'Add more' 
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
                      onClick={() => handleAddToCart(photo.size, totalPrice, photo.packSize)}
                      className="w-full mt-2"
                      variant={(photo.packSize ? (multiPhotoUploads[photo.size]?.length || 0) > 0 : photoUploads[photo.size]) ? 'default' : 'outline'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart {photo.packSize && totalPrints > 0 && `- $${totalPrice.toFixed(2)}`}
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
                  <p className="text-muted-foreground text-sm">Ships in 48 hours. Overnight rush available.</p>
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

      {/* Testimonials */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4">
                  "The cards were beautiful. Everyone wanted to keep one."
                </p>
                <p className="font-semibold text-foreground text-sm">Sarah M.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4">
                  "Photo boards included saved me so much stress."
                </p>
                <p className="font-semibold text-foreground text-sm">James R.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4">
                  "Arrived in 2 days. The metal finish is stunning."
                </p>
                <p className="font-semibold text-foreground text-sm">Maria T.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10K+</p>
              <p className="text-muted-foreground text-sm">Families Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">4.9★</p>
              <p className="text-muted-foreground text-sm">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">48hr</p>
              <p className="text-muted-foreground text-sm">Delivery</p>
            </div>
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
                Metal Cards
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/design?type=paper&quantity=72">
              <Button size="lg" variant="outline" className="font-semibold text-lg px-10 py-7 border-2">
                Photo Prayer Cards
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
            <span className="text-lg font-bold text-foreground">Metalprayercards.com</span>
            <p className="text-muted-foreground text-sm">© 2025 Metal Prayer Cards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
