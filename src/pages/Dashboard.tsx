import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Plus, QrCode, LogOut, Loader2, ExternalLink, Trash2 } from 'lucide-react';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [funeralHome, setFuneralHome] = useState<FuneralHome | null>(null);
  const [orders, setOrders] = useState<MemorialOrder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [deceasedName, setDeceasedName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [quantity, setQuantity] = useState('50');

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
    setDialogOpen(false);
    setDeceasedName('');
    setBirthDate('');
    setDeathDate('');
    setQuantity('50');
    fetchOrders();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <div>
              <span className="text-xl font-semibold text-slate-800">Eternity Cards</span>
              {funeralHome && (
                <p className="text-sm text-slate-500">{funeralHome.name}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Prayer Card Orders</h1>
            <p className="text-slate-600">Create and manage memorial prayer cards</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-2" />
                New Prayer Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Prayer Card Order</DialogTitle>
                <DialogDescription>
                  Enter the details for the memorial prayer cards. A unique QR code will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrder} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="deceased-name">Name of Deceased *</Label>
                  <Input
                    id="deceased-name"
                    placeholder="John Smith"
                    value={deceasedName}
                    onChange={(e) => setDeceasedName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birth-date">Birth Date</Label>
                    <Input
                      id="birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="death-date">Death Date</Label>
                    <Input
                      id="death-date"
                      type="date"
                      value={deathDate}
                      onChange={(e) => setDeathDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity of Cards</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Order
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <QrCode className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No orders yet</h3>
              <p className="text-slate-600 mb-4">Create your first prayer card order to get started.</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.deceased_name}</CardTitle>
                      <CardDescription>
                        {order.birth_date && order.death_date
                          ? `${order.birth_date} - ${order.death_date}`
                          : order.death_date
                          ? `Passed: ${order.death_date}`
                          : 'Dates not specified'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
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
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getMemorialUrl(order.qr_code), '_blank')}
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
