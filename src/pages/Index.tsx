import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Package, Truck, Clock, Heart, Star, CheckCircle2, ArrowRight, Gift } from 'lucide-react';

const Index = () => {
  // Three-tier pricing bundles
  const bundles = [
    {
      id: 'comfort',
      tier: 'budget' as const,
      badge: 'GREAT VALUE',
      name: 'Comfort Package',
      subtitle: 'Budget-Friendly',
      price: 97,
      comparePrice: 147,
      metalCards: 0,
      prayerCards: 72,
      photoAddOnPrice: 0.27,
      items: [
        '72 Photo Prayer Cards (Glossy)',
        '16×20 Easel Photo (+$5 for 18×24)',
        'Celebration of Life Photos from $0.27',
        'Full color, both sides',
        '3-Day Delivery',
      ],
      highlight: 'Beautiful cards at an affordable price',
    },
    {
      id: 'classic',
      tier: 'standard' as const,
      badge: 'MOST POPULAR',
      name: 'Classic Package',
      subtitle: 'Best Seller',
      price: 197,
      comparePrice: 297,
      metalCards: 55,
      prayerCards: 36,
      photoAddOnPrice: 0.27,
      items: [
        '55 Premium Metal Prayer Cards',
        '36 Photo Prayer Cards',
        '16×20 Easel Photo (+$5 for 18×24)',
        'Celebration of Life Photos from $0.27',
        '3-Day Delivery',
      ],
      highlight: 'Metal + paper cards — perfect balance',
    },
    {
      id: 'legacy',
      tier: 'luxury' as const,
      badge: 'PREMIUM',
      name: 'Legacy Package',
      subtitle: 'When Only the Best Will Do',
      price: 297,
      comparePrice: 447,
      metalCards: 110,
      prayerCards: 72,
      photoAddOnPrice: 0.27,
      items: [
        '110 Premium Metal Prayer Cards',
        '72 Photo Prayer Cards',
        '16×20 Easel Photo (+$5 for 18×24)',
        'Celebration of Life Photos from $0.27',
        'Priority 2-Day Delivery',
        'Dedicated Support',
      ],
      highlight: 'Maximum coverage for large services',
    },
  ];

  // Metal Cards Only - Good/Better/Best
  const packages = [
    {
      id: 'good',
      badge: undefined as string | undefined,
      name: 'Essential',
      price: 127,
      comparePrice: 197,
      items: ['55 Premium Metal Prayer Cards', '3-Day Delivery', 'Satisfaction Guaranteed'],
    },
    {
      id: 'better',
      badge: 'MOST POPULAR',
      name: 'Family',
      price: 197,
      comparePrice: 297,
      items: ['110 Premium Metal Prayer Cards', '3-Day Delivery', 'Satisfaction Guaranteed'],
    },
    {
      id: 'best',
      badge: 'BEST',
      name: 'Legacy',
      price: 297,
      comparePrice: 447,
      items: ['165 Premium Metal Prayer Cards', '3-Day Delivery', 'Satisfaction Guaranteed'],
    },
  ];

  const prayerCardPackages = [
    {
      id: 'starter',
      name: 'Starter',
      quantity: 36,
      price: 37,
      description: 'Perfect for intimate gatherings',
    },
    {
      id: 'standard',
      badge: 'POPULAR',
      name: 'Standard',
      quantity: 72,
      price: 57,
      description: 'Most common for services',
    },
    {
      id: 'large',
      name: 'Large',
      quantity: 100,
      price: 77,
      description: 'For larger celebrations of life',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-foreground">Luxuryprayercards.com</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">How It Works</a>
          </nav>
          <a href="#pricing">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              View Pricing
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          Honor Their<br />
          <span className="text-primary">Memory</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Premium metal prayer cards, photo prayer cards & celebration of life photos — crafted with care.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link to="/design">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-7 shadow-xl">
              Metal Cards
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/design?type=paper&quantity=72">
            <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2">
              Photo Prayer Cards
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/design/photos">
            <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2">
              Celebration Photos
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
          <div className="flex items-center gap-3 bg-primary/15 px-5 py-2.5 rounded-full border border-primary/30">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">3-Day</span>
            <span className="text-primary/40">|</span>
            <span className="text-sm font-bold text-primary">2-Day</span>
            <span className="text-primary/40">|</span>
            <span className="text-sm font-bold text-primary">Overnight</span>
          </div>
        </div>
      </section>


      {/* Complete Bundles - Three Price Tiers */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              COMPLETE PACKAGES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Choose Your Package</h2>
            <p className="text-muted-foreground mt-2">Every package includes the option to add photos at just $5 each.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {bundles.map((bundle) => (
              <Card
                key={bundle.id}
                className={
                  bundle.tier === 'luxury'
                    ? 'bg-gradient-to-b from-primary/15 to-primary/5 border-primary/40 relative overflow-hidden ring-2 ring-primary/50'
                    : bundle.tier === 'standard'
                    ? 'bg-primary/10 border-primary/30 relative overflow-hidden'
                    : 'bg-card border-border relative overflow-hidden'
                }
              >
                {bundle.badge && (
                  <div
                    className={
                      bundle.tier === 'luxury'
                        ? 'absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg'
                        : bundle.tier === 'standard'
                        ? 'absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full'
                        : 'absolute top-4 right-4 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full'
                    }
                  >
                    {bundle.badge}
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{bundle.subtitle}</p>
                    <h3 className="text-2xl font-bold text-foreground">{bundle.name}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-foreground">${bundle.price}</span>
                      <span className="text-muted-foreground line-through">${bundle.comparePrice}</span>
                    </div>
                    <p className="text-primary text-sm font-semibold mt-1">
                      Save ${bundle.comparePrice - bundle.price}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 italic">{bundle.highlight}</p>

                  <ul className="space-y-2 text-foreground/80 mb-4 text-sm">
                    {bundle.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className={bundle.tier === 'luxury' ? 'w-4 h-4 text-primary flex-shrink-0' : bundle.tier === 'standard' ? 'w-4 h-4 text-primary flex-shrink-0' : 'w-4 h-4 text-muted-foreground flex-shrink-0'} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Photo Add-on Callout */}
                  <div className="bg-secondary/50 border border-secondary rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Add Celebration Photos</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Starting at just <span className="font-bold text-primary">$0.27/photo</span>. Select sizes & quantities at checkout.
                    </p>
                  </div>

                  <Link to={`/design?bundle=${bundle.id}`} className="block">
                    <Button
                      size="lg"
                      className={
                        bundle.tier === 'luxury'
                          ? 'w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold text-lg py-6 shadow-lg'
                          : bundle.tier === 'standard'
                          ? 'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6'
                          : 'w-full font-semibold text-lg py-6'
                      }
                      variant={bundle.tier === 'budget' ? 'outline' : 'default'}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Want just metal cards or paper cards? See our à la carte options below ↓
          </p>
        </div>
      </section>

      {/* Metal Cards Only */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              À LA CARTE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Metal Prayer Cards Only</h2>
            <p className="text-muted-foreground mt-2">Premium heirloom-quality metal cards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={
                  pkg.id === 'better'
                    ? 'bg-primary/10 border-primary/30 relative overflow-hidden'
                    : 'bg-card border-border relative overflow-hidden'
                }
              >
                {pkg.badge ? (
                  <div
                    className={
                      pkg.id === 'better'
                        ? 'absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full'
                        : 'absolute top-4 right-4 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full'
                    }
                  >
                    {pkg.badge}
                  </div>
                ) : null}

                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className={pkg.id === 'better' ? 'h-7 w-7 text-primary' : 'h-7 w-7 text-muted-foreground'} />
                    <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-foreground">${pkg.price}</span>
                      <span className="text-muted-foreground line-through">${pkg.comparePrice}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">One-time package price</p>
                  </div>

                  <ul className="space-y-3 text-foreground/80 mb-8">
                    {pkg.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className={pkg.id === 'better' ? 'w-5 h-5 text-primary' : 'w-5 h-5 text-muted-foreground'} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link to={`/design?package=${pkg.id}`} className="block">
                    <Button
                      size="lg"
                      className={
                        pkg.id === 'better'
                          ? 'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6'
                          : 'w-full font-semibold text-lg py-6'
                      }
                      variant={pkg.id === 'better' ? 'default' : 'outline'}
                    >
                      Start Designing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mt-10">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Truck className="h-8 w-8 text-muted-foreground" />
                  Add-Ons
                </h3>
                <div className="space-y-6">
                  <div className="border-b border-border pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-foreground font-semibold">Additional 55-Card Set</p>
                        <p className="text-muted-foreground text-sm">Same design, more cards</p>
                      </div>
                      <span className="text-2xl font-bold text-foreground">$77</span>
                    </div>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-destructive" />
                      <p className="text-destructive font-semibold">Rush Overnight</p>
                    </div>
                    <p className="text-foreground/80 text-sm mb-2">Order by noon, ships same day.</p>
                    <p className="text-destructive font-bold">+100% Expedite Fee</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Prayer Cards Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              BUDGET-FRIENDLY OPTION
            </span>
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
                  <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                  
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
                      Order Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Thick glossy cardstock • Full color both sides • Delivered in 72 hours, ready for the service
          </p>
        </div>
      </section>


      {/* Celebration of Life Photos */}
      <section id="celebration-photos" className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              PHOTO PRINTS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Celebration of Life Photos</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Beautiful photo prints for display at services and keepsakes for family.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              { size: '4×6', price: 0.27 },
              { size: '5×7', price: 0.37 },
              { size: '8×10', price: 7 },
              { size: '11×14', price: 17 },
              { size: '16×20', price: 27 },
              { size: '18×24', price: 37 },
            ].map((photo) => (
              <Card key={photo.size} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-foreground mb-1">{photo.size}</div>
                  <div className="text-3xl font-bold text-primary mb-2">${photo.price}</div>
                  <Link to={`/design/photos?size=${photo.size}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Order
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Premium glossy finish • Vibrant colors • Delivered in 72 hours, ready for the service
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
                  <p className="text-muted-foreground text-sm">Delivered in 72 hours. Rush & overnight options available.</p>
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
