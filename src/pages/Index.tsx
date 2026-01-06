import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Truck, Clock, Heart, Star, CheckCircle2, ArrowRight, Gift, Image } from 'lucide-react';
import metalCardProduct from '@/assets/metal-card-product.jpg';
import paperCardsProduct from '@/assets/paper-cards-product.jpg';

const Index = () => {
  const metalPackages = [
    {
      id: 'good',
      name: 'Essential',
      quantity: 55,
      price: 97,
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
          Beautiful Prayer Cards<br />
          <span className="text-primary">Delivered Fast</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Premium photo prayer cards & heirloom metal cards. Shipped in 48 hours.
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

          {/* Metal Add-ons */}
          <div className="mt-10">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Truck className="h-8 w-8 text-muted-foreground" />
                  Metal Card Add-Ons
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
                  <div className="border-b border-border pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-foreground font-semibold">Extra 16x20 Memorial Photos</p>
                        <p className="text-muted-foreground text-sm">Professional quality displays</p>
                      </div>
                      <span className="text-2xl font-bold text-foreground">$17</span>
                    </div>
                  </div>
                  <div className="border-b border-border pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-foreground font-semibold">Upgrade to 18x24</p>
                        <p className="text-muted-foreground text-sm">Larger photo board size</p>
                      </div>
                      <span className="text-2xl font-bold text-foreground">+$7</span>
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

      {/* Bonus Photo Boards - Metal Cards Only */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 relative">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                WITH METAL CARDS
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Two 16x20 Memorial Photos Included</h2>
                <p className="text-muted-foreground">A $200+ value — on us with every metal card package</p>
              </div>
            </div>
            
            <p className="text-foreground/80 leading-relaxed">
              Every metal card order includes two professional-quality 16x20 memorial photos — ready for the service and home display.
            </p>
          </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { size: '4x6', price: 0.37 },
              { size: '5x7', price: 0.47 },
              { size: '8x10', price: 7 },
              { size: '11x14', price: 17 },
              { size: '16x20', price: 27 },
              { size: '18x24', price: 37 },
            ].map((photo) => (
              <Card key={photo.size} className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-1">{photo.size}</p>
                  <p className="text-2xl font-bold text-primary">${photo.price}</p>
                  <p className="text-muted-foreground text-xs mt-1">per print</p>
                </CardContent>
              </Card>
            ))}
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
