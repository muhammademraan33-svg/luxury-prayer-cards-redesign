import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  cardType: string;
  designData?: any;
}

interface CheckoutRequest {
  items: CartItem[];
  customerEmail?: string;
  shippingInfo?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  designData?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { items, customerEmail, shippingInfo, designData }: CheckoutRequest = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCards = items.reduce((sum, item) => sum + item.quantity, 0);

    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.cardType === 'metal' ? 'Premium Metal' : 'Glossy Paper'} Prayer Cards`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard Shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create metadata for the order
    const metadata: Record<string, string> = {
      totalCards: totalCards.toString(),
      itemsJson: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
    };

    if (shippingInfo) {
      metadata.shippingName = shippingInfo.name;
      metadata.shippingAddress = shippingInfo.address;
      metadata.shippingCity = shippingInfo.city;
      metadata.shippingState = shippingInfo.state;
      metadata.shippingZip = shippingInfo.zip;
      if (shippingInfo.phone) metadata.shippingPhone = shippingInfo.phone;
    }

    if (designData) {
      // Store design URLs if they exist
      if (designData.frontDesignUrl) metadata.frontDesignUrl = designData.frontDesignUrl;
      if (designData.backDesignUrl) metadata.backDesignUrl = designData.backDesignUrl;
    }

    const origin = req.headers.get("origin") || "https://luxuryprayercards.lovable.app";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order-cancelled`,
      customer_email: customerEmail,
      metadata,
      shipping_address_collection: shippingInfo ? undefined : {
        allowed_countries: ['US'],
      },
      billing_address_collection: 'required',
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
