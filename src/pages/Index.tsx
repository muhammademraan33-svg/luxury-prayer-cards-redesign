import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, MessageSquare, Shield, Package, Truck, Clock, PenTool, Send, Heart, Star, Quote, CheckCircle2, ArrowRight } from 'lucide-react';
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
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Testimonials</a>
          </nav>
          <Link to="/design">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Design Your Card
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2.5 mb-8">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-foreground/80 text-sm font-medium">Trusted by 10,000+ Families Nationwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            The Prayer Card<br />
            <span className="text-primary">
              Reimagined
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            We understand how hard it is to lose a loved one.
          </p>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-12">
          It was our goal to make this time a little less stressful while creating final memories that will last 
          eternity. Simply upload your photo and we include 2 easel-sized photo boards—saving you a trip to Staples 
          and hundreds of dollars, taking one less thing off your plate during this difficult time.
        </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/design">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12 py-7 shadow-xl hover:shadow-2xl transition-all">
                Start Designing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                See How It Works
              </Button>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">2-Day Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Premium Metal Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Lifetime Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Photo Boards Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-4 block">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Creating a beautiful memorial has never been easier. Three simple steps to honor your loved one.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-20 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-background rounded-2xl border-2 border-primary/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:border-primary/40 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">1</div>
                <PenTool className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our intuitive editor to create a personalized prayer card. Upload photos, add prayers, and customize every detail.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-background rounded-2xl border-2 border-primary/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:border-primary/40 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">2</div>
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Order</h3>
              <p className="text-muted-foreground leading-relaxed">
                Review your design and place your order. Our team begins production immediately with our premium metal printing process.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="relative z-10 w-24 h-24 mx-auto mb-8 bg-background rounded-2xl border-2 border-primary/20 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:border-primary/40 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">3</div>
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Receive</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your cards arrive within 2 days, beautifully packaged with your 2 complimentary easel-sized photo boards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Trusted by Families Everywhere</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from families who chose to honor their loved ones with our premium memorial cards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "During the hardest time of our lives, this service was a blessing. The cards were absolutely beautiful and arrived right on time. The quality exceeded our expectations."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sarah Mitchell</p>
                    <p className="text-muted-foreground text-sm">Chicago, IL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "The metal prayer cards are stunning. Everyone at the service commented on how special and unique they were. A truly lasting memorial for my father."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">JR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">James Rodriguez</p>
                    <p className="text-muted-foreground text-sm">Houston, TX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 text-lg">
                  "The QR code feature is incredible. Family members from around the world can now share memories. This company truly understands what families need."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">MT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Maria Thompson</p>
                    <p className="text-muted-foreground text-sm">Phoenix, AZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-muted-foreground font-medium">Families Served</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</p>
              <p className="text-muted-foreground font-medium">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">2 Day</p>
              <p className="text-muted-foreground font-medium">Avg. Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9★</p>
              <p className="text-muted-foreground font-medium">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-24" id="pricing">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-4 block">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium metal prayer cards delivered fast. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Express Pack */}
          <Card className="bg-primary/10 border-primary/30 relative overflow-hidden hover:shadow-xl transition-all duration-300">
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
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6">
                  Order Now
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
          <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Smart QR Integration</h3>
            <p className="text-muted-foreground leading-relaxed">Each metal card features a unique QR code etched into the surface, linking to any website you choose.</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Premium Quality</h3>
            <p className="text-muted-foreground leading-relaxed">Durable metal construction ensures these keepsakes last for generations to come.</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Fast Delivery</h3>
            <p className="text-muted-foreground leading-relaxed">2-day express delivery standard. Overnight rush available for orders placed before 12pm.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-24 mt-16 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Create a Lasting Memorial?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Design your custom metal prayer card in minutes. No account required.
          </p>
          <Link to="/design">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-12 py-7 shadow-xl">
              Start Designing Now
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
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            </nav>
            <p className="text-muted-foreground text-sm">© 2025 Metal Prayer Cards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
