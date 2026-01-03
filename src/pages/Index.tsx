import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, QrCode, MessageSquare, Building2, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-xl font-semibold text-amber-100 tracking-wide">Eternity Cards</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="border-amber-600/50 text-amber-100 hover:bg-amber-600/20">
              Funeral Home Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
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
        <Link to="/auth">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-lg px-10 py-6 shadow-lg shadow-amber-500/25">
            Partner With Us
          </Button>
        </Link>
      </section>

      {/* Metal Card Visual */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-md mx-auto">
          <div className="aspect-[3.5/2] rounded-2xl bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <p className="text-slate-200 text-xs uppercase tracking-widest mb-1">In Loving Memory</p>
                <p className="text-white text-lg font-serif">John David Smith</p>
                <p className="text-slate-300 text-sm">1945 - 2025</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-slate-400 text-xs italic max-w-[60%]">"Forever in our hearts"</p>
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-slate-800" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">Brushed metal finish • Waterproof • Timeless</p>
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
              <Building2 className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Your Brand Featured</h3>
            <p className="text-slate-400">Your funeral home's name prominently displayed on every memorial page you create.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 py-20 mt-16 border-y border-amber-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Offer Something Truly Special</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join funeral homes across the country providing families with keepsakes that last generations.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg px-10">
              Become a Partner
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Eternity Cards. eternitycards.co</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
