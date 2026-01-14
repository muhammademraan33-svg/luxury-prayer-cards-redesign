import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Package, Mail } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Clear cart from localStorage
    localStorage.removeItem('prayerCardsCart');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've received your payment and will begin processing your prayer cards right away.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">Check your inbox for order details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Shipping Update</p>
                <p className="text-sm text-muted-foreground">You'll receive tracking info once shipped</p>
              </div>
            </div>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground mb-6">
              Order Reference: {sessionId.slice(-8).toUpperCase()}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                Return Home
              </Button>
            </Link>
            <Link to="/design">
              <Button size="lg">
                Design Another Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
