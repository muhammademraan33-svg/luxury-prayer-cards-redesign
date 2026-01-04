import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, MessageSquare, Shield, Package, Truck, Clock } from 'lucide-react';
import eternityLogo from '@/assets/eternity-cards-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={eternityLogo} alt="Metal Prayer Cards" className="h-12 w-auto" />
          </div>
          <Link to="/design">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
              Design Your Card
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-600/30 rounded-full px-4 py-2 mb-8">
          <Shield className="h-4 w-4 text-amber-400" />
          <span className="text-amber-200 text-sm">Premium Metal Prayer Cards</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Metal Prayer Cards<br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Built to Last Eternity
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Elegant metal prayer cards with embedded QR codes linking to interactive memorial pages 
          where loved ones share videos and heartfelt messages forever.
        </p>
        <Link to="/design">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-lg px-10 py-6 shadow-lg shadow-amber-500/25">
            Start Designing Now
          </Button>
        </Link>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
          Premium metal prayer cards delivered fast. No hidden fees.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Express Pack */}
          <Card className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-600/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-amber-400" />
                <h3 className="text-2xl font-bold text-white">2-Day Express Pack</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$127</span>
                  <span className="text-slate-400 line-through">$250</span>
                </div>
                <p className="text-amber-400 font-medium mt-1">Save $123!</p>
              </div>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs">✓</span>
                  </div>
                  55 Premium Metal Prayer Cards
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs">✓</span>
                  </div>
                  2 Easel Size Photos Included
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs">✓</span>
                  </div>
                  2-Day Express Delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs">✓</span>
                  </div>
                  QR Code Memorial Page
                </li>
              </ul>
              <Link to="/design" className="block">
                <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                  Order Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Truck className="h-8 w-8 text-slate-400" />
                Add-Ons
              </h3>
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">Additional Set of 55 Cards</p>
                      <p className="text-slate-400 text-sm">Same design, more cards</p>
                    </div>
                    <span className="text-2xl font-bold text-white">$110</span>
                  </div>
                </div>
                <div className="border-b border-slate-700 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">Additional Easel Photos</p>
                      <p className="text-slate-400 text-sm">Large display photos</p>
                    </div>
                    <span className="text-2xl font-bold text-white">$27</span>
                  </div>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-rose-400" />
                    <p className="text-rose-400 font-semibold">Overnight Rush</p>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">
                    Need it tomorrow? Orders placed before 12pm qualify for overnight delivery.
                  </p>
                  <p className="text-rose-400 font-bold">+100% Rush Fee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart QR Integration</h3>
            <p className="text-slate-400">Each metal card features a unique QR code etched into the surface, linking to a personalized memorial page.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Living Memorial</h3>
            <p className="text-slate-400">Family and friends share memories through videos and written tributes that grow over time.</p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
            <p className="text-slate-400">2-day express delivery standard. Overnight rush available for orders placed before 12pm.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 py-20 mt-16 border-y border-amber-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create a Lasting Memorial?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Design your custom metal prayer card in minutes. No account required.
          </p>
          <Link to="/design">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg px-10">
              Start Designing
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Metal Prayer Cards. metalprayercards.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
