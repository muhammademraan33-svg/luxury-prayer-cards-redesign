import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const OrderCancelled = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-amber-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Cancelled
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Your order was not completed. No payment has been processed. Your cart items are still saved if you'd like to try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
            <Link to="/#pricing">
              <Button size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCancelled;
