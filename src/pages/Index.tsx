import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, QrCode, MessageSquare, Building2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <span className="text-xl font-semibold text-slate-800">Eternity Cards</span>
          </div>
          <Link to="/auth">
            <Button variant="outline">Funeral Home Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
          Prayer Cards That Connect<br />Memories Forever
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Create beautiful prayer cards with QR codes that link to interactive memorial pages 
          where loved ones can share videos and heartfelt messages.
        </p>
        <Link to="/auth">
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-6">
            Get Started - For Funeral Homes
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">QR Code Integration</h3>
            <p className="text-slate-600">Each prayer card includes a unique QR code linking to a personalized memorial page.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Video & Text Messages</h3>
            <p className="text-slate-600">Family and friends can share memories through videos and written tributes.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Brand Featured</h3>
            <p className="text-slate-600">Your funeral home's name and logo prominently displayed on every memorial page.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Serve Your Families Better?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join funeral homes across the country offering this meaningful service to grieving families.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Eternity Cards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
