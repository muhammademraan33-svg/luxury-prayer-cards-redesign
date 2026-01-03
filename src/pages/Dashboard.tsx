import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Plus, QrCode, LogOut, Loader2, ExternalLink, Trash2, Truck, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface FuneralHome {
  id: string;
  name: string;
  logo_url: string | null;
}

interface MemorialOrder {
  id: string;
  deceased_name: string;
  birth_date: string | null;
  death_date: string | null;
  qr_code: string;
  quantity: number;
  status: string;
  created_at: string;
}

type MetalFinish = 'silver' | 'gold' | 'black' | 'rose-gold';

const METAL_FINISHES: { id: MetalFinish; name: string; gradient: string }[] = [
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-slate-400 via-slate-300 to-slate-500' },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-amber-400 via-yellow-300 to-amber-500' },
  { id: 'black', name: 'Matte Black', gradient: 'from-slate-800 via-slate-700 to-slate-900' },
  { id: 'rose-gold', name: 'Rose Gold', gradient: 'from-rose-300 via-rose-200 to-rose-400' },
];

const BASE_PRICE_PER_CARD = 8;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [funeralHome, setFuneralHome] = useState<FuneralHome | null>(null);
  const [orders, setOrders] = useState<MemorialOrder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form state
  const [deceasedName, setDeceasedName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [metalFinish, setMetalFinish] = useState<MetalFinish>('silver');
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [epitaph, setEpitaph] = useState('Forever in our hearts');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
      }
    });

    checkAuthAndFetch();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate('/auth');
      return;
    }
    
    await fetchFuneralHome();
    await fetchOrders();
    setLoading(false);
  };

  const fetchFuneralHome = async () => {
    const { data, error } = await supabase
      .from('funeral_homes')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching funeral home:', error);
      return;
    }
    setFuneralHome(data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('memorial_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    setOrders(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const generateQRCode = () => {
    return `memorial-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const calculatePrice = () => {
    const qty = parseInt(quantity) || 0;
    const baseTotal = qty * BASE_PRICE_PER_CARD;
    const shippingMultiplier = shipping === 'express' ? 2 : 1;
    return baseTotal * shippingMultiplier;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) {
      toast.error('Please enter the name of the deceased');
      return;
    }
    if (!funeralHome) {
      toast.error('Funeral home profile not found');
      return;
    }

    setCreating(true);
    const qrCode = generateQRCode();

    const { error } = await supabase
      .from('memorial_orders')
      .insert({
        funeral_home_id: funeralHome.id,
        deceased_name: deceasedName.trim(),
        birth_date: birthDate || null,
        death_date: deathDate || null,
        qr_code: qrCode,
        quantity: parseInt(quantity) || 50,
        status: 'pending'
      });

    setCreating(false);

    if (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return;
    }

    toast.success('Prayer card order created!');
    resetForm();
    fetchOrders();
  };

  const resetForm = () => {
    setDialogOpen(false);
    setStep(1);
    setDeceasedName('');
    setBirthDate('');
    setDeathDate('');
    setQuantity('50');
    setMetalFinish('silver');
    setShipping('standard');
    setEpitaph('Forever in our hearts');
  };

  const handleDeleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('memorial_orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to delete order');
      return;
    }

    toast.success('Order deleted');
    fetchOrders();
  };

  const getMemorialUrl = (qrCode: string) => {
    return `${window.location.origin}/memorial/${qrCode}`;
  };

  const currentFinish = METAL_FINISHES.find(f => f.id === metalFinish) || METAL_FINISHES[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <span className="text-xl font-semibold text-amber-100">Eternity Cards</span>
              {funeralHome && (
                <p className="text-sm text-slate-400">{funeralHome.name}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Prayer Card Orders</h1>
            <p className="text-slate-400">Create and manage memorial prayer cards</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                New Prayer Card
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-amber-100">
                  {step === 1 && 'Design Your Metal Prayer Card'}
                  {step === 2 && 'Memorial Details'}
                  {step === 3 && 'Shipping & Review'}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Step {step} of 3
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateOrder} className="mt-4">
                {/* Step 1: Card Design */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Metal Card Preview */}
                    <div className="flex justify-center">
                      <div className={`aspect-[3.5/2] w-80 rounded-2xl bg-gradient-to-br ${currentFinish.gradient} shadow-2xl p-5 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                            <p className={`text-xs uppercase tracking-widest mb-1 ${metalFinish === 'black' ? 'text-slate-300' : 'text-slate-700'}`}>In Loving Memory</p>
                            <p className={`text-lg font-serif ${metalFinish === 'black' ? 'text-white' : 'text-slate-800'}`}>
                              {deceasedName || 'Name Here'}
                            </p>
                            <p className={`text-sm ${metalFinish === 'black' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {birthDate && deathDate ? `${birthDate} – ${deathDate}` : '1945 – 2025'}
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p className={`text-xs italic max-w-[55%] ${metalFinish === 'black' ? 'text-slate-400' : 'text-slate-600'}`}>
                              "{epitaph}"
                            </p>
                            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
                              <QrCode className="h-10 w-10 text-slate-800" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metal Finish Selection */}
                    <div>
                      <Label className="text-slate-300 mb-3 block">Choose Metal Finish</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {METAL_FINISHES.map((finish) => (
                          <button
                            key={finish.id}
                            type="button"
                            onClick={() => setMetalFinish(finish.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              metalFinish === finish.id 
                                ? 'border-amber-500 ring-2 ring-amber-500/30' 
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                          >
                            <div className={`h-8 rounded bg-gradient-to-br ${finish.gradient} mb-2`}></div>
                            <p className="text-xs text-slate-300">{finish.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Epitaph */}
                    <div>
                      <Label htmlFor="epitaph" className="text-slate-300">Epitaph / Quote</Label>
                      <Input
                        id="epitaph"
                        placeholder="Forever in our hearts"
                        value={epitaph}
                        onChange={(e) => setEpitaph(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        maxLength={50}
                      />
                    </div>

                    <Button type="button" onClick={() => setStep(2)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Memorial Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deceased-name" className="text-slate-300">Name of Deceased *</Label>
                      <Input
                        id="deceased-name"
                        placeholder="John David Smith"
                        value={deceasedName}
                        onChange={(e) => setDeceasedName(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="birth-date" className="text-slate-300">Birth Date</Label>
                        <Input
                          id="birth-date"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="death-date" className="text-slate-300">Death Date</Label>
                        <Input
                          id="death-date"
                          type="date"
                          value={deathDate}
                          onChange={(e) => setDeathDate(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-slate-300">Quantity of Cards</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="25"
                        step="25"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-xs text-slate-500 mt-1">Minimum 25 cards, increments of 25</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {
                          if (!deceasedName.trim()) {
                            toast.error('Please enter the name of the deceased');
                            return;
                          }
                          setStep(3);
                        }} 
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
                      >
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Shipping & Review */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Shipping Options */}
                    <div>
                      <Label className="text-slate-300 mb-3 block">Shipping Speed</Label>
                      <RadioGroup value={shipping} onValueChange={(v) => setShipping(v as 'standard' | 'express')}>
                        <div className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          shipping === 'standard' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 hover:border-slate-500'
                        }`} onClick={() => setShipping('standard')}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="standard" id="standard" className="border-slate-500" />
                            <div>
                              <Label htmlFor="standard" className="text-white font-medium cursor-pointer flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Standard Delivery
                              </Label>
                              <p className="text-sm text-slate-400">2 business days</p>
                            </div>
                          </div>
                          <p className="text-amber-400 font-semibold">${(parseInt(quantity) || 0) * BASE_PRICE_PER_CARD}</p>
                        </div>
                        <div className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all mt-3 ${
                          shipping === 'express' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 hover:border-slate-500'
                        }`} onClick={() => setShipping('express')}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="express" id="express" className="border-slate-500" />
                            <div>
                              <Label htmlFor="express" className="text-white font-medium cursor-pointer flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-400" /> Next Day Express
                              </Label>
                              <p className="text-sm text-slate-400">Delivered tomorrow • 100% rush fee</p>
                            </div>
                          </div>
                          <p className="text-amber-400 font-semibold">${(parseInt(quantity) || 0) * BASE_PRICE_PER_CARD * 2}</p>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                      <h4 className="text-amber-100 font-medium mb-3">Order Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{currentFinish.name} Metal Cards</span>
                        <span className="text-white">×{quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">For: {deceasedName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Shipping</span>
                        <span className="text-white">{shipping === 'express' ? 'Next Day' : '2 Days'}</span>
                      </div>
                      <div className="border-t border-slate-600 my-2"></div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-amber-400 text-lg">${calculatePrice()}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold" disabled={creating}>
                        {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12 bg-slate-800 border-slate-700">
            <CardContent>
              <QrCode className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
              <p className="text-slate-400 mb-4">Create your first prayer card order to get started.</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900">
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{order.deceased_name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {order.birth_date && order.death_date
                          ? `${order.birth_date} – ${order.death_date}`
                          : order.death_date
                          ? `Passed: ${order.death_date}`
                          : 'Dates not specified'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-amber-900/50 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Qty: {order.quantity} cards</span>
                      <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(getMemorialUrl(order.qr_code));
                          toast.success('Memorial link copied!');
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getMemorialUrl(order.qr_code), '_blank')}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Memorial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
