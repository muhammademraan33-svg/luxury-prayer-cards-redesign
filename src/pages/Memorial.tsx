import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageSquare, Video, Loader2, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Memorial {
  id: string;
  deceased_name: string;
  birth_date: string | null;
  death_date: string | null;
  photo_url: string | null;
  funeral_homes: {
    name: string;
    logo_url: string | null;
  };
}

interface Message {
  id: string;
  author_name: string;
  message: string | null;
  video_url: string | null;
  created_at: string;
}

const Memorial = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    fetchMemorial();
  }, [qrCode]);

  const fetchMemorial = async () => {
    if (!qrCode) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data: memorialData, error: memorialError } = await supabase
      .from('memorial_orders')
      .select(`
        id,
        deceased_name,
        birth_date,
        death_date,
        photo_url,
        funeral_homes (
          name,
          logo_url
        )
      `)
      .eq('qr_code', qrCode)
      .single();

    if (memorialError || !memorialData) {
      console.error('Memorial not found:', memorialError);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setMemorial(memorialData as unknown as Memorial);
    await fetchMessages(memorialData.id);
    setLoading(false);
  };

  const fetchMessages = async (memorialId: string) => {
    const { data, error } = await supabase
      .from('memorial_messages')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!messageText.trim() && !videoUrl.trim()) {
      toast.error('Please enter a message or video link');
      return;
    }
    if (!memorial) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('memorial_messages')
      .insert({
        memorial_id: memorial.id,
        author_name: authorName.trim(),
        message: messageText.trim() || null,
        video_url: videoUrl.trim() || null
      });

    setSubmitting(false);

    if (error) {
      console.error('Error submitting message:', error);
      toast.error('Failed to submit message');
      return;
    }

    toast.success('Your message has been shared');
    setDialogOpen(false);
    setAuthorName('');
    setMessageText('');
    setVideoUrl('');
    fetchMessages(memorial.id);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVideoEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Handle Vimeo URLs
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (notFound || !memorial) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Memorial Not Found</h1>
            <p className="text-slate-600">This memorial page does not exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Funeral Home Header */}
      <header className="bg-slate-800 text-white py-3 text-center">
        <p className="text-sm">Memorial provided by <span className="font-semibold">{memorial.funeral_homes.name}</span></p>
      </header>

      {/* Memorial Header */}
      <section className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-rose-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            In Loving Memory of<br />{memorial.deceased_name}
          </h1>
          
          {(memorial.birth_date || memorial.death_date) && (
            <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(memorial.birth_date)}
                {memorial.birth_date && memorial.death_date && ' — '}
                {formatDate(memorial.death_date)}
              </span>
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                <MessageSquare className="h-5 w-5 mr-2" />
                Share a Memory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share a Memory</DialogTitle>
                <DialogDescription>
                  Share your thoughts, memories, or a video tribute for {memorial.deceased_name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitMessage} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="author-name">Your Name *</Label>
                  <Input
                    id="author-name"
                    placeholder="Your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Share your favorite memory or words of comfort..."
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="video-url">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Link (optional)
                    </div>
                  </Label>
                  <Input
                    id="video-url"
                    placeholder="YouTube or Vimeo link"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Share Memory
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Messages */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          {messages.length > 0 ? 'Shared Memories' : 'Be the first to share a memory'}
        </h2>

        {messages.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-8">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No messages yet. Be the first to share a memory.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{msg.author_name}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {msg.message && (
                        <p className="text-slate-600 whitespace-pre-wrap">{msg.message}</p>
                      )}
                      {msg.video_url && (
                        <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <iframe
                            src={getVideoEmbedUrl(msg.video_url)}
                            className="w-full h-full"
                            allowFullScreen
                            title="Video tribute"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Memorial page provided by {memorial.funeral_homes.name}</p>
          <p className="mt-1">Powered by Metal Prayer Cards</p>
        </div>
      </footer>
    </div>
  );
};

export default Memorial;
