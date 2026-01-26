# Luxury Prayer Cards - Complete Project Specification

**Project URL:** https://luxuryprayercards.lovable.app  
**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Supabase (Backend), Stripe (Payments)

---

## 📋 PROJECT OVERVIEW

A premium memorial prayer card designer and e-commerce platform. Users design custom prayer cards (paper or metal), personalize with photos, text, borders, and prayers, then purchase through Stripe checkout. The system generates print-ready 300 DPI PDFs with bleed margins and crop marks for professional printing.

---

## 🎨 CARD TYPES & SIZES

### Paper Prayer Cards
| Size | Dimensions | Use Case |
|------|------------|----------|
| **Standard** | 2.5" × 4.25" | Traditional wallet-sized |
| **Large** | 3" × 4.75" | Enhanced visibility |

### Metal Prayer Cards  
| Size | Dimensions | Material |
|------|------------|----------|
| **Metal** | 2.125" × 3.375" | Premium brushed metal |

**Card Orientation:** Portrait only (front and back sides)

---

## 🖼️ DECORATIVE BORDER OPTIONS (4 Types)

All borders render as SVG overlays with realistic metallic gradient effects.

### 1. Classic Gold (`classic-gold`)
- Rich decorative frame with corner flourishes
- Inner and outer border lines
- Central ornaments at top and bottom
- Decorative curls in each corner
- Small circular accents

### 2. Elegant Scroll (`elegant-scroll`)
- Corner-only flourishes with curved paths
- L-shaped corner elements with scroll details
- Secondary curved accent lines
- Minimalist design, corners only

### 3. Simple Line (`simple-line`)
- Double-line border (outer thick, inner thin)
- Pulled in from card edges (4-7px margin)
- Rounded corners (1px radius)
- Clean, elegant appearance

### 4. Ornate Frame (`ornate-frame`)
- Multi-layered outer frame (3px and 5px inset)
- Diamond-shaped corner ornaments
- Small circular accents in corners
- Top and bottom center ornaments
- 4-petal flower motifs

---

## 🎨 METALLIC BORDER COLORS (4 Options)

| Color | Name | Hex Value | Gradient Definition |
|-------|------|-----------|---------------------|
| Gold | Champagne Gold | `#d4af37` | 7-stop gradient from `#fff9e6` → `#ffd700` → `#d4af37` → `#b8860b` |
| Silver | Platinum Silver | `#c0c0c0` | 7-stop gradient from `#ffffff` → `#e8e8e8` → `#c0c0c0` → `#a8a8a8` |
| Rose Gold | Rose Gold | `#b76e79` | 7-stop gradient from `#fce4e4` → `#e8b4b8` → `#b76e79` → `#9e5a65` |
| White | Pearl White | `#f8f8f8` | 5-stop gradient from `#ffffff` → `#fafafa` → `#f0f0f0` |

**SVG Gradient Implementation:**
```xml
<linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor="#fff9e6" />
  <stop offset="15%" stopColor="#ffd700" />
  <stop offset="30%" stopColor="#d4af37" />
  <stop offset="50%" stopColor="#b8860b" />
  <stop offset="70%" stopColor="#d4af37" />
  <stop offset="85%" stopColor="#ffd700" />
  <stop offset="100%" stopColor="#fff9e6" />
</linearGradient>
```

### Visual Reference Guide

To view each border style and color in action:
1. Visit: https://luxuryprayercards.lovable.app/design
2. Select "Paper Cards" ($67 option)
3. Look at the "Front Border" section in the controls panel

**Border Style Thumbnails** (5 buttons, left to right):
| Position | Style | Visual Description |
|----------|-------|-------------------|
| 1st | No Border | Empty square |
| 2nd | Classic Gold | Ornate corner flourishes with decorative frame |
| 3rd | Elegant Scroll | L-shaped corner scrollwork |
| 4th | Simple Line | Clean double-line rectangle |
| 5th | Ornate Frame | Diamond corners with ornaments |

**Metallic Color Swatches** (4 circular buttons, left to right):
| Position | Color | Appearance |
|----------|-------|------------|
| 1st | Gold | Warm yellow-gold metallic |
| 2nd | Silver | Cool silver-grey metallic |
| 3rd | Rose Gold | Pink-copper metallic |
| 4th | White | Pearl/off-white shimmer |

---

### Border Style Visual Examples (ASCII Representation)

