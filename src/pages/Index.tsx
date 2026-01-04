import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, MessageSquare, Shield, Package, Truck, Clock, PenTool, Send, Heart, Star, Quote, CheckCircle2, ArrowRight, Gift, Sparkles } from 'lucide-react';
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
          <nav className="hidden md:flex items-center gap-8">
            <a href="#cards" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Our Cards</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</a>
          </nav>
          <Link to="/design">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Design Your Cards
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground/80 text-sm font-medium tracking-wide">Premium Metal Memorial Cards</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            Keepsakes That<br />
            <span className="text-primary">Last Forever</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed font-light">
            Honor your loved one with beautifully crafted metal prayer cards. Elegant, personal, and built to be treasured for generations.
          </p>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Design your custom memorial cards in minutes. Upload photos, add prayers, and receive 55 premium metal cards within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/design">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12 py-7 shadow-xl hover:shadow-2xl transition-all">
                Create Your Cards
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#cards">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                See Examples
              </Button>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">55 Premium Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">48-Hour Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Heirloom Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Card Features Section */}
      <section id="cards" className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">The Product</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Premium Metal Prayer Cards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Not paper. Not plastic. Enduring metal keepsakes that honor a life well-lived.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Fully Personalized</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Upload their photo, choose from elegant templates, and add meaningful prayers or verses. Each card tells their unique story.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Built to Last</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Precision-printed on premium metal. Won't fade, tear, or deteriorate. A true heirloom to pass down through generations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Digital Memorial</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Each card includes a QR code linking to an online tribute page where family and friends can share memories.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bonus Value Add - Photo Boards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-10 md:p-14 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                INCLUDED FREE
              </span>
            </div>
            
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Two Easel Photo Boards Included
                </h2>
                <p className="text-muted-foreground text-lg font-light">
                  A $200+ value — on us
                </p>
              </div>
            </div>
            
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              Skip the trip to Staples. Every order includes two professional-quality easel photo boards featuring your loved one's portrait — ready to display at the service and keep at home.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-foreground bg-background/50 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Professional prints
              </div>
              <div className="flex items-center gap-2 text-foreground bg-background/50 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Easel stands included
              </div>
              <div className="flex items-center gap-2 text-foreground bg-background/50 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Delivered with your cards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Simple & Fast</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Create your memorial cards in three easy steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="relative text-center group">
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Design</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Upload photos, choose a template, and personalize with prayers or messages using our easy editor.
              </p>
            </div>
            
            <div className="relative text-center group">
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Order</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Review your design and complete checkout. Photo boards are automatically included at no extra cost.
              </p>
            </div>
            
            <div className="relative text-center group">
              <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Receive</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Your metal cards and photo boards arrive within 48 hours — ready for the service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-24" id="pricing">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">All-Inclusive Package</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Everything you need, one simple price. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Main Package */}
          <Card className="bg-primary/10 border-primary/30 relative overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full tracking-wide">
              BEST VALUE
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Complete Memorial Set</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">$127</span>
                  <span className="text-muted-foreground line-through">$250</span>
                </div>
                <p className="text-primary font-medium mt-1">Save $123</p>
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
                  2 Easel Photo Boards (FREE)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  48-Hour Delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  Custom QR Memorial Link
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  Satisfaction Guaranteed
                </li>
              </ul>
              <Link to="/design" className="block">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6">
                  Start Designing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-card border-border hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Truck className="h-8 w-8 text-muted-foreground" />
                Add-Ons
              </h3>
              <div className="space-y-6">
                <div className="border-b border-border pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-foreground font-semibold">Additional 55-Card Set</p>
                      <p className="text-muted-foreground text-sm">Same design, more cards</p>
                    </div>
                    <span className="text-2xl font-bold text-foreground">$110</span>
                  </div>
                </div>
                <div className="border-b border-border pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-foreground font-semibold">Extra Photo Boards</p>
                      <p className="text-muted-foreground text-sm">Additional easel displays</p>
                    </div>
                    <span className="text-2xl font-bold text-foreground">$27</span>
                  </div>
                </div>
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-destructive" />
                    <p className="text-destructive font-semibold">Rush Overnight</p>
                  </div>
                  <p className="text-foreground/80 text-sm mb-2">
                    Order by noon, ships same day.
                  </p>
                  <p className="text-destructive font-bold">+100% Expedite Fee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4 block">Reviews</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Trusted by Families</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              See why thousands choose us during life's most important moments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "The cards were absolutely beautiful. Everyone at the service wanted to keep one. The quality is unlike anything I've seen."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sarah M.</p>
                    <p className="text-muted-foreground text-sm">Chicago, IL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "I dreaded running to Staples for photo boards during such a hard week. When I learned they were included, I was so relieved."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">JR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">James R.</p>
                    <p className="text-muted-foreground text-sm">Houston, TX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "Arrived in 2 days as promised. The metal finish is stunning. These are keepsakes my family will treasure forever."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">MT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Maria T.</p>
                    <p className="text-muted-foreground text-sm">Phoenix, AZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">10K+</p>
              <p className="text-muted-foreground text-sm font-medium">Families Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">98%</p>
              <p className="text-muted-foreground text-sm font-medium">Recommend Us</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">48hr</p>
              <p className="text-muted-foreground text-sm font-medium">Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">4.9★</p>
              <p className="text-muted-foreground text-sm font-medium">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-24 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Create beautiful memorial cards in minutes. Free photo boards included with every order.
          </p>
          <Link to="/design">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-12 py-7 shadow-xl">
              Design Your Cards Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={eternityLogo} alt="Metal Prayer Cards" className="h-10 w-auto" />
            </div>
            <nav className="flex items-center gap-8 text-sm">
              <a href="#cards" className="text-muted-foreground hover:text-foreground transition-colors">Our Cards</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>
            <p className="text-muted-foreground text-sm">© 2025 Metal Prayer Cards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
