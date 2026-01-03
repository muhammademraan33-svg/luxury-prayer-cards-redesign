import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, MessageSquare, Building2, Shield, RotateCcw } from 'lucide-react';
import eternityLogo from '@/assets/eternity-cards-logo.png';

type MetalFinish = 'silver' | 'gold' | 'black' | 'rose-gold';

const METAL_FINISHES: { id: MetalFinish; name: string; gradient: string }[] = [
  { id: 'silver', name: 'Silver', gradient: 'from-slate-400 via-slate-300 to-slate-500' },
  { id: 'gold', name: 'Gold', gradient: 'from-amber-400 via-yellow-300 to-amber-500' },
  { id: 'black', name: 'Black', gradient: 'from-slate-800 via-slate-700 to-slate-900' },
  { id: 'rose-gold', name: 'Rose Gold', gradient: 'from-rose-300 via-rose-200 to-rose-400' },
];

const Index = () => {
  const [selectedFinish, setSelectedFinish] = useState<MetalFinish>('silver');
  const [showBack, setShowBack] = useState(false);

  const currentFinish = METAL_FINISHES.find(f => f.id === selectedFinish) || METAL_FINISHES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={eternityLogo} alt="Eternity Cards" className="h-12 w-auto" />
          </div>
          <Link to="/auth">
            <Button variant="outline" className="border-amber-600/50 text-amber-100 hover:bg-amber-600/20">
              Funeral Home Login
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
        <Link to="/auth">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-lg px-10 py-6 shadow-lg shadow-amber-500/25">
            Partner With Us
          </Button>
        </Link>
      </section>

      {/* Interactive Card Showcase */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">See Your Card Come to Life</h2>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Card Preview */}
            <div className="flex-1 flex justify-center">
              <div 
                className="relative w-72 aspect-[2/3] cursor-pointer group"
                onClick={() => setShowBack(!showBack)}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="relative w-full h-full transition-transform duration-700"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front - Photo */}
                  <div 
                    className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-br ${currentFinish.gradient}`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentFinish.gradient} p-1`}>
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face" 
                          alt="Memorial" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Subtle overlay hint */}
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-white/70 text-xs bg-black/30 px-3 py-1 rounded-full">Tap to flip</span>
                    </div>
                  </div>

                  {/* Back - Info, Prayer, QR */}
                  <div 
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${currentFinish.gradient} shadow-2xl p-5`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 rounded-2xl"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between text-center">
                      {/* Top - Name & Dates */}
                      <div>
                        <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${selectedFinish === 'black' ? 'text-slate-300' : 'text-slate-600'}`}>
                          In Loving Memory
                        </p>
                        <p className={`text-xl font-serif ${selectedFinish === 'black' ? 'text-white' : 'text-slate-800'}`}>
                          John David Smith
                        </p>
                        <p className={`text-sm mt-1 ${selectedFinish === 'black' ? 'text-slate-300' : 'text-slate-600'}`}>
                          March 15, 1945 – January 2, 2025
                        </p>
                      </div>

                      {/* Middle - Prayer */}
                      <div className="flex-1 flex items-center justify-center py-4">
                        <p className={`text-sm leading-relaxed font-serif italic ${selectedFinish === 'black' ? 'text-slate-200' : 'text-slate-700'}`}>
                          The Lord is my shepherd;<br />
                          I shall not want.<br />
                          He maketh me to lie down<br />
                          in green pastures;<br />
                          He leadeth me beside<br />
                          the still waters.
                        </p>
                      </div>

                      {/* Bottom - QR Code */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md mb-2">
                          <QrCode className="h-12 w-12 text-slate-800" />
                        </div>
                        <p className={`text-[9px] ${selectedFinish === 'black' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Scan to share memories
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <p className="text-slate-400 text-sm mb-3">Choose Metal Finish</p>
                <div className="flex gap-3 justify-center lg:justify-start">
                  {METAL_FINISHES.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish.id)}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${finish.gradient} transition-all ${
                        selectedFinish === finish.id 
                          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={finish.name}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowBack(!showBack)}
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Tap card or click to flip</span>
              </button>

              <div className="space-y-2">
                <p className="text-white font-medium">Premium Features</p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>✓ Waterproof & scratch-resistant</li>
                  <li>✓ Laser-etched QR code</li>
                  <li>✓ Standard: 2-day delivery</li>
                  <li>✓ Rush: Next-day available</li>
                </ul>
              </div>
            </div>
          </div>
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
