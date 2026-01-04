import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, MessageSquare, Shield, Package, Truck, Clock } from 'lucide-react';
import eternityLogo from '@/assets/eternity-cards-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={eternityLogo} alt="Metal Prayer Cards" className="h-12 w-auto" />
          </div>
          <Link to="/design">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Design Your Card
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-foreground/80 text-sm">Premium Metal Prayer Cards</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Metal Prayer Cards<br />
          <span className="text-primary">
            Built to Last Eternity
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Elegant metal prayer cards with embedded QR codes linking to any website you choose.
          Perfect for funeral homes seeking quality keepsakes.
        </p>
        <Link to="/design">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 shadow-lg">
            Start Designing Now
          </Button>
        </Link>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Premium metal prayer cards delivered fast. No hidden fees.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Express Pack */}
          <Card className="bg-primary/10 border-primary/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">2-Day Express Pack</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">$127</span>
                  <span className="text-muted-foreground line-through">$250</span>
                </div>
                <p className="text-primary font-medium mt-1">Save $123!</p>
              </div>
              <ul className="space-y-3 text-foreground/80 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  55 Premium Metal Prayer Cards
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  2 Easel Size Photos Included
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  2-Day Express Delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  Custom QR Code Link
                </li>
              </ul>
              <Link to="/design" className="block">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Order Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Truck className="h-8 w-8 text-muted-foreground" />
                Add-Ons
              </h3>
              <div className="space-y-6">
                <div className="border-b border-border pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-foreground font-semibold">Additional Set of 55 Cards</p>
                      <p className="text-muted-foreground text-sm">Same design, more cards</p>
                    </div>
                    <span className="text-2xl font-bold text-foreground">$110</span>
                  </div>
                </div>
                <div className="border-b border-border pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-foreground font-semibold">Additional Easel Photos</p>
                      <p className="text-muted-foreground text-sm">Large display photos</p>
                    </div>
                    <span className="text-2xl font-bold text-foreground">$27</span>
                  </div>
                </div>
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-destructive" />
                    <p className="text-destructive font-semibold">Overnight Rush</p>
                  </div>
                  <p className="text-foreground/80 text-sm mb-2">
                    Need it tomorrow? Orders placed before 12pm qualify for overnight delivery.
                  </p>
                  <p className="text-destructive font-bold">+100% Rush Fee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart QR Integration</h3>
            <p className="text-muted-foreground">Each metal card features a unique QR code etched into the surface, linking to any website you choose.</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">Durable metal construction ensures these keepsakes last for generations to come.</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">2-day express delivery standard. Overnight rush available for orders placed before 12pm.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-20 mt-16 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Create a Lasting Memorial?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Design your custom metal prayer card in minutes. No account required.
          </p>
          <Link to="/design">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-10">
              Start Designing
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Metal Prayer Cards. metalprayercards.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