**Classic Gold Border:**
```
    ╭──⊰✿⊱──╮           ╭──⊰✿⊱──╮
  ╭─┤        ├─╮       ╭─┤        ├─╮
  │ │   ◊    │ │       │ │   ◊    │ │
  ├─┼────────┼─┤       ├─┼────────┼─┤
  │                               │
  │        CARD CONTENT           │
  │                               │
  ├─┼────────┼─┤       ├─┼────────┼─┤
  │ │   ◊    │ │       │ │   ◊    │ │
  ╰─┤        ├─╯       ╰─┤        ├─╯
    ╰──⊰✿⊱──╯           ╰──⊰✿⊱──╯
```

**Elegant Scroll Border:**
```
  ╔══╗                      ╔══╗
  ║  ╚════╗          ╔════╝  ║
  ╚═╗                        ╔═╝
    │                        │
    │     CARD CONTENT       │
    │                        │
  ╔═╝                        ╚═╗
  ║  ╔════╝          ╚════╗  ║
  ╚══╝                      ╚══╝
```

**Simple Line Border:**
```
  ┌────────────────────────────┐
  │ ┌──────────────────────┐   │
  │ │                      │   │
  │ │    CARD CONTENT      │   │
  │ │                      │   │
  │ └──────────────────────┘   │
  └────────────────────────────┘
```

**Ornate Frame Border:**
```
   ◊                  ✦                  ◊
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ ┌─────────────────────────────────┐ ┃
  ┃ │                                 │ ┃
  ┃ │       CARD CONTENT              │ ┃
  ┃ │                                 │ ┃
  ┃ └─────────────────────────────────┘ ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   ◊                  ✦                  ◊
```

---

## 🖌️ METAL CARD BACKGROUND TEXTURES (11 Options)

### Premium Metals
| ID | Name | Description |
|----|------|-------------|
| `brushed-gold` | Champagne Gold | Warm gold with brushed texture effect |
| `brushed-silver` | Platinum Silver | Cool silver with fine horizontal lines |
| `brushed-rose-gold` | Rose Gold | Pink/copper tones with brushed finish |
| `brushed-black` | Gunmetal Black | Dark metallic with subtle shine |

### Marble Finishes
| ID | Name | Description |
|----|------|-------------|
| `marble-white` | Carrara White | Light marble with subtle veining |
| `marble-white-grey` | White Grey Marble | Mixed white/grey tones |
| `marble-grey` | Grey Marble | Medium grey with veining |
| `marble-black` | Nero Marble | Black marble with dark veins |

### Solid Finishes
| ID | Name | Description |
|----|------|-------------|
| `pearl-white` | Pearl White | Subtle shimmer effect |
| `solid-black` | Matte Black | Deep black, minimal shine |
| `solid-white` | Matte White | Clean white, minimal shine |

---

## ✏️ TYPOGRAPHY - FONT OPTIONS (10 Fonts)

| Font Name | Style Category | Best For |
|-----------|---------------|----------|
| Great Vibes | Script/Cursive | Wedding, Anniversary |
| Allura | Wedding Script | Formal invitations |
| Playfair Display | Elegant Serif | Headlines, names |
| Cormorant Garamond | Classic Serif | Body text, prayers |
| Montserrat | Modern Sans | Details, dates |
| Poppins | Clean Sans | Modern layouts |
| Dancing Script | Flowing Script | Baby announcements |
| Tangerine | Formal Script | Elegant headers |
| Alex Brush | Brush Script | Artistic text |
| Sacramento | Casual Script | Friendly tone |

---

## 🕊️ PRAYER TEMPLATES (12 Templates)

### Christian Tradition
1. **Psalm 23** - "The Lord is my shepherd..."
2. **The Lord's Prayer** - "Our Father, who art in heaven..."
3. **Footprints** - "When you saw only one set of footprints..."

### Catholic Tradition
4. **Hail Mary** - "Hail Mary, full of grace..."
5. **Eternal Rest** - "Eternal rest grant unto them, O Lord..."
6. **Prayer of St. Francis** - "Lord, make me an instrument of Your peace..."

### Jewish Tradition
7. **Mourner's Kaddish (English)** - "Glorified and sanctified be God's great name..."

### Universal/Multi-Faith
8. **Serenity Prayer** - "God, grant me the serenity..."
9. **Irish Blessing** - "May the road rise up to meet you..."

### Secular/Non-Religious
10. **Apache Blessing** - "May the sun bring you new energy by day..."
11. **Remember Me** - "Do not stand at my grave and weep..."
12. **Celebration of Life** - "Those we love don't go away..."

---

## 📷 FRONT CARD ELEMENTS

