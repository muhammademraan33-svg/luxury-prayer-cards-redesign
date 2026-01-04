import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Plus, QrCode, LogOut, Loader2, ExternalLink, Trash2, Truck, Zap, ArrowLeft, ArrowRight, Upload, ImageIcon, RotateCcw, RectangleHorizontal, RectangleVertical, Type, Book } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { prayerTemplates, getTraditionLabel } from '@/data/prayerTemplates';
import { toast } from 'sonner';

const FONT_OPTIONS = [
  { value: 'Playfair Display', name: 'Playfair Display' },
  { value: 'Cormorant Garamond', name: 'Cormorant Garamond' },
  { value: 'Great Vibes', name: 'Great Vibes' },
  { value: 'Dancing Script', name: 'Dancing Script' },
  { value: 'Allura', name: 'Allura' },
  { value: 'Sacramento', name: 'Sacramento' },
  { value: 'Montserrat', name: 'Montserrat' },
];

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

type MetalFinish = 'silver' | 'gold' | 'black' | 'white' | 'marble';
type Orientation = 'landscape' | 'portrait';
type CardSide = 'front' | 'back';

const METAL_FINISHES: { id: MetalFinish; name: string; gradient: string }[] = [
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-zinc-400 via-zinc-300 to-zinc-500' },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-yellow-600 via-yellow-500 to-yellow-700' },
  { id: 'black', name: 'Matte Black', gradient: 'from-zinc-800 via-zinc-700 to-zinc-900' },
  { id: 'white', name: 'Pearl White', gradient: 'from-gray-100 via-white to-gray-200' },
  { id: 'marble', name: 'Silver Marble', gradient: 'from-gray-300 via-slate-100 to-gray-400' },
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
  const [showEpitaph, setShowEpitaph] = useState(true);
  const [epitaphPosition, setEpitaphPosition] = useState({ x: 50, y: 50 });
  const [epitaphColor, setEpitaphColor] = useState('#ffffff');
  const [epitaphSize, setEpitaphSize] = useState(11);
  const [epitaphFont, setEpitaphFont] = useState('Great Vibes');
  const [qrUrl, setQrUrl] = useState('');
  const [showFuneralLogo, setShowFuneralLogo] = useState(true);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [frontBgImage, setFrontBgImage] = useState<string | null>(null);
  const [backBgImage, setBackBgImage] = useState<string | null>(null);
  const [deceasedPhoto, setDeceasedPhoto] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPanX, setPhotoPanX] = useState(0);
  const [photoPanY, setPhotoPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [backText, setBackText] = useState('The Lord is my shepherd; I shall not want.');
  const [prayerTextSize, setPrayerTextSize] = useState(12); // default prayer text size
  
  // Front card text state
  const [showNameOnFront, setShowNameOnFront] = useState(true);
  const [showDatesOnFront, setShowDatesOnFront] = useState(true);
  const [nameFont, setNameFont] = useState('Playfair Display');
  const [datesFont, setDatesFont] = useState('Cormorant Garamond');
  const [namePosition, setNamePosition] = useState({ x: 50, y: 85 }); // percentage
  const [datesPosition, setDatesPosition] = useState({ x: 50, y: 92 }); // percentage
  const [nameColor, setNameColor] = useState('#ffffff');
  const [datesColor, setDatesColor] = useState('#ffffffcc');
  const [nameSize, setNameSize] = useState(18); // pixels
  const [datesSize, setDatesSize] = useState(12); // pixels
  const [dateFormat, setDateFormat] = useState<'full' | 'short' | 'year'>('full'); // date format
  const [additionalText, setAdditionalText] = useState('');
  const [additionalTextPosition, setAdditionalTextPosition] = useState({ x: 50, y: 70 });
  const [additionalTextColor, setAdditionalTextColor] = useState('#ffffff');
  const [additionalTextSize, setAdditionalTextSize] = useState(10);
  const [additionalTextFont, setAdditionalTextFont] = useState('Cormorant Garamond');
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('custom');
  const [draggingText, setDraggingText] = useState<'name' | 'dates' | 'additional' | 'epitaph' | null>(null);
  const [resizingText, setResizingText] = useState<'name' | 'dates' | 'additional' | 'epitaph' | null>(null);
  const textDragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const textPinchStartRef = useRef<{ distance: number; size: number } | null>(null);
  const textPointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const pointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());

  // Text drag handlers
  const handleTextPointerDown = (e: React.PointerEvent, textType: 'name' | 'dates' | 'additional' | 'epitaph') => {
    e.stopPropagation();
    e.preventDefault();
    textPointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (textPointerCacheRef.current.size === 1) {
      setDraggingText(textType);
      const currentPos = textType === 'name' ? namePosition : textType === 'dates' ? datesPosition : textType === 'epitaph' ? epitaphPosition : additionalTextPosition;
      textDragStartRef.current = { x: e.clientX, y: e.clientY, posX: currentPos.x, posY: currentPos.y };
    } else if (textPointerCacheRef.current.size === 2) {
      setResizingText(textType);
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentSize = textType === 'name' ? nameSize : textType === 'dates' ? datesSize : textType === 'epitaph' ? epitaphSize : additionalTextSize;
      textPinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        size: currentSize,
      };
    }
  };

  const handleTextPointerMove = (e: React.PointerEvent) => {
    textPointerCacheRef.current.set(e.pointerId, e.nativeEvent);

    // Pinch to resize
    if (textPointerCacheRef.current.size === 2 && textPinchStartRef.current && resizingText) {
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / textPinchStartRef.current.distance;
      const newSize = Math.max(8, Math.min(48, textPinchStartRef.current.size * scaleChange));
      if (resizingText === 'name') {
        setNameSize(newSize);
      } else if (resizingText === 'dates') {
        setDatesSize(newSize);
      } else if (resizingText === 'epitaph') {
        setEpitaphSize(newSize);
      } else {
        setAdditionalTextSize(newSize);
      }
      return;
    }

    // Drag to move
    if (!draggingText || !textDragStartRef.current || !cardPreviewRef.current) return;
    
    const rect = cardPreviewRef.current.getBoundingClientRect();
    const dx = ((e.clientX - textDragStartRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - textDragStartRef.current.y) / rect.height) * 100;
    
    const newX = Math.max(10, Math.min(90, textDragStartRef.current.posX + dx));
    const newY = Math.max(5, Math.min(95, textDragStartRef.current.posY + dy));
    
    if (draggingText === 'name') {
      setNamePosition({ x: newX, y: newY });
    } else if (draggingText === 'dates') {
      setDatesPosition({ x: newX, y: newY });
    } else if (draggingText === 'epitaph') {
      setEpitaphPosition({ x: newX, y: newY });
    } else {
      setAdditionalTextPosition({ x: newX, y: newY });
    }
  };

  const handleTextPointerUp = (e: React.PointerEvent) => {
    textPointerCacheRef.current.delete(e.pointerId);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (textPointerCacheRef.current.size < 2) {
      textPinchStartRef.current = null;
      setResizingText(null);
    }
    if (textPointerCacheRef.current.size === 0) {
      setDraggingText(null);
      textDragStartRef.current = null;
    }
  };

  const handleTextWheel = (e: React.WheelEvent, textType: 'name' | 'dates' | 'additional' | 'epitaph') => {
    e.preventDefault();
    e.stopPropagation();
    const delta = -e.deltaY * 0.05;
    const currentSize = textType === 'name' ? nameSize : textType === 'dates' ? datesSize : textType === 'epitaph' ? epitaphSize : additionalTextSize;
    const newSize = Math.max(8, Math.min(48, currentSize + delta));
    if (textType === 'name') {
      setNameSize(newSize);
    } else if (textType === 'dates') {
      setDatesSize(newSize);
    } else if (textType === 'epitaph') {
      setEpitaphSize(newSize);
    } else {
      setAdditionalTextSize(newSize);
    }
  };

  const formatDates = (birth: string, death: string): string => {
    if (!birth || !death) {
      return dateFormat === 'year' ? '1945 – 2025' : dateFormat === 'short' ? '01/01/1945 – 12/31/2025' : 'January 1, 1945 – December 31, 2025';
    }
    const birthD = new Date(birth);
    const deathD = new Date(death);
    
    if (dateFormat === 'year') {
      return `${birthD.getFullYear()} – ${deathD.getFullYear()}`;
    } else if (dateFormat === 'short') {
      return `${birthD.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} – ${deathD.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`;
    } else {
      return `${birthD.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – ${deathD.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const handlePrayerSelect = (prayerId: string) => {
    setSelectedPrayerId(prayerId);
    if (prayerId === 'custom') {
      // Keep current backText for custom
    } else {
      const prayer = prayerTemplates.find(p => p.id === prayerId);
      if (prayer) {
        setBackText(prayer.text);
      }
    }
  };

  const getDistance = (p1: PointerEvent, p2: PointerEvent) => {
    return Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
  };

  const handlePhotoPointerDown = (e: React.PointerEvent) => {
    if (!deceasedPhoto) return;
    e.preventDefault();
    pointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (pointerCacheRef.current.size === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: photoPanX, panY: photoPanY };
    } else if (pointerCacheRef.current.size === 2) {
      const pointers = Array.from(pointerCacheRef.current.values());
      pinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        scale: photoZoom,
      };
    }
  };

  const handlePhotoPointerMove = (e: React.PointerEvent) => {
    if (!deceasedPhoto) return;
    pointerCacheRef.current.set(e.pointerId, e.nativeEvent);

    if (pointerCacheRef.current.size === 2 && pinchStartRef.current) {
      const pointers = Array.from(pointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / pinchStartRef.current.distance;
      const newScale = Math.max(1, Math.min(3, pinchStartRef.current.scale * scaleChange));
      setPhotoZoom(newScale);
    } else if (pointerCacheRef.current.size === 1 && panStartRef.current && isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      const maxPan = (photoZoom - 1) * 50;
      const newPanX = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panX + dx));
      const newPanY = Math.max(-maxPan, Math.min(maxPan, panStartRef.current.panY + dy));
      setPhotoPanX(newPanX);
      setPhotoPanY(newPanY);
    }
  };

  const handlePhotoPointerUp = (e: React.PointerEvent) => {
    pointerCacheRef.current.delete(e.pointerId);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (pointerCacheRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (pointerCacheRef.current.size === 0) {
      setIsPanning(false);
      panStartRef.current = null;
    }
  };

  const handlePhotoWheel = (e: React.WheelEvent) => {
    if (!deceasedPhoto) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    const newScale = Math.max(1, Math.min(3, photoZoom + delta));
    setPhotoZoom(newScale);
  };

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

  const handleImageUpload = async (file: File, type: 'front' | 'back' | 'photo') => {
    if (!file) return;

    const setUploading = type === 'front' ? setUploadingFront : type === 'back' ? setUploadingBack : setUploadingPhoto;
    const setImage = type === 'front' ? setFrontBgImage : type === 'back' ? setBackBgImage : setDeceasedPhoto;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('card-backgrounds')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('card-backgrounds')
        .getPublicUrl(fileName);

      setImage(publicUrl);
      if (type === 'photo') setPhotoZoom(1);

      const labels = { front: 'Front background', back: 'Back background', photo: 'Photo' };
      toast.success(`${labels[type]} uploaded!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
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
    setShowEpitaph(true);
    setEpitaphPosition({ x: 50, y: 50 });
    setEpitaphColor('#ffffff');
    setEpitaphSize(11);
    setEpitaphFont('Great Vibes');
    setQrUrl('');
    setShowFuneralLogo(true);
    setOrientation('portrait');
    setCardSide('front');
    setFrontBgImage(null);
    setBackBgImage(null);
    setDeceasedPhoto(null);
    setPhotoZoom(1);
    setPhotoPanX(0);
    setPhotoPanY(0);
    setBackText('The Lord is my shepherd; I shall not want.');
    setShowNameOnFront(true);
    setShowDatesOnFront(true);
    setNameFont('Playfair Display');
    setDatesFont('Cormorant Garamond');
    setNamePosition({ x: 50, y: 85 });
    setDatesPosition({ x: 50, y: 92 });
    setNameColor('#ffffff');
    setDatesColor('#ffffffcc');
    setNameSize(18);
    setDatesSize(12);
    setDateFormat('full');
    setAdditionalText('');
    setAdditionalTextPosition({ x: 50, y: 70 });
    setAdditionalTextColor('#ffffff');
    setAdditionalTextSize(10);
    setAdditionalTextFont('Cormorant Garamond');
    setShowAdditionalText(false);
    setSelectedPrayerId('custom');
    setPrayerTextSize(12);
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
  const currentBgImage = cardSide === 'front' ? frontBgImage : backBgImage;

  // Card dimensions based on orientation
  const cardClass = orientation === 'landscape' 
    ? 'aspect-[3.5/2] w-80' 
    : 'aspect-[2/3.5] w-56';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-semibold text-foreground">Eternity Cards</span>
              {funeralHome && (
                <p className="text-sm text-muted-foreground">{funeralHome.name}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground hover:bg-secondary">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prayer Card Orders</h1>
            <p className="text-muted-foreground">Create and manage memorial prayer cards</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                New Prayer Card
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl bg-card border-border text-foreground max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {step === 1 && 'Design Your Metal Prayer Card'}
                  {step === 2 && 'Memorial Details'}
                  {step === 3 && 'Shipping & Review'}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Step {step} of 3
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateOrder} className="mt-4">
                {/* Step 1: Card Design */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Orientation Toggle */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant={orientation === 'landscape' ? 'default' : 'outline'}
                        onClick={() => setOrientation('landscape')}
                        className={orientation === 'landscape' 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                      >
                        <RectangleHorizontal className="h-4 w-4 mr-2" />
                        Landscape
                      </Button>
                      <Button
                        type="button"
                        variant={orientation === 'portrait' ? 'default' : 'outline'}
                        onClick={() => setOrientation('portrait')}
                        className={orientation === 'portrait' 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                      >
                        <RectangleVertical className="h-4 w-4 mr-2" />
                        Portrait
                      </Button>
                    </div>

                    {/* Front/Back Tabs */}
                    <Tabs value={cardSide} onValueChange={(v) => setCardSide(v as CardSide)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-secondary">
                        <TabsTrigger value="front" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Front (Photo)
                        </TabsTrigger>
                        <TabsTrigger value="back" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Back (Info + QR)
                        </TabsTrigger>
                      </TabsList>

                      {/* Front Card - Photo Only */}
                      <TabsContent value="front" className="mt-4">
                        <div className="flex flex-col items-center gap-4">
                          {/* Card Preview - Full Photo with gesture controls and text overlay */}
                          <div 
                            ref={cardPreviewRef}
                            className={`${cardClass} rounded-2xl overflow-hidden shadow-2xl relative`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${currentFinish.gradient} p-1`}>
                              <div 
                                ref={photoContainerRef}
                                className="w-full h-full rounded-xl overflow-hidden bg-muted flex items-center justify-center touch-none relative"
                                style={{ cursor: deceasedPhoto && !draggingText ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                                onPointerDown={handlePhotoPointerDown}
                                onPointerMove={handlePhotoPointerMove}
                                onPointerUp={handlePhotoPointerUp}
                                onPointerCancel={handlePhotoPointerUp}
                                onWheel={handlePhotoWheel}
                              >
                                {deceasedPhoto ? (
                                  <img
                                    src={deceasedPhoto}
                                    alt="Deceased"
                                    draggable={false}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    style={{ 
                                      transform: `scale(${photoZoom}) translate(${photoPanX / photoZoom}px, ${photoPanY / photoZoom}px)`,
                                      transformOrigin: 'center',
                                    }}
                                  />
                                ) : (
                                  <div className="text-center p-4">
                                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">Upload photo</p>
                                  </div>
                                )}
                                
                                {/* Text Overlay - Name */}
                                {showNameOnFront && (
                                  <div
                                    className="absolute touch-none select-none px-2 py-1 rounded transition-shadow"
                                    style={{
                                      left: `${namePosition.x}%`,
                                      top: `${namePosition.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: nameFont,
                                      cursor: draggingText === 'name' || resizingText === 'name' ? 'grabbing' : 'grab',
                                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                      boxShadow: (draggingText === 'name' || resizingText === 'name') ? '0 0 0 2px hsl(var(--primary))' : 'none',
                                      whiteSpace: 'nowrap',
                                    }}
                                    onPointerDown={(e) => handleTextPointerDown(e, 'name')}
                                    onPointerMove={handleTextPointerMove}
                                    onPointerUp={handleTextPointerUp}
                                    onPointerCancel={handleTextPointerUp}
                                    onWheel={(e) => handleTextWheel(e, 'name')}
                                  >
                                    <span className="font-medium" style={{ fontSize: `${nameSize}px`, color: nameColor }}>
                                      {deceasedName || 'Name Here'}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Text Overlay - Dates */}
                                {showDatesOnFront && (
                                  <div
                                    className="absolute touch-none select-none px-2 py-1 rounded transition-shadow"
                                    style={{
                                      left: `${datesPosition.x}%`,
                                      top: `${datesPosition.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: datesFont,
                                      cursor: draggingText === 'dates' || resizingText === 'dates' ? 'grabbing' : 'grab',
                                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                      boxShadow: (draggingText === 'dates' || resizingText === 'dates') ? '0 0 0 2px hsl(var(--primary))' : 'none',
                                      whiteSpace: 'nowrap',
                                    }}
                                    onPointerDown={(e) => handleTextPointerDown(e, 'dates')}
                                    onPointerMove={handleTextPointerMove}
                                    onPointerUp={handleTextPointerUp}
                                    onPointerCancel={handleTextPointerUp}
                                    onWheel={(e) => handleTextWheel(e, 'dates')}
                                  >
                                    <span style={{ fontSize: `${datesSize}px`, color: datesColor }}>
                                      {formatDates(birthDate, deathDate)}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Text Overlay - Additional Text */}
                                {showAdditionalText && (
                                  <div
                                    className="absolute touch-none select-none px-2 py-1 rounded transition-shadow"
                                    style={{
                                      left: `${additionalTextPosition.x}%`,
                                      top: `${additionalTextPosition.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: additionalTextFont,
                                      cursor: draggingText === 'additional' || resizingText === 'additional' ? 'grabbing' : 'grab',
                                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                      boxShadow: (draggingText === 'additional' || resizingText === 'additional') ? '0 0 0 2px hsl(var(--primary))' : 'none',
                                      maxWidth: '80%',
                                    }}
                                    onPointerDown={(e) => handleTextPointerDown(e, 'additional')}
                                    onPointerMove={handleTextPointerMove}
                                    onPointerUp={handleTextPointerUp}
                                    onPointerCancel={handleTextPointerUp}
                                    onWheel={(e) => handleTextWheel(e, 'additional')}
                                  >
                                    <span style={{ fontSize: `${additionalTextSize}px`, color: additionalTextColor, whiteSpace: 'pre-wrap', textAlign: 'center', display: 'block' }}>
                                      {additionalText || 'Your text here'}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Text Overlay - Epitaph */}
                                {showEpitaph && (
                                  <div
                                    className="absolute touch-none select-none px-2 py-1 rounded transition-shadow"
                                    style={{
                                      left: `${epitaphPosition.x}%`,
                                      top: `${epitaphPosition.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: epitaphFont,
                                      cursor: draggingText === 'epitaph' || resizingText === 'epitaph' ? 'grabbing' : 'grab',
                                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                      boxShadow: (draggingText === 'epitaph' || resizingText === 'epitaph') ? '0 0 0 2px hsl(var(--primary))' : 'none',
                                      maxWidth: '80%',
                                    }}
                                    onPointerDown={(e) => handleTextPointerDown(e, 'epitaph')}
                                    onPointerMove={handleTextPointerMove}
                                    onPointerUp={handleTextPointerUp}
                                    onPointerCancel={handleTextPointerUp}
                                    onWheel={(e) => handleTextWheel(e, 'epitaph')}
                                  >
                                    <span className="italic" style={{ fontSize: `${epitaphSize}px`, color: epitaphColor, whiteSpace: 'pre-wrap', textAlign: 'center', display: 'block' }}>
                                      {epitaph || 'Forever in our hearts'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Photo Upload */}
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'photo')}
                          />
                          <div className="flex gap-2 flex-wrap justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => photoInputRef.current?.click()}
                              disabled={uploadingPhoto}
                              className="border-primary/50 text-foreground hover:bg-accent"
                            >
                              {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                              {deceasedPhoto ? 'Change Photo' : 'Upload Photo'}
                            </Button>
                            {deceasedPhoto && (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setPhotoZoom(1);
                                    setPhotoPanX(0);
                                    setPhotoPanY(0);
                                  }}
                                  className="border-border text-foreground hover:bg-accent"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Reset
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setDeceasedPhoto(null);
                                    setPhotoZoom(1);
                                    setPhotoPanX(0);
                                    setPhotoPanY(0);
                                  }}
                                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>

                          {deceasedPhoto && (
                            <p className="text-muted-foreground text-xs text-center bg-accent/50 px-3 py-2 rounded-lg">
                              📱 Drag to move • Pinch/scroll on text to resize
                            </p>
                          )}

                          {/* Text Controls */}
                          <div className="w-full space-y-4 border-t border-border pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Type className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-muted-foreground font-medium">Front Card Text</Label>
                            </div>
                            
                            {/* Name Controls */}
                            <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                              <Label className="text-foreground text-sm font-medium">Name</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                  placeholder="John David Smith"
                                  value={deceasedName}
                                  onChange={(e) => setDeceasedName(e.target.value)}
                                  className="bg-secondary border-border text-foreground"
                                />
                                <Select value={nameFont} onValueChange={setNameFont}>
                                  <SelectTrigger className="bg-secondary border-border text-foreground">
                                    <SelectValue placeholder="Font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {FONT_OPTIONS.map((font) => (
                                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Label className="text-muted-foreground text-xs">Color</Label>
                                  <input
                                    type="color"
                                    value={nameColor}
                                    onChange={(e) => setNameColor(e.target.value)}
                                    className="w-8 h-8 rounded border border-border cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label className="text-muted-foreground text-xs">Size</Label>
                                  <span className="text-xs text-foreground bg-secondary px-2 py-1 rounded">{Math.round(nameSize)}px</span>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                  <input 
                                    type="checkbox" 
                                    checked={showNameOnFront} 
                                    onChange={(e) => setShowNameOnFront(e.target.checked)}
                                    className="accent-primary"
                                  />
                                  <span className="text-muted-foreground text-xs">Show</span>
                                </label>
                              </div>
                            </div>

                            {/* Dates Controls */}
                            <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                              <Label className="text-foreground text-sm font-medium">Dates</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <Input
                                  type="date"
                                  value={birthDate}
                                  onChange={(e) => setBirthDate(e.target.value)}
                                  className="bg-secondary border-border text-foreground"
                                />
                                <Input
                                  type="date"
                                  value={deathDate}
                                  onChange={(e) => setDeathDate(e.target.value)}
                                  className="bg-secondary border-border text-foreground"
                                />
                                <Select value={dateFormat} onValueChange={(v) => setDateFormat(v as 'full' | 'short' | 'year')}>
                                  <SelectTrigger className="bg-secondary border-border text-foreground">
                                    <SelectValue placeholder="Format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full">Jan 1, 2025</SelectItem>
                                    <SelectItem value="short">01/01/2025</SelectItem>
                                    <SelectItem value="year">Years Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select value={datesFont} onValueChange={setDatesFont}>
                                  <SelectTrigger className="bg-secondary border-border text-foreground">
                                    <SelectValue placeholder="Font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {FONT_OPTIONS.map((font) => (
                                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Label className="text-muted-foreground text-xs">Color</Label>
                                  <input
                                    type="color"
                                    value={datesColor.replace('cc', '')}
                                    onChange={(e) => setDatesColor(e.target.value)}
                                    className="w-8 h-8 rounded border border-border cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label className="text-muted-foreground text-xs">Size</Label>
                                  <span className="text-xs text-foreground bg-secondary px-2 py-1 rounded">{Math.round(datesSize)}px</span>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                  <input 
                                    type="checkbox" 
                                    checked={showDatesOnFront} 
                                    onChange={(e) => setShowDatesOnFront(e.target.checked)}
                                    className="accent-primary"
                                  />
                                  <span className="text-muted-foreground text-xs">Show</span>
                                </label>
                              </div>
                            </div>
                            
                            {/* Additional Text Controls */}
                            <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                              <div className="flex items-center justify-between">
                                <Label className="text-foreground text-sm font-medium">Additional Text</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={showAdditionalText} 
                                    onChange={(e) => setShowAdditionalText(e.target.checked)}
                                    className="accent-primary"
                                  />
                                  <span className="text-muted-foreground text-xs">Show</span>
                                </label>
                              </div>
                              {showAdditionalText && (
                                <>
                                  <Textarea
                                    placeholder="Forever in our hearts..."
                                    value={additionalText}
                                    onChange={(e) => setAdditionalText(e.target.value)}
                                    className="bg-secondary border-border text-foreground min-h-[60px]"
                                    rows={2}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Select value={additionalTextFont} onValueChange={setAdditionalTextFont}>
                                      <SelectTrigger className="bg-secondary border-border text-foreground">
                                        <SelectValue placeholder="Font" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {FONT_OPTIONS.map((font) => (
                                          <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                            {font.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2">
                                      <Label className="text-muted-foreground text-xs">Color</Label>
                                      <input
                                        type="color"
                                        value={additionalTextColor}
                                        onChange={(e) => setAdditionalTextColor(e.target.value)}
                                        className="w-8 h-8 rounded border border-border cursor-pointer"
                                      />
                                      <span className="text-xs text-foreground bg-secondary px-2 py-1 rounded">{Math.round(additionalTextSize)}px</span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground text-xs text-center">The photo fills the entire front of the card with a metal border frame</p>
                        </div>
                      </TabsContent>

                      {/* Back Card - Info + Prayer + QR */}
                      <TabsContent value="back" className="mt-4">
                        <div className="flex flex-col items-center gap-4">
                          {/* Card Preview */}
                          <div 
                            className={`${cardClass} rounded-2xl shadow-2xl relative overflow-hidden`}
                          >
                            {/* Metal frame border */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${currentFinish.gradient} p-1 rounded-2xl`}>
                              <div 
                                className="w-full h-full rounded-xl overflow-hidden p-3"
                                style={backBgImage ? { 
                                  backgroundImage: `url(${backBgImage})`, 
                                  backgroundSize: 'cover', 
                                  backgroundPosition: 'center' 
                                } : {
                                  background: `
                                    linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.98) 100%)
                                  `
                                }}
                              >
                                {backBgImage && (
                                  <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
                                )}
                                <div className="relative z-10 h-full flex flex-col justify-between text-center">
                                  {/* Top - Funeral Home Logo */}
                                  {showFuneralLogo && funeralHome?.logo_url && (
                                    <div className="absolute top-1 left-1">
                                      <img 
                                        src={funeralHome.logo_url} 
                                        alt={funeralHome.name}
                                        className="h-5 w-auto object-contain opacity-70"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Top - Name & Dates */}
                                  <div>
                                    <p className={`text-[8px] uppercase tracking-[0.12em] mb-0.5 ${backBgImage ? 'text-zinc-300' : 'text-muted-foreground'}`}>
                                      In Loving Memory
                                    </p>
                                    <p className={`${orientation === 'portrait' ? 'text-base' : 'text-sm'} font-serif ${backBgImage ? 'text-white' : 'text-foreground'}`}>
                                      {deceasedName || 'Name Here'}
                                    </p>
                                    <p className={`text-[10px] ${backBgImage ? 'text-zinc-300' : 'text-muted-foreground'}`}>
                                      {formatDates(birthDate, deathDate)}
                                    </p>
                                  </div>

                                  {/* Middle - Prayer */}
                                  <div className="flex-1 flex items-center justify-center py-1 px-1 overflow-hidden">
                                    <p 
                                      className={`leading-relaxed font-serif italic ${backBgImage ? 'text-zinc-200' : 'text-muted-foreground'} whitespace-pre-line text-center`}
                                      style={{ fontSize: `${prayerTextSize}px` }}
                                    >
                                      {backText}
                                    </p>
                                  </div>

                                  {/* Bottom - QR Code */}
                                  <div className="flex flex-col items-center">
                                    <div className={`${orientation === 'portrait' ? 'w-10 h-10' : 'w-7 h-7'} bg-white rounded-lg flex items-center justify-center shadow-md`}>
                                      <QrCode className={`${orientation === 'portrait' ? 'h-7 w-7' : 'h-4 w-4'} text-foreground`} />
                                    </div>
                                    <p className={`text-[6px] mt-0.5 ${backBgImage ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                                      {qrUrl ? 'Visit memorial page' : 'Scan to share memories'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Upload Back Background */}
                          <input
                            ref={backInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'back')}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => backInputRef.current?.click()}
                              disabled={uploadingBack}
                              className="border-primary/50 text-foreground hover:bg-accent"
                            >
                              {uploadingBack ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                              {backBgImage ? 'Change Background' : 'Upload Background'}
                            </Button>
                            {backBgImage && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setBackBgImage(null)}
                                className="border-primary/50 text-foreground hover:bg-accent"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Use Metal
                              </Button>
                            )}
                          </div>

                          {/* Prayer Selection */}
                          <div className="w-full max-w-md space-y-3">
                            <div className="flex items-center gap-2">
                              <Book className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-muted-foreground">Quick Select Prayer</Label>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: 'psalm-23', label: 'Psalm 23' },
                                { id: 'serenity-prayer', label: 'Serenity Prayer' },
                                { id: 'lords-prayer', label: "Lord's Prayer" },
                                { id: 'irish-blessing', label: 'Irish Blessing' },
                                { id: 'remember-me', label: 'Remember Me' },
                              ].map((prayer) => (
                                <Button
                                  key={prayer.id}
                                  type="button"
                                  variant={selectedPrayerId === prayer.id ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handlePrayerSelect(prayer.id)}
                                  className={selectedPrayerId === prayer.id 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'border-border text-foreground hover:bg-accent'}
                                >
                                  {prayer.label}
                                </Button>
                              ))}
                              <Button
                                type="button"
                                variant={selectedPrayerId === 'custom' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedPrayerId('custom')}
                                className={selectedPrayerId === 'custom' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'border-border text-foreground hover:bg-accent'}
                              >
                                ✏️ Custom
                              </Button>
                            </div>
                            
                            <Textarea
                              id="back-text"
                              placeholder="The Lord is my shepherd..."
                              value={backText}
                              onChange={(e) => {
                                setBackText(e.target.value);
                                setSelectedPrayerId('custom');
                              }}
                              className="bg-secondary border-border text-foreground min-h-[80px]"
                              rows={3}
                            />
                            
                            {/* Prayer Text Size Control */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <Label className="text-muted-foreground text-xs">Text Size:</Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="8"
                                  max="16"
                                  value={prayerTextSize}
                                  onChange={(e) => setPrayerTextSize(parseInt(e.target.value))}
                                  className="w-24 accent-primary"
                                />
                                <span className="text-xs text-foreground bg-secondary px-2 py-1 rounded">{prayerTextSize}px</span>
                              </div>
                              <div className="flex gap-1 ml-auto">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrayerTextSize(10)}
                                  className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 10 ? 'bg-primary text-primary-foreground' : ''}`}
                                >
                                  Small
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrayerTextSize(12)}
                                  className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 12 ? 'bg-primary text-primary-foreground' : ''}`}
                                >
                                  Medium
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrayerTextSize(14)}
                                  className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 14 ? 'bg-primary text-primary-foreground' : ''}`}
                                >
                                  Large
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* QR Code URL */}
                          <div className="w-full max-w-md space-y-2">
                            <Label className="text-muted-foreground">QR Code Link (funeral home URL)</Label>
                            <Input
                              placeholder="https://yourfuneralhome.com"
                              value={qrUrl}
                              onChange={(e) => setQrUrl(e.target.value)}
                              className="bg-secondary border-border text-foreground"
                            />
                            <p className="text-xs text-muted-foreground">Leave empty to use default memorial page</p>
                          </div>
                          
                          {/* Funeral Home Logo Toggle */}
                          {funeralHome?.logo_url && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showFuneralLogo} 
                                onChange={(e) => setShowFuneralLogo(e.target.checked)}
                                className="accent-primary"
                              />
                              <span className="text-muted-foreground text-sm">Show funeral home logo on back</span>
                            </label>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Metal Finish Selection */}
                    <div>
                      <Label className="text-muted-foreground mb-3 block">Metal Finish (visible where no background image)</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {METAL_FINISHES.map((finish) => (
                          <button
                            key={finish.id}
                            type="button"
                            onClick={() => setMetalFinish(finish.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              metalFinish === finish.id 
                                ? 'border-primary ring-2 ring-primary/30' 
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          >
                            <div className={`h-8 rounded bg-gradient-to-br ${finish.gradient} mb-2`}></div>
                            <p className="text-xs text-muted-foreground">{finish.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Epitaph Controls */}
                    <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground text-sm font-medium">Front Quote/Epitaph</Label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showEpitaph} 
                            onChange={(e) => setShowEpitaph(e.target.checked)}
                            className="accent-primary"
                          />
                          <span className="text-muted-foreground text-xs">Show</span>
                        </label>
                      </div>
                      {showEpitaph && (
                        <>
                          <Input
                            id="epitaph"
                            placeholder="Forever in our hearts"
                            value={epitaph}
                            onChange={(e) => setEpitaph(e.target.value)}
                            className="bg-secondary border-border text-foreground"
                            maxLength={50}
                          />
                          <div className="flex items-center gap-3 flex-wrap">
                            <Select value={epitaphFont} onValueChange={setEpitaphFont}>
                              <SelectTrigger className="bg-secondary border-border text-foreground w-40">
                                <SelectValue placeholder="Font" />
                              </SelectTrigger>
                              <SelectContent>
                                {FONT_OPTIONS.map((font) => (
                                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                    {font.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2">
                              <Label className="text-muted-foreground text-xs">Color</Label>
                              <input
                                type="color"
                                value={epitaphColor}
                                onChange={(e) => setEpitaphColor(e.target.value)}
                                className="w-8 h-8 rounded border border-border cursor-pointer"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-muted-foreground text-xs">Size</Label>
                              <span className="text-xs text-foreground bg-secondary px-2 py-1 rounded">{Math.round(epitaphSize)}px</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <Button type="button" onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Order Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    {/* Summary of design */}
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h4 className="text-foreground font-medium mb-2">Memorial Details</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium text-foreground">Name:</span> {deceasedName || 'Not specified'}</p>
                        <p><span className="font-medium text-foreground">Dates:</span> {birthDate && deathDate 
                          ? formatDates(birthDate, deathDate)
                          : 'Not specified'}</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quantity" className="text-muted-foreground">Quantity of Cards</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="25"
                        step="25"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="bg-secondary border-border text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum 25 cards, increments of 25</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-border text-foreground hover:bg-accent">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {
                          if (!deceasedName.trim()) {
                            toast.error('Please enter the name in the card design');
                            setStep(1);
                            return;
                          }
                          setStep(3);
                        }} 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                      <Label className="text-muted-foreground mb-3 block">Shipping Speed</Label>
                      <RadioGroup value={shipping} onValueChange={(v) => setShipping(v as 'standard' | 'express')}>
                        <div className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          shipping === 'standard' ? 'border-primary bg-accent/50' : 'border-border hover:border-muted-foreground'
                        }`} onClick={() => setShipping('standard')}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="standard" id="standard" className="border-muted-foreground" />
                            <div>
                              <Label htmlFor="standard" className="text-foreground font-medium cursor-pointer flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Standard Delivery
                              </Label>
                              <p className="text-sm text-muted-foreground">2 business days</p>
                            </div>
                          </div>
                          <p className="text-primary font-semibold">${(parseInt(quantity) || 0) * BASE_PRICE_PER_CARD}</p>
                        </div>
                        <div className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all mt-3 ${
                          shipping === 'express' ? 'border-primary bg-accent/50' : 'border-border hover:border-muted-foreground'
                        }`} onClick={() => setShipping('express')}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="express" id="express" className="border-muted-foreground" />
                            <div>
                              <Label htmlFor="express" className="text-foreground font-medium cursor-pointer flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" /> Next Day Express
                              </Label>
                              <p className="text-sm text-muted-foreground">Delivered tomorrow • 100% rush fee</p>
                            </div>
                          </div>
                          <p className="text-primary font-semibold">${(parseInt(quantity) || 0) * BASE_PRICE_PER_CARD * 2}</p>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <h4 className="text-foreground font-medium mb-3">Order Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{currentFinish.name} Metal Cards ({orientation})</span>
                        <span className="text-foreground">×{quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">For: {deceasedName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">{shipping === 'express' ? 'Next Day' : '2 Days'}</span>
                      </div>
                      <div className="border-t border-border my-2"></div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary text-lg">${calculatePrice()}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 border-border text-foreground hover:bg-accent">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={creating}>
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
          <Card className="text-center py-12 bg-card border-border">
            <CardContent>
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Create your first prayer card order to get started.</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{order.deceased_name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
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
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        {order.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        className="border-border text-foreground hover:bg-accent"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getMemorialUrl(order.qr_code), '_blank')}
                        className="border-border text-foreground hover:bg-accent"
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