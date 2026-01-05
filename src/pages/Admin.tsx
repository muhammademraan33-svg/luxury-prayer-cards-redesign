import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Package, Truck, LogOut, Send, CheckCircle, Clock, Search } from 'lucide-react';
import { User, Session } from '@supabase/supabase-js';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  package_name: string;
  total_cards: number;
  total_photos: number;
  total_price: number;
  shipping_type: string;
  tracking_number: string | null;
  tracking_carrier: string | null;
  tracking_sent_at: string | null;
  status: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('usps');
  const [sendingTracking, setSendingTracking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Auth email/password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check admin status after a small delay to prevent deadlock
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
        if (data) {
          fetchOrders();
        }
      }
    } catch (err) {
      console.error('Admin check error:', err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;
      toast.success('Account created! You can now login.');
      setIsSignup(false);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    toast.success('Logged out');
  };

  const handleSendTracking = async () => {
    if (!selectedOrder || !trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setSendingTracking(true);

    try {
      // Update order with tracking info
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber,
          tracking_carrier: trackingCarrier,
          status: 'shipped',
        })
        .eq('id', selectedOrder.id);

      if (updateError) throw updateError;

      // Send tracking email
      const { error: emailError } = await supabase.functions.invoke('send-tracking-email', {
        body: {
          orderId: selectedOrder.id,
          trackingNumber,
          trackingCarrier,
        },
      });

      if (emailError) throw emailError;

      toast.success('Tracking email sent to customer!');
      setSelectedOrder(null);
      setTrackingNumber('');
      fetchOrders();
    } catch (error: any) {
      console.error('Error sending tracking:', error);
      toast.error(error.message || 'Failed to send tracking');
    } finally {
      setSendingTracking(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shipping_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Login/Signup form
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {isSignup ? 'Create Admin Account' : 'Admin Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={authLoading}
              >
                {authLoading ? (isSignup ? 'Creating account...' : 'Logging in...') : (isSignup ? 'Create Account' : 'Login')}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-amber-500 hover:text-amber-400 text-sm"
              >
                {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-300 mb-4">You don't have admin access.</p>
            <Button onClick={handleLogout} variant="outline" className="border-slate-600 text-slate-300">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-bold text-white">Order Management</h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-slate-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Shipped</p>
                  <p className="text-2xl font-bold text-green-500">
                    {orders.filter(o => o.status === 'shipped').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-amber-500">
                    ${orders.reduce((sum, o) => sum + Number(o.total_price), 0).toLocaleString()}
                  </p>
                </div>
                <span className="text-2xl">💰</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Orders Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">Date</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Customer</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Location</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Package</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Total</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                      <td className="p-4 text-slate-300">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{order.customer_name}</div>
                        <div className="text-slate-400 text-sm">{order.customer_email}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {order.shipping_city}, {order.shipping_state}
                      </td>
                      <td className="p-4 text-slate-300">
                        {order.package_name}
                        <div className="text-slate-500 text-sm">
                          {order.total_cards} cards, {order.total_photos} photos
                        </div>
                      </td>
                      <td className="p-4 text-amber-500 font-medium">${order.total_price}</td>
                      <td className="p-4">
                        {order.status === 'shipped' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                            <CheckCircle className="h-3 w-3" />
                            Shipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {order.status !== 'shipped' ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingNumber(order.tracking_number || '');
                              setTrackingCarrier(order.tracking_carrier || 'usps');
                            }}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Add Tracking
                          </Button>
                        ) : (
                          <span className="text-slate-500 text-sm">{order.tracking_number}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Add Tracking for {selectedOrder.customer_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Carrier</Label>
                <Select value={trackingCarrier} onValueChange={setTrackingCarrier}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Tracking Number</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSendTracking}
                  disabled={sendingTracking}
                >
                  {sendingTracking ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Tracking Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;