### Photo (Memorial Portrait)
- **Drag-to-position:** Users can drag photo on canvas
- **Properties:** Zoom, Pan X/Y, Rotation, Brightness
- **Cropping:** Automatic aspect-ratio fitting
- **Reset button:** Returns photo to default position

### Name Text
- **Customizable:** Font family, color
- **Positioning:** Drag-on-canvas editing
- **Auto-sizing:** Fits within card boundaries

### Dates Display
- **Format:** "Month DD, YYYY - Month DD, YYYY" or custom
- **Styling:** Separate font/color from name
- **Position:** Typically below name

### Decorative Border
- **4 border styles** (see above)
- **4 metallic colors** (see above)
- **Adjusts content safe area** when active

### QR Code
- **Position:** Bottom-right corner
- **Size:** 32-48px (adjusts for borders)
- **Error correction:** Level "M" or "H"
- **Links to:** Memorial tribute page

### Funeral Home Logo
- **Position:** "Top" or "Bottom"
- **Size:** Adjustable (percentage scale)
- **Visibility toggle:** Show/hide option

---

## 📖 BACK CARD ELEMENTS

### Header Section
- **"In Loving Memory"** label (customizable)
- **Name** (mirrored from front or custom)
- **Dates** (mirrored from front or custom)

### Prayer Text
- **Template selection:** 12 pre-written prayers
- **Custom text:** User can write their own
- **Auto-sizing algorithm:**
  - Calculates available height (minus header, footer, borders)
  - Iterative reduction to find max font size that fits
  - Minimum: 10pt, Maximum: capped
  - Word wrapping: `overflowWrap: 'anywhere'`
- **Styling:** Italic toggle (default: true), bold option
- **Line height:** 1.25 - 1.35

### Decorative Border
- **Same options as front** (can be different selection)
- **Independent color/style** from front

### QR Code
- **Same as front** but independently toggleable

---

## 🎭 STICKER & ELEMENT LIBRARY

### By Category
| Category | Stickers |
|----------|----------|
| Wedding | 💍 💕 👰 🤵 🥂 🌹 💐 💋 |
| Baby | 👶 🍼 👣 🧸 🎀 🦩 |
| Prayer/Religious | 🕊️ 🙏 👼 🕯️ ✝️ ⛪ |
| Graduation | 🎉 🎊 🎈 🏆 🎓 🏅 |
| Anniversary | 🎁 ❤️ ✨ 💝 🍷 💑 |
| Decorative | ⭐ ✨ 💎 👑 🎀 🌸 🍃 🦋 |

### Shape Elements
- Rectangle ▬
- Circle ●
- Triangle ▲
- Star ★
- Heart ♥
- Diamond ◆
- Hexagon ⬡
- Oval ⬭

### Icon Library (Lucide Icons)
Heart, Star, Crown, Sparkles, Flower, Sun, Moon, Cloud, Music, Camera, Gift, Cake, Baby, Church, Cross, Bird (Dove), Ring, GraduationCap, Award, Trophy

---

## 💰 PRICING STRUCTURE

### Base Packages

| Product | Base Price | Quantity | Per-Card Add-on |
|---------|-----------|----------|-----------------|
| Paper Prayer Cards Starter | **$67.00** | 72 cards | +$0.77/card |
| Metal Prayer Cards Starter | **$97.00** | 55 cards | +$87.00/55 cards |

### Upsells & Add-ons

| Add-on | Price | Description |
|--------|-------|-------------|
| Paper Size Upgrade | +$7.00 | Standard → Large (3" × 4.75") |
| Premium Thickness | +$15.00 | Metal cards: .080" thickness |
| Additional Design | +$7.00 | Per additional card design |
| Memorial Photo 16"×20" | +$17.00 | Per additional photo |
| Photo Size Upgrade | +$7.00 | 16"×20" → 18"×24" |

### Shipping Options

| Speed | Price | Condition |
|-------|-------|-----------|
| Standard Shipping | $9.99 | Free on orders $100+ |
| 72-Hour Express | $35.00 | - |
| 48-Hour Priority | $45.00 | - |

---

## 🛒 CHECKOUT FLOW

1. **Cart Review** - Items, quantities, pricing summary
2. **Shipping Selection** - Speed options with pricing
3. **Upsell Presentation** - Thickness upgrade, size upgrade, additional photos
4. **Customer Information** - Name, email, phone
5. **Shipping Address** - Address, city, state, ZIP
6. **Stripe Checkout** - Payment processing
7. **Order Confirmation** - Email with order details

