import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackingEmailRequest {
  orderId: string;
  trackingNumber: string;
  trackingCarrier: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-tracking-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, trackingNumber, trackingCarrier }: TrackingEmailRequest = await req.json();
    console.log("Sending tracking email for order:", orderId);

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      throw new Error("Order not found");
    }

    console.log("Found order for customer:", order.customer_email);

    // Generate tracking URL based on carrier
    let trackingUrl = "";
    switch (trackingCarrier.toLowerCase()) {
      case "usps":
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
        break;
      case "ups":
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
        break;
      case "fedex":
        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
        break;
      default:
        trackingUrl = `https://www.google.com/search?q=${trackingCarrier}+tracking+${trackingNumber}`;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .tracking-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #059669; }
          .tracking-number { font-size: 1.5em; font-weight: bold; color: #059669; letter-spacing: 2px; margin: 15px 0; }
          .track-button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Your Order Has Shipped!</h1>
            <p>Great news - your memorial cards are on the way</p>
          </div>
          <div class="content">
            <p>Dear ${order.customer_name},</p>
            <p>Your premium metal prayer cards have been shipped and are on their way to you!</p>
            
            <div class="tracking-box">
              <p style="margin: 0; color: #6b7280;">Carrier: <strong>${trackingCarrier.toUpperCase()}</strong></p>
              <p class="tracking-number">${trackingNumber}</p>
              <a href="${trackingUrl}" class="track-button" target="_blank">Track Your Package</a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Shipping To:</h4>
              <p>
                ${order.shipping_address}<br>
                ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}
              </p>
            </div>
            
            <p>Your package should arrive within ${order.shipping_type === "overnight" ? "1 business day" : "2-3 business days"}.</p>
            <p>If you have any questions about your order, please reply to this email.</p>
            <p>With sympathy,<br><strong>Metal Prayer Cards Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Metal Prayer Cards | metalprayercards.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending tracking email to:", order.customer_email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Metal Prayer Cards <onboarding@resend.dev>",
        to: [order.customer_email],
        subject: `📦 Your Order Has Shipped! - Tracking: ${trackingNumber}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Tracking email sent:", emailResult);

    // Update order with tracking sent timestamp
    await supabase
      .from("orders")
      .update({ tracking_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-tracking-email function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
