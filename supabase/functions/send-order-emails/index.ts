import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  orderDetails: {
    deceasedName: string;
    birthDate: string;
    deathDate: string;
    metalFinish: string;
    orientation: string;
    totalCards: number;
    easelPhotoCount: number;
    easelPhotoSize: string;
    shipping: string;
    totalPrice: number;
    additionalSets: number;
    prayerText: string;
    qrUrl: string;
  };
  frontCardImage: string;
  backCardImage: string;
}

async function sendEmail(
  to: string[],
  subject: string,
  html: string,
  attachments?: Array<{ filename: string; content: string }>
) {
  const emailData: Record<string, unknown> = {
    from: "Metal Prayer Cards <onboarding@resend.dev>",
    to,
    subject,
    html,
  };

  if (attachments && attachments.length > 0) {
    emailData.attachments = attachments;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-order-emails function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderEmailRequest = await req.json();
    console.log("Processing order for:", data.orderDetails.deceasedName);
    console.log("Customer email:", data.customerEmail);
    console.log("Owner email:", OWNER_EMAIL);

    const { customerEmail, customerName, shippingAddress, orderDetails, frontCardImage, backCardImage } = data;

    const orderId = `MPC-${Date.now().toString(36).toUpperCase()}`;
    const orderDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d97706, #b45309); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total-row { font-size: 1.2em; font-weight: bold; color: #d97706; border-bottom: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>We've received your order for premium metal prayer cards. Your order is being processed and will ship within ${orderDetails.shipping === "overnight" ? "24 hours" : "2 business days"}.</p>
            
            <div class="order-details">
              <h3>Order #${orderId}</h3>
              <p style="color: #6b7280;">${orderDate}</p>
              
              <div class="detail-row">
                <span>Memorial Name:</span>
                <strong>${orderDetails.deceasedName}</strong>
              </div>
              <div class="detail-row">
                <span>Metal Finish:</span>
                <span>${orderDetails.metalFinish}</span>
              </div>
              <div class="detail-row">
                <span>Total Prayer Cards:</span>
                <span>${orderDetails.totalCards}</span>
              </div>
              <div class="detail-row">
                <span>Easel Photos:</span>
                <span>${orderDetails.easelPhotoCount} (${orderDetails.easelPhotoSize})</span>
              </div>
              <div class="detail-row">
                <span>Shipping Method:</span>
                <span>${orderDetails.shipping === "overnight" ? "Overnight Rush" : "2-Day Express"}</span>
              </div>
              <div class="detail-row total-row">
                <span>Total:</span>
                <span>$${orderDetails.totalPrice}</span>
              </div>
            </div>
            
            <div class="order-details">
              <h4>Shipping Address</h4>
              <p>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br>
                Phone: ${shippingAddress.phone}
              </p>
            </div>
            
            <p>If you have any questions, please reply to this email.</p>
            <p>With sympathy,<br><strong>Metal Prayer Cards Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Metal Prayer Cards | metalprayercards.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending customer confirmation email...");
    const customerEmailResponse = await sendEmail([customerEmail], `Order Confirmation #${orderId} - Metal Prayer Cards`, customerEmailHtml);
    console.log("Customer email sent:", customerEmailResponse);

    // Owner order email with print files
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; }
          .urgent { background: #dc2626; color: white; padding: 10px; text-align: center; font-weight: bold; }
          .content { padding: 20px; background: #f3f4f6; }
          .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #d97706; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; }
          .total { font-size: 1.3em; color: #d97706; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          ${orderDetails.shipping === "overnight" ? '<div class="urgent">⚡ OVERNIGHT RUSH ORDER - PRIORITY SHIPPING ⚡</div>' : ""}
          <div class="header">
            <h1>NEW ORDER #${orderId}</h1>
            <p>${orderDate}</p>
          </div>
          <div class="content">
            <div class="section">
              <h3>📦 Customer Information</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
            </div>
            
            <div class="section">
              <h3>🏠 Shipping Address</h3>
              <p>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
              </p>
            </div>
            
            <div class="section">
              <h3>🪦 Memorial Details</h3>
              <table>
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td>Name</td><td><strong>${orderDetails.deceasedName}</strong></td></tr>
                <tr><td>Birth Date</td><td>${orderDetails.birthDate || "Not provided"}</td></tr>
                <tr><td>Death Date</td><td>${orderDetails.deathDate || "Not provided"}</td></tr>
                <tr><td>Metal Finish</td><td>${orderDetails.metalFinish}</td></tr>
                <tr><td>Orientation</td><td>${orderDetails.orientation}</td></tr>
                <tr><td>QR Code URL</td><td>${orderDetails.qrUrl || "None"}</td></tr>
              </table>
            </div>
            
            <div class="section">
              <h3>📿 Prayer Text</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${orderDetails.prayerText}</p>
            </div>
            
            <div class="section">
              <h3>🛒 Order Summary</h3>
              <table>
                <tr><td>Base Pack (55 cards + 2 photos)</td><td>$127</td></tr>
                ${orderDetails.additionalSets > 0 ? `<tr><td>Additional Card Sets × ${orderDetails.additionalSets}</td><td>$${orderDetails.additionalSets * 110}</td></tr>` : ""}
                <tr><td>Total Prayer Cards</td><td>${orderDetails.totalCards}</td></tr>
                <tr><td>Easel Photos</td><td>${orderDetails.easelPhotoCount} (${orderDetails.easelPhotoSize})</td></tr>
                <tr><td>Shipping</td><td>${orderDetails.shipping === "overnight" ? "OVERNIGHT RUSH (+100%)" : "2-Day Express (Included)"}</td></tr>
              </table>
              <p class="total">TOTAL: $${orderDetails.totalPrice}</p>
            </div>
            
            <div class="section">
              <h3>🖨️ Print Files</h3>
              <p><strong>IMPORTANT:</strong> Print-ready card images (with 1.25" bleed) are attached to this email as PNG files.</p>
              <ul>
                <li><strong>front-card-print.png</strong> - Front of prayer card</li>
                <li><strong>back-card-print.png</strong> - Back of prayer card</li>
              </ul>
              <p style="color: #dc2626;"><em>Files include 1.25" bleed area for professional printing.</em></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const attachments = [];

    if (frontCardImage && frontCardImage.includes(",")) {
      const frontBase64 = frontCardImage.split(",")[1];
      attachments.push({
        filename: "front-card-print.png",
        content: frontBase64,
      });
    }

    if (backCardImage && backCardImage.includes(",")) {
      const backBase64 = backCardImage.split(",")[1];
      attachments.push({
        filename: "back-card-print.png",
        content: backBase64,
      });
    }

    console.log("Sending owner order email with", attachments.length, "attachments...");
    const ownerEmailResponse = await sendEmail(
      [OWNER_EMAIL || "orders@metalprayercards.com"],
      `${orderDetails.shipping === "overnight" ? "⚡ RUSH " : ""}NEW ORDER #${orderId} - ${orderDetails.deceasedName}`,
      ownerEmailHtml,
      attachments
    );
    console.log("Owner email sent:", ownerEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        customerEmailId: customerEmailResponse?.id,
        ownerEmailId: ownerEmailResponse?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-order-emails function:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