### Post-Purchase
- **Print-ready PDF generation:** 300 DPI with 0.125" bleed margins and crop marks
- **Order email to customer**
- **Production email to fulfillment**

---

## 🖥️ PAGE STRUCTURE

### Homepage (`/`)
- Hero section with product showcase
- Product type selection (Paper vs Metal)
- Pricing display
- Feature highlights
- Call-to-action buttons

### Designer (`/design`)
- Card type modal on entry (Paper/Metal)
- Paper: Size selector (Standard/Large)
- Live preview canvas (actual physical size)
- Step-by-step editing panels:
  - Front: Photo, Name, Dates, Border, QR
  - Back: Header, Prayer, Border, QR
- Add-ons section
- Cart summary
- Checkout button

### Memorial Photo Editor (`/memorial-photo-editor`)
- Large format photo editing (16"×20" or 18"×24")
- Text overlay (name, dates)
- Funeral home logo placement
- Frame/border options

### Admin Panel (`/admin`)
- Order management
- Tracking number entry
- Order status updates

### Order Success (`/order-success`)
- Confirmation message
- Order summary

### Order Cancelled (`/order-cancelled`)
- Return option
- Support contact

---

## 🗄️ DATABASE SCHEMA (Supabase)

### Tables

**products**
- id, name, description, price, stripe_product_id, stripe_price_id
- card_type, base_quantity, additional_card_price
- is_active, image_url, category

**orders**
- id, customer_name, customer_email, customer_phone
- shipping_address, shipping_city, shipping_state, shipping_zip
- shipping_type, total_cards, total_photos, total_price
- package_name, front_design_url, back_design_url
- stripe_session_id, payment_status, payment_intent_id
- status, tracking_number, tracking_carrier, tracking_sent_at

**order_items**
- id, order_id, product_id, product_name
- quantity, unit_price, total_price, design_data

**admin_users**
- id, user_id, role, created_at

**funeral_homes**
- id, user_id, name, logo_url, address, phone

**memorial_orders** (B2B)
- id, funeral_home_id, deceased_name, birth_date, death_date
- photo_url, qr_code, quantity, status

**memorial_messages**
- id, memorial_id, author_name, message, video_url

---

## 🔌 INTEGRATIONS

### Stripe
- Checkout sessions
- Payment processing
- Webhook handling

### Supabase
- Authentication
- Database
- File storage (card-backgrounds, order-designs buckets)
- Edge Functions

### Resend
- Order confirmation emails
- Tracking notification emails

---

## 📱 RESPONSIVE BREAKPOINTS

- **Mobile:** < 768px (single-column layout, stacked controls)
- **Tablet:** 768px - 1024px (side panels collapse)
- **Desktop:** > 1024px (full side-by-side layout)

---

## 🎯 KEY TECHNICAL FEATURES

1. **Direct canvas editing** - Drag elements on preview
2. **Real-time preview** - Changes reflect instantly
3. **Auto-fit text algorithm** - Prayer text auto-sizes
4. **Metallic gradient rendering** - SVG-based realistic metal effects
5. **Print-ready export** - 300 DPI PDFs with bleed/crop marks
6. **QR code generation** - High error-correction for scannability
7. **State persistence** - Design saved in localStorage
8. **Responsive design** - Mobile-first approach

---

## 📂 KEY FILE LOCATIONS

| Purpose | File Path |
|---------|-----------|
| Homepage | `src/pages/Index.tsx` |
| Card Designer | `src/pages/Design.tsx` |
| Photo Editor | `src/pages/MemorialPhotoEditor.tsx` |
| Border Component | `src/components/DecorativeBorderOverlay.tsx` |
| QR Code | `src/components/QrCodeBadge.tsx` |
| Card Preview | `src/components/CardPreview.tsx` |
| Prayer Data | `src/data/prayerTemplates.ts` |
| Card Types | `src/types/businessCard.ts` |
| Elements Library | `src/types/cardElements.ts` |
| Checkout Function | `supabase/functions/create-checkout/index.ts` |
| Email Function | `supabase/functions/send-order-emails/index.ts` |

---

## ✅ WHAT'S COMPLETE

- [x] Card type selection (Paper/Metal)
- [x] Paper size options (Standard/Large)
- [x] 4 decorative border styles
- [x] 4 metallic border colors
- [x] 11 background textures
- [x] 10 font options
- [x] 12 prayer templates
- [x] Photo upload and positioning
- [x] QR code generation
- [x] Funeral home logo support
- [x] Stripe checkout integration
- [x] Order management admin
- [x] Email notifications
- [x] Responsive design

## 🚧 WHAT MAY NEED WORK

- [ ] Additional design workflow polish
- [ ] Memorial tribute public pages
- [ ] B2B funeral home dashboard
- [ ] Print PDF generation refinement
- [ ] Performance optimization
- [ ] Browser compatibility testing

---

## 📸 SCREENSHOT CAPTURE INSTRUCTIONS

To capture high-quality screenshots for visual documentation:

### Border Styles (4 variations with Gold color)

1. **Navigate to Designer:** https://luxuryprayercards.lovable.app/design
2. **Select Paper Cards** ($67 option)
3. **For each border style, click the corresponding thumbnail:**
   - **Classic Gold:** 2nd button - Ornate frame with corner flourishes, scrollwork, and decorative elements
   - **Elegant Scroll:** 3rd button - Corner-only L-shaped flourishes with curved accents
   - **Simple Line:** 4th button - Clean double-line rectangular border
   - **Ornate Frame:** 5th button - Diamond corners with flower motifs and center ornaments

### Metallic Colors (4 variations with Classic Gold border)

1. **Keep Classic Gold border selected** (2nd button)
2. **Click each color swatch** in the color picker:
   - **Gold (1st):** Rich champagne gold with warm shine - `#d4af37`
   - **Silver (2nd):** Cool platinum silver with crisp reflections - `#c0c0c0`
   - **Rose Gold (3rd):** Warm pink-copper tones - `#b76e79`
   - **White (4th):** Subtle pearl shimmer on light backgrounds - `#f8f8f8`

### Screenshot Specifications

| Element | Recommended Size | Focus Area |
|---------|-----------------|------------|
| Full Designer View | 1280×720 | Complete interface with card preview |
| Card Preview Only | 400×600 | Just the card preview (cropped) |
| Border Close-up | 200×300 | Corner detail of border |
| Color Swatches | 300×50 | Row of color buttons |

### Example Filenames
```
border-classic-gold-gold.png
border-elegant-scroll-gold.png
border-simple-line-gold.png
border-ornate-frame-gold.png
border-classic-gold-silver.png
border-classic-gold-rose-gold.png
border-classic-gold-white.png
```

---

## 🖼️ METAL CARD BACKGROUND VISUAL REFERENCE

To view metal card backgrounds:
1. Visit: https://luxuryprayercards.lovable.app/design
2. Select "Metal Cards" ($97 option)
3. Background textures appear in the card preview automatically

### Background Gradient CSS Values

**Brushed Metals:**
```css
/* Champagne Gold */
linear-gradient(135deg, #c5a870 0%, #e8d5b0 15%, #b8965a 35%, #e2cb9a 55%, #a8854d 75%, #d4be8a 90%, #c5a870 100%)

/* Platinum Silver */
linear-gradient(135deg, #b8c0c8 0%, #e8ecef 15%, #9ca5af 35%, #dce1e6 55%, #8d969f 75%, #cdd3d9 90%, #b8c0c8 100%)

/* Rose Gold */
linear-gradient(135deg, #c4a484 0%, #e8d0c0 15%, #b08d6a 35%, #dfc5b5 55%, #9c7856 75%, #d4b8a4 90%, #c4a484 100%)

/* Gunmetal Black */
linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 15%, #1a1a1a 35%, #3d3d3d 55%, #0f0f0f 75%, #333333 90%, #2c2c2c 100%)
```

**Marble Finishes:**
```css
/* Carrara White */
linear-gradient(125deg, #fafafa 0%, #f0f0f0 20%, #e8e8e8 35%, #f5f5f5 50%, #e0e0e0 65%, #f8f8f8 80%, #ececec 100%)

/* Grey Marble */
linear-gradient(125deg, #a8a8a8 0%, #c5c5c5 20%, #8f8f8f 35%, #b8b8b8 50%, #9a9a9a 65%, #d0d0d0 80%, #a0a0a0 100%)

/* Nero Marble */
linear-gradient(125deg, #1a1a1a 0%, #2e2e2e 20%, #0f0f0f 35%, #252525 50%, #1c1c1c 65%, #383838 80%, #141414 100%)
```

**Solid Finishes:**
```css
/* Pearl White */
linear-gradient(135deg, #f8f8f8 0%, #ffffff 25%, #f0f0f0 50%, #fafafa 75%, #f5f5f5 100%)

/* Matte Black */
linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)

/* Matte White */
linear-gradient(135deg, #fefefe 0%, #f5f5f5 50%, #fefefe 100%)
```

---

**Last Updated:** January 2025
