# THYDRIVER — NEW_CHAT_BRIEF.md
**Version:** 3.0 — Airport-first identity + national expansion model  
**Brand:** ThyDriver (ThyNetwork family)  
**Template identity:** ThyFreelancer (future: ThyBarber, ThyTutor, etc.)  
**Stack:** React Native + Expo · Supabase · Stripe (subscriptions only)  
**Launch target:** Web first (thydriver.com) then iOS + Android apps follow  
**Domains owned:** thydriver.com · thydrivers.com  

---

## 1. PRODUCT OVERVIEW

ThyDriver is a private, invite-only booking platform for independent drivers and their established clients. It eliminates the middleman (Uber/Lyft) for existing driver-client relationships. Clients connect to a specific driver via a personal Driver Code — they cannot discover new drivers through the platform. All payments go directly from client to driver via the driver's own payment accounts (Zelle, Venmo, CashApp, Stripe). ThyDriver's only revenue is a $20/week driver subscription.

**Core promise:** Your driver. Every airport.

ThyDriver is built specifically for airport travelers and the independent drivers who serve them. The airport code is the foundation of every connection on the platform.

---

## 2. NAMING ARCHITECTURE

| App | Audience |
|-----|----------|
| ThyDriver | Independent drivers + their clients |
| ThyBarber | Independent barbers + their clients |
| ThyTutor | Independent tutors + their students |
| ThyFreelancer | Master template for all of the above |

All apps share the same codebase. `service_type` variable in the database controls which vertical is active.

---

## 3. USER TYPES

### 3A. Rider (default)
- Connects to one or more specific drivers via Driver Code
- Cannot search for or discover new drivers
- Books rides, views payment info, leaves ratings
- Free account
- Completes Safety Protocol once at end of first booking flow

### 3B. Driver
- Creates profile, sets rates/availability/payment methods
- Pays $20/week subscription to ThyDriver (via Stripe)
- Approves or denies new client connection requests
- Manages calendar, bookings, and client list
- Completes Safety Protocol during onboarding

### 3C. Admin (ThyDriver staff)
- Can approve/waive driver subscription fees
- Can approve client connection requests on driver's behalf
- Access to encrypted driver credentials (DL last 4, insurance)
- Moderation and platform oversight

---

## 4. DRIVER CODE SYSTEM

Every driver is assigned a unique code at registration:
- **Format:** 3-letter IATA airport code + 2-3 uppercase initials + 4 digits
- **Example:** IAH·JDR·4207
- **Reading the code:** IAH = airport served, JDR = driver initials, 4207 = unique identifier
- **Purpose:** Client enters this code on login/signup to route to that specific driver
- **Anti-poaching:** A client can only access a driver they are already approved to connect with. New connection requests require driver approval. Clients cannot browse or discover drivers.

---

## 5. RIDER SCREEN FLOW (10 screens, fully locked)

### Screen 1 — Login

- ThyDriver logo + tagline: "Your Driver. Every Airport."
- Airport codes strip: IAH · HOU · MCO · LAX · ATL · ORD · DFW · JFK · MIA · + every US airport
- Toggle: Rider (default) | Driver
- Fields: Email, Driver Code (three-part field: Airport box · Initials box · Digits box), Password
- Driver code field: amber box (airport) + navy box (initials) + dark navy box (digits) — connected as one unit
- Helper labels below each box: Airport · Initials · Digits
- Example code shown: IAH·JDR·4207 = Houston driver
- CTA: "Find My Driver"
- Footer small text: "Don't have a code? Request one from your driver."
- Link: "Are you a driver? Create your account"
- Page footer (web): © 2026 ThyDriver | Privacy | Terms | Conditions

---

### Screen 2 — Rider Home (regular client, 2-tap flow)

**Greeting card (dark navy gradient):**
- "Welcome back, [Name]"
- Saved route with dot indicator: e.g. "Airport to Home"
- Insurance strip: "Ride insured by [Provider] · [Driver Name]"
- Set Amount row: "Your set amount · $120"
- Date box + Time box (editable inline)
- Two buttons: [Confirm] goes straight to Payment (Screen 8) | [New Destination] goes to Screen 3

**Below greeting card:**
- "View payment history" link
- Section header: "Your driver"
- Mini driver card (compact): avatar, name, code, star rating, airport badge, insurance note, tap to expand to Screen 3

**Page footer (web only):**
© 2026 ThyDriver | Privacy | Terms | Conditions

---

### Screen 3 — Driver Card + Date & Time (New Destination flow)

**Compact driver info card:**
- Avatar, Name, Driver Code
- Airport badge, Safety Protocol badge
- Rate cards (3): Hourly | Flat local (10 miles or less) | Max passengers
- Availability pills: days, hours, vehicle make/model
- Insurance strip: "Insured by [Provider] · Rideshare coverage"

**Date & Time section (directly below, same screen):**
- Tab toggle: Calendar | Enter manually
- Calendar grid: open (tappable) / blocked (greyed) / selected states
- Time slots row once date selected: open / taken / selected
- Button: "Next — Enter Route Details" goes to Screen 4

---

### Screen 4 — Route Details

- Step bar (3 steps, step 3 active)
- Title: "Route Details", subtitle: date/time/driver
- Pickup address field (navy dot indicator)
- Visual connector line between pickup and dropoff
- Drop-off address field (amber dot indicator)
- Estimated miles box (client enters known distance)
- Auto-prompt fires if miles exceed 51: "This looks like a long haul trip ([X] mi). Select below to apply long haul pricing."
- Miles badge: amber "51+ mi" appears automatically when triggered
- Two buttons:
  - [Confirm Booking] goes to Screen 5A (standard pending)
  - [This is a 51+ Mile Trip] goes to Screen 5B (long haul), amber highlight, auto-highlights when miles exceed 51

---

### Screen 5A — Pending / Driver Clock (standard trip)

- Animated timer ring showing countdown (e.g. 1:47 remaining)
- Title: "Waiting for [Driver]..."
- Subtitle: "Your booking request has been sent. [Driver] has [X] hours to confirm."
- Booking summary card: route, date/time, amount, driver code
- Status steps:
  - Done: Booking request sent
  - Active: Waiting for driver confirmation
  - Waiting: Booking confirmed
- [Cancel request] ghost button
- On driver confirm: advances to Screen 9 (Booking Confirmed)
- On timer expiry: "Booking expired" state with rebook prompt

---

### Screen 5B — Long Haul Fare Estimate (51+ miles)

- Title: "Long Haul Trip", subtitle: "51+ miles · Estimate sent to driver for approval"
- Route banner (amber-tinted): origin to destination, date/time, est. distance, est. hours
- Fare estimate breakdown (labeled "Estimate — driver may adjust"):
  - Hourly rate: [hrs] x $[rate] = $[subtotal]
  - Distance flat fee (51+ mi): $[amount]
  - Empty return charge: $[amount]
  - Estimated total: $[sum]
- Amber note: "This is an estimate only. Time of day, traffic, and route conditions may affect the final amount. Driver will confirm or adjust."
- Agreement box: plain-English cancellation terms for long haul
- Button: "Send Estimate to Driver" goes to Screen 5A clock while driver reviews
- Ghost button: "Request different route"

---

### Screen 5C — Driver Price Adjustment (client view)

Appears only when driver changes the estimate. If driver accepts estimate unchanged, client skips this screen and goes directly to Screen 8.

- Title: "James Updated the Fare"
- Subtitle: "Review and respond before your booking is confirmed."
- Context card: driver avatar, name/code, route, date/time
- Side-by-side amount comparison: "Your estimate" vs "James's price"
- Reason section (driver selected, icon-based for language accessibility):
  - Clock: After-hours / early morning
  - Traffic light: Traffic / road conditions
  - Gas pump: Fuel cost
  - Cloud/rain: Weather conditions
  - Map pin: Route complexity
  - Plus: Additional stop requested
- Driver optional note displayed if entered
- Three response buttons:
  1. [Accept $[amount]] goes to Screen 8 (Payment)
  2. [Hold 20 min — I need to think] sends message to driver: "Client is deciding. Do not start trip until accepted. Immediate pickup may be delayed a few minutes."
  3. [Decline — Cancel trip] booking cancelled, no charge to client

---

### Screen 8 — Payment

- Title: "How to Pay [Driver]"
- Booking summary card: route, date/time, final amount (labeled set amount or agreed price), payment timing
- Cancellation policy notice (red-tinted): "Free cancellation up to 24 hrs. Within 24 hrs — 50% charge. No-show — full amount."
- Payment methods (driver's enabled methods only):
  - Each method: icon, platform name, handle, QR icon (tap to scan and pay)
  - Selected method highlighted with amber border
- Payment timing note: "Payment [on pickup / at booking / end of ride]. Tap QR icon to scan and pay."
- Button: "Done — Confirm Booking" goes to Screen 9

---

### Screen 9 — Booking Confirmed (post-booking, app reopened state)

- Photo pair at top, side by side:
  - Left: Driver photo circle, title below "Who is picking you up", driver name
  - Right: Rider photo circle, title below "Who you are picking up", rider name
  - Photos from Safety Protocol uploads, falls back to initials avatar if not uploaded
- Ride summary card: route, date/time, amount, vehicle, insurance provider
- Cancellation reminder strip (red-tinted, small): "50% fee within 24hrs · Full amount for no-show"
- SUPPORT button (large, dominant, dark navy)
- Support sub-text (small, centered): "Call driver · Message driver · Contact ThyDriver"
- "Book another trip" small ghost button, secondary

---

### Screen 10 — Safety Protocol (one-time only)

Triggered after first booking confirmation. Never shown again after completion.

**Header card (navy gradient):**
- Title: "Safety Protocol"
- Subtitle: "One-time setup for your protection and your driver's. Encrypted and only accessed in an emergency or dispute."

**Profile photo upload (centered, prominent):**
- Circle upload area with camera icon
- Label: "Add your photo"
- Sub-note: "Your photo appears on the driver's booking confirmation"

**Fields:**
- Full legal name
- Date of birth (MM/DD/YYYY)
- Government ID last 4 digits with type selector: Driver's License | State ID | Passport
- Emergency contact name + phone (side by side)
- Home address (becomes default pickup)
- Note for driver (optional): "Luggage, mobility needs, gate codes, anything [Driver] should know"
- Button: "Complete Safety Protocol"

---

## 6. COMPLETE BOOKING FLOWS

### 6A. Regular client, saved route, set amount (2-tap minimum)
```
Screen 2 — confirm date/time — [Confirm]
Screen 8 — payment
Screen 9 — confirmed
```

### 6B. Regular client, new destination
```
Screen 2 — [New Destination]
Screen 3 — driver card + pick date/time
Screen 4 — enter pickup/dropoff/miles
Screen 5A — pending clock
Screen 8 — payment (once driver confirms)
Screen 9 — confirmed
```

### 6C. Long haul (51+ miles)
```
Screen 3 or 4 — miles auto-triggers 51+ prompt
Screen 5B — long haul estimate
Screen 5A — pending clock (driver reviewing estimate)
  IF driver accepts estimate unchanged — Screen 8
  IF driver adjusts price — Screen 5C — client responds
    Accept — Screen 8
    Hold 20 min — returns to Screen 5C with timer
    Decline — booking cancelled
Screen 8 — payment
Screen 9 — confirmed
```

### 6D. First-time client (safety protocol added)
```
Any flow above, at end before Screen 9 fully unlocks:
Screen 10 — Safety Protocol (one-time)
Screen 9 — confirmed
```

---

## 7. EMAIL NOTIFICATIONS

All emails via Resend (SendGrid fallback).

| Trigger | Recipient | Content |
|---------|-----------|---------|
| New booking request | Driver | Rider name, route, date/time, rate type |
| Booking confirmed | Rider | Date/time, driver name, payment instructions, cancellation policy |
| Long haul estimate received | Driver | Route, estimated fare breakdown, client name |
| Driver adjusted fare | Rider | New amount, reason, response options |
| Client held 20 min | Driver | "Client is deciding — do not start trip until accepted" |
| Driver did not confirm in time | Rider | Booking expired, rebook prompt |
| Booking cancelled by rider | Driver | Name, date, cancellation fee if applicable |
| Booking cancelled by driver | Rider | Cancellation notice |
| New client connection request | Driver | Rider name, wants to connect |
| Subscription renewal reminder | Driver | 3 days before billing |
| Subscription payment failed | Driver | Action required |

---

## 8. PAYMENT ARCHITECTURE

### 8A. Platform Revenue (ThyDriver earns)
- $20/week driver subscription via Stripe (ThyDriver's account)
- Auto-renewing weekly
- Waiver system: Admin can grant full waiver, trial period, or hardship waiver

### 8B. Driver-to-Client Payments (ThyDriver does NOT touch)
Clients pay drivers directly. ThyDriver displays payment info and QR codes only.

| Method | Driver enters | Client sees |
|--------|--------------|-------------|
| Zelle | Phone or email | Handle + QR upload |
| Venmo | @username | Handle + QR upload |
| CashApp | $cashtag | Handle + QR upload |
| Stripe | Email | Payment link (opens Stripe) |

- Driver enables any combination of methods
- QR codes: driver uploads screenshot from each payment app
- Client sees only enabled methods

### 8C. Payment Timing (driver sets, editable anytime)
- At booking (before ride)
- On pickup
- End of ride

### 8D. Mark as Paid
- Driver taps "Mark as Paid" manually after receiving payment
- Updates booking to Paid status
- Triggers rider rating prompt
- No real-time verification — trust model

### 8E. Cancellation Policy
- Driver sets policy during onboarding
- Standard display: Free cancellation over 24hrs, 50% within 24hrs, full amount no-show
- Shown on payment screen AND booking confirmation screen

---

## 9. DRIVER PRICE ADJUSTMENT SYSTEM

- Applies to long haul trips and any booking without a pre-set amount
- Driver selects reason(s) from icon grid (language-agnostic):
  Clock: After-hours, Traffic light: Traffic, Gas pump: Fuel, Rain cloud: Weather, Map pin: Route complexity, Plus: Additional stop
- Driver adds optional text note
- Driver's final price is final — no further negotiation
- Client receives three response options: Accept, Hold 20 min, Decline
- Hold sends immediate notification to driver to wait before starting

---

## 10. SAFETY PROTOCOL

Completed once per user. Stored encrypted. Never shown publicly.

### Rider Safety Profile
- Profile photo (used on driver's booking confirmation)
- Full legal name
- Date of birth
- Government ID last 4 (type: DL / State ID / Passport)
- Emergency contact name + phone
- Home address (default pickup)
- Optional note for driver

### Driver Safety Profile — where it lives

**Captured during onboarding Step 2 (split across two sub-screens):**

Sub-screen 2A — Credentials & photo:
- Profile photo upload (circle upload, shown on rider's booking confirmation)
- TX Driver's License last 4 digits (TX state badge + masked digit field, encrypted)
- Full legal name (must match DL)
- Insurance provider name + policy number (side by side)
- Coverage type selector: Rideshare (default) | Commercial | Personal

Sub-screen 2B — Emergency contact & permits:
- Emergency contact name
- Emergency contact phone
- Airport RideShare permit toggle (if ON: permit number + permit card photo upload)
- Completion confirmation shown before proceeding to Step 3

**Confirmation screen after Step 2:**
- Profile photo shown with green checkmark
- All items listed with status badges (Saved / Encrypted / Active)
- "Safety Protocol complete" green banner
- Proceeds to Step 3 (Rates)

**Editable anytime via Settings → Account & Credentials:**
- Profile photo: edit anytime
- Emergency contact: edit anytime
- Insurance details: edit anytime (re-enter provider + policy)
- Airport permit: edit anytime (update number + re-upload doc)
- TX DL last 4: LOCKED after admin verification — requires contacting ThyDriver support to change (protects against unauthorized credential swaps)

### What each party sees on the other's profile
- Checkmark: Safety Protocol complete
- Checkmark: Insured by [Provider] · coverage type (driver only)
- Raw data never visible to either party — verification checkmarks only

---

## 11. CLIENT CONNECTION (ANTI-POACHING)

- Clients cannot search, browse, or discover drivers
- Driver shares Driver Code directly with client (in person, text, etc.)
- New client flow:
  1. Driver shares code
  2. Client creates account + enters code
  3. Request sent to driver
  4. Driver approves or denies
- Client can connect to multiple drivers
- Driver can revoke any connection at any time

---

## 12. SUBSCRIPTION & WAIVER SYSTEM

Standard: $20/week via Stripe · 2-week free trial at signup · no contracts · auto-renewing weekly
Waiver types: Full waiver (admin-granted), Trial period, Hardship waiver (manual review)
Waiver = flag on driver's Supabase record. Stripe webhook checks flag before billing.

---

## 13. HOMEPAGE FOOTER

Appears on web version at bottom of all pages. On mobile app appears as small text at bottom of login screen.

© 2026 ThyDriver | Privacy | Terms | Conditions

- Privacy: thydriver.com/privacy
- Terms: thydriver.com/terms
- Conditions: thydriver.com/conditions

---

## 14. DATABASE SCHEMA (Supabase)

**users**
- id, email, name, phone, role (rider/driver/admin), avatar_url, photo_url, created_at

**drivers**
- id (FK to users.id), code_initials, code_digits, bio, city, banner_url, avatar_url, photo_url
- rate_hourly, flat_fee_local (10mi or less), flat_fee_distance (over 51mi, single flat)
- empty_return_type (fixed/percent), empty_return_value
- set_amount_default
- availability_json, cancellation_policy, payment_timing
- airport_permitted (bool), airport_permit_number, airport_permit_doc_url
- insurance_provider, insurance_policy_number, insurance_type
- is_active, subscription_status, subscription_waiver

**driver_credentials** (encrypted, admin-only row level security)
- id, driver_id, dl_last4_encrypted, legal_name, state (TX), verified_at, verified_by_admin_id

**rider_safety_profiles** (encrypted, driver-visible on active booking only)
- id, rider_id, photo_url, legal_name, dob, id_type, id_last4_encrypted
- emergency_contact_name, emergency_contact_phone
- home_address, driver_note, completed_at

**connections**
- id, driver_id, rider_id, status (pending/approved/denied/revoked)
- set_amount (nullable), set_amount_agreed_at, set_amount_set_by
- created_at

**driver_payment_methods**
- id, driver_id, method (zelle/venmo/cashapp/stripe), handle, qr_image_url, is_enabled

**vehicles**
- id, driver_id, make, model, year, color, seats, seatbelt_confirmed, photo_urls_json

**bookings**
- id, driver_id, rider_id, date, time_slot
- pickup_address, dropoff_address, estimated_miles
- route_type (standard/longhaul)
- status (pending/confirmed/completed/cancelled/expired)
- rate_type (set_amount/hourly/flat_local/flat_distance), rate_amount
- driver_estimate, driver_final_price, driver_adjustment_reason, driver_adjustment_note
- client_response (accepted/held/declined), hold_expires_at
- payment_timing, paid_at, driver_confirmed_at
- cancellation_reason, created_at

**ratings**
- id, booking_id, driver_id, rider_id, stars, comment, created_at

**availability**
- id, driver_id, date, time_slots_json

**subscriptions**
- id, driver_id, stripe_subscription_id, status, next_billing_date, waiver_active

---

## 15. TECH STACK

| Layer | Technology |
|-------|------------|
| Web (Phase 1 launch) | Expo Web — primary target |
| Mobile iOS + Android (Phase 3) | React Native + Expo — same codebase |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Payments (subscriptions) | Stripe |
| Email | Resend |
| Image storage | Supabase Storage |
| State management | Zustand |
| Navigation | Expo Router (file-based) |
| Push notifications | Expo Push Notifications (Phase 3) |
| Web deployment | Vercel (auto-deploy from GitHub) |
| Mobile deployment | EAS Build — Expo Application Services (Phase 3) |

---

## 16. FILE STRUCTURE

```
thydriver/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register-rider.tsx
│   │   └── register-driver/
│   │       ├── step1-personal.tsx
│   │       ├── step2-credentials.tsx
│   │       ├── step3-rates.tsx
│   │       └── step4-payment.tsx
│   ├── (rider)/
│   │   ├── home.tsx                    — Screen 2
│   │   ├── driver-card.tsx             — Screen 3
│   │   ├── route-details.tsx           — Screen 4
│   │   ├── pending.tsx                 — Screen 5A
│   │   ├── long-haul.tsx               — Screen 5B
│   │   ├── price-adjustment.tsx        — Screen 5C
│   │   ├── payment.tsx                 — Screen 8
│   │   ├── confirmed.tsx               — Screen 9
│   │   ├── safety-protocol.tsx         — Screen 10
│   │   └── payment-history.tsx
│   ├── (driver)/
│   │   ├── dashboard.tsx
│   │   ├── calendar.tsx
│   │   ├── clients.tsx
│   │   ├── booking-detail.tsx
│   │   ├── price-adjust.tsx            — Driver side of Screen 5C
│   │   ├── profile-edit.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── components/
│   ├── DriverCardCompact.tsx
│   ├── BookingCalendar.tsx
│   ├── RouteAddressInput.tsx
│   ├── MilesInput.tsx
│   ├── LongHaulBanner.tsx
│   ├── FareBreakdown.tsx
│   ├── PriceAdjustmentReasons.tsx
│   ├── PaymentMethodCard.tsx
│   ├── QRCodeDisplay.tsx
│   ├── PhotoPair.tsx
│   ├── SupportButton.tsx
│   ├── RatingStars.tsx
│   ├── DriverCodeBadge.tsx
│   └── TimerRing.tsx
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── email.ts
├── store/
│   ├── useAuthStore.ts
│   ├── useBookingStore.ts
│   └── useDriverStore.ts
├── constants/
│   ├── colors.ts
│   └── theme.ts
└── assets/
    └── thydriver-logo.png
```

---

## 17. COLOR PALETTE

| Token | Value | Use |
|-------|-------|-----|
| primary | #0a0a2e | Dark navy — backgrounds, CTAs |
| accent | #F5A623 | Amber gold — highlights, active states, set amount |
| surface | #F5F5F5 | Card backgrounds |
| text-primary | #1a1a1a | Main text |
| text-secondary | #888888 | Labels, captions |
| success | #3B6D11 | Confirmed, paid, insured states |
| warning | #D4830A | Pending, estimate, long haul states |
| danger | #A32D2D | Cancellation policy, error states |
| purple | #3C3489 | Set amount, agreed price |

---

## 18. APP STORE REQUIREMENTS

**Apple App Store**
- Developer account: $99/year
- Build via EAS Build
- Review time: 1-3 days
- Subscription billed via Stripe outside Apple IAP — permitted for B2B service subscriptions

**Google Play Store**
- Developer account: $25 one-time
- Build via EAS Build
- Review time: 1-3 days

**Key metadata:**
- App name: ThyDriver
- Bundle ID: com.thynetwork.thydriver
- Short description: "Book your trusted driver directly. Private, direct, no commission."
- Screenshots: 5 per platform
- Privacy Policy: thydriver.com/privacy
- Support URL: thydriver.com/support

---

## 19. WEB-FIRST LAUNCH STRATEGY

ThyDriver launches on web before mobile. The relationship between driver and client already exists — ThyDriver gives it infrastructure. A web link is the lowest-friction way to onboard people who already trust each other. Mobile apps follow as a convenience upgrade once the platform is proven and generating revenue.

### Why web-first works for this product
- Drivers doing onboarding (rates, permits, insurance, calendar) do it at a desk not on a phone
- Corporate clients and company employees book from a browser tab between meetings
- Regular clients bookmark thydriver.com and confirm in 2 clicks faster than opening an app
- No App Store review process to reach first users — deploy to Vercel and drivers are live same day
- Web iteration speed: fix issues with one Vercel deploy, not an App Store submission cycle
- Driver profile URL (thydriver.com/JDR4207) becomes a shareable link James texts to new clients

### Driver profile URL structure (locked)
- Format: thydriver.com/[DRIVERCODE] — e.g. thydriver.com/JDR4207
- Short enough to text, easy to remember, matches the driver code system
- Opens driver profile in browser — rider sees rates, vehicle, insurance badge, books without downloading anything
- New clients click the link, create account, send connection request — all in browser
- Same URL works on mobile web before the app exists, deep-links into app after launch

### Build phases

**Phase 1 — Web foundation (weeks 1–6)**
- Expo project with web as primary target
- Supabase auth + all database tables from schema
- Driver onboarding 4-step flow web-optimized
- Driver dashboard web version
- Rider home + full booking flow web version
- Payment screen web version
- Safety Protocol both sides
- Deploy to thydriver.com via Vercel
- Goal: first real driver onboarded and live

**Phase 2 — Web live with real drivers (weeks 7–10)**
- Shareable driver profile URLs live (thydriver.com/JDR4207)
- Email notifications via Resend live
- Stripe 0/week subscription with 2-week free trial live
- First real drivers onboarding existing clients
- First real bookings and revenue flowing
- Per-client policy settings live
- Real feedback collected, fast fixes via Vercel deploys

**Phase 3 — Mobile apps (weeks 11–20)**
- React Native mobile screens built on same codebase
- Responsive layout adjustments for mobile
- Push notifications via Expo Push Notifications
- EAS Build to TestFlight iOS beta
- EAS Build to Google Play internal testing
- Fix issues from beta testers (real drivers already on web version)
- App Store submission both platforms

**Phase 4 — Mobile launch + expansion**
- Both app stores live
- Web users prompted: Download the app for one-tap booking
- ThyBarber fork begins using ThyFreelancer template
- ThyTutor fork begins
- v1.1: in-app messaging, push notifications, Stripe payment links
- v1.2: GPS tracking, recurring bookings, client-facing payment ledger
- v2.0: ThyFreelancer master template public release

### Deployment infrastructure
- Web: Vercel connected to GitHub repo, auto-deploys on push
- Database: Supabase hosted PostgreSQL + auth + storage + realtime
- Domains: thydriver.com to Vercel, thydrivers.com redirect to thydriver.com
- Mobile (Phase 3): EAS Build via Expo Application Services
- Environment variables needed: Supabase URL + anon key, Stripe publishable + secret key, Resend API key

---

## 20. LOCKED DECISIONS (complete list)

- [x] No GPS tracking in v1
- [x] No in-app client-to-driver payment — display only
- [x] Platform revenue = $20/week driver subscription, no commission
- [x] Client discovery = invite-only via Driver Code
- [x] Driver Code = 2-3 initials + 4 digits
- [x] QR codes = driver uploads image, ThyDriver displays it
- [x] Payment timing = driver's choice, shown to client on payment screen
- [x] Mark as Paid = manual, no real-time verification
- [x] One codebase — iOS, Android, Web (Expo)
- [x] Template architecture: ThyFreelancer to ThyDriver, ThyBarber, ThyTutor
- [x] TX Driver's License = last 4 only, encrypted, admin-visible only
- [x] Airport RideShare Permit = optional, permit number + doc upload, badge on profile
- [x] Insurance = driver enters provider + policy, displayed as badge on profile
- [x] Rate order: Set Amount, Hourly, Flat Local, Flat Distance, Empty Return
- [x] Flat fee local = 10 miles or less (fixed dollar)
- [x] Flat fee distance = over 51 miles (single flat number, not per-mile)
- [x] Empty return = driver chooses fixed dollar OR percentage of fare
- [x] Set Amount = saved per driver-client connection pair, driver sets, both agree to activate
- [x] Set Amount = first and most prominent on client profile and rider home screen
- [x] Regular client + set amount = 2-tap booking (home to payment)
- [x] New destination = Screen 3 driver card + date/time, then Screen 4 route details
- [x] Screen 3 = driver card compact + calendar/time on same screen
- [x] Screen 4 = pickup address + dropoff address + miles box + auto 51+ prompt
- [x] Miles box auto-triggers long haul prompt and highlights 51+ button when over 51 miles
- [x] Long haul fare = hourly estimate + flat distance + empty return, labeled estimate only
- [x] Driver price adjustment = driver's price is final, no negotiation
- [x] Price adjustment reasons = icon-based grid, language-agnostic
- [x] Client response to adjustment = Accept, Hold 20 min, Decline
- [x] Hold 20 min = immediate notification to driver, driver must wait before starting
- [x] Cancellation policy shown on both payment screen and booking confirmation
- [x] Post-booking screen = SUPPORT dominant, Book another trip small and secondary
- [x] Photo pair on confirmation = driver photo (Who is picking you up) + rider photo (Who you are picking up)
- [x] Photos sourced from Safety Protocol upload, fallback to initials avatar
- [x] Safety Protocol = one-time, triggered at END of first booking flow
- [x] Safety Protocol framing = mutual protection language, not interrogation
- [x] Safety Protocol includes profile photo used on confirmation screen
- [x] Homepage footer = © 2026 ThyDriver | Privacy | Terms | Conditions
- [x] Driver Safety Protocol = captured in onboarding Step 2 (2A: credentials + photo, 2B: emergency contact + permits)
- [x] Driver profile photo = uploaded in Step 2, shown on rider booking confirmation
- [x] TX DL last 4 = locked after admin verification, requires support to change
- [x] Driver credentials editable in Settings — Account & Credentials (except locked DL)
- [x] Safety Protocol completion screen shown after Step 2 before Step 3
- [x] Driver side fully designed — 13 screens complete
- [x] Launch strategy = web-first, mobile apps follow in Phase 3
- [x] Primary deploy target = Vercel via thydriver.com
- [x] Driver profile public URL = thydriver.com/[DRIVERCODE] e.g. thydriver.com/JDR4207
- [x] thydrivers.com = redirect to thydriver.com
- [x] Web enables desktop onboarding, corporate clients, quick browser tab bookings
- [x] Mobile app positioned as convenience upgrade not launch requirement
- [x] Same Expo codebase runs web and mobile — no separate builds

---

## 21. BUILD READY

All rider screens (10), driver screens (13), and driver onboarding Safety Protocol screens (4) are fully designed and locked. Spec v2.3 is the Claude Code handoff document. Open a new Claude Code session, paste this entire brief, and begin with Phase 1 — web foundation.

---
---

## 22. AIRPORT-FIRST MODEL (v3.0)

### Product identity
ThyDriver is the private driver platform for airport travelers. Find a trusted driver at your home airport. They will be waiting when you land everywhere else.

### Why airport-first
- The recurring pain point is airport travel — not daily commutes. Uber handles everyday rides fine. Nobody complains about getting to the grocery store. They complain about 4am surge pricing, strangers who don't know the terminal, and starting over with a new driver every time.
- Airport travel is recurring and schedulable — the same passenger flies the same route weekly or monthly. That predictability makes private driver relationships valuable.
- Airport drivers already have established client relationships. ThyDriver formalizes what they're already doing informally.

### The national growth model (organic, zero marketing)
```
Driver takes client to IAH
Client flies to MCO
Client gets in an Uber at MCO
Client mentions ThyDriver to the MCO Uber driver
MCO Uber driver signs up that night
MCO Uber driver tells other MCO drivers
MCO opens as a new airport pool automatically
```
Passengers carry the product to every city they fly to. Growth is triggered by passenger demand, not advertising.

### IATA airport code system
- Every driver registers at one or more airports using the official 3-letter IATA code
- Driver code format: [AIRPORT]·[INITIALS]·[DIGITS] — e.g. IAH·JDR·4207
- The airport prefix tells the client exactly which airport the driver serves before they see the profile
- A driver near two airports (e.g. IAH and HOU in Houston) registers both — appears in both pools
- Each airport is a completely separate pool — IAH drivers only appear for IAH passengers

### Airport pools
- Each IATA code = one closed marketplace
- Pools activate automatically the moment a driver completes registration and pays their subscription
- No admin activation required — zero friction for new cities
- A new city opens the moment its first driver joins

### Driver code on both sides
- Rider enters full three-part code: IAH·JDR·4207
- Login field: three connected input boxes — amber (airport) + navy (initials) + dark navy (digits)
- The airport prefix is visible to both parties at all times

### Ride types (airport-first, relationship-second)
- How you connect: airport travel only — driver registers at airport, matching filters by airport
- What you can book once connected: any ride between established driver-client pairs
  - Airport runs (primary — how all relationships start)
  - Local rides (secondary — natural extension of established relationship)
  - Long haul (already in spec)
- Uber still wins random one-off rides. ThyDriver wins the relationship.

### Flight number field
- Optional field on booking screen: "Flight number — helps your driver track delays"
- Driver sees flight number on their booking card
- Supports the airport-delay waive policy in per-client settings

### My Airports (rider side)
- Rider home screen shows all airports where they have a matched driver
- Home airport shown first (where they originally joined)
- Each additional matched airport shown with driver name and code
- Smart prompt: "Flying to MCO next week? You have Ray waiting at Orlando Intl"
- Add Airport button: enter IATA code → triggers Find Me a Driver flow for that airport

### My Airports (driver side)
- Driver dashboard has dedicated My Airports nav item
- Shows all active airport pools with client count per airport
- Search to add new airports
- Nearby airport suggestions based on driver city

### Find Me a Driver — airport matching
- Passenger pays one-time $9.99 matching fee
- Selects airport code (or enters it)
- System searches that airport's driver pool
- Admin-controlled match — ThyDriver connects passenger with best available driver
- Matched driver sends their code to the passenger
- Normal invite flow begins

### Locked decisions — airport model
- [x] Product identity = airport-first private driver platform
- [x] Tagline = "Your Driver. Every Airport."
- [x] Driver code = three parts: IATA airport + initials + digits (e.g. IAH·JDR·4207)
- [x] Login code field = three connected input boxes (amber/navy/dark navy)
- [x] Each IATA code = one separate closed driver pool
- [x] Pools activate automatically when first driver joins and pays subscription
- [x] Driver can register at multiple airports — appears in all their pools
- [x] Connection always starts through airport travel — any ride type allowed after connection
- [x] National growth = organic via passenger word-of-mouth at airports
- [x] My Airports on rider home = shows all airports where rider has a matched driver
- [x] My Airports on driver dashboard = manages all airport pools driver serves
- [x] Flight number = optional booking field to help driver track delays
- [x] Find Me a Driver = filters by airport code, $9.99 one-time fee, admin-matched

---
---

## 23. FIND A DRIVER FLOW (fully locked)

### Name
"Find a Driver" — not "Find Me a Driver"
- "Find Me a Driver" implies the platform picks for you
- "Find a Driver" means the passenger browses and chooses their own person
- This is a relationship platform — the passenger must choose

### Entry point
- Login page left panel bottom — amber card with "Find a Driver" button
- Also accessible from rider home screen "Add Airport" flow

### Screen 1 — Airport Entry
- URL: thydriver.com/find-a-driver
- Large airport code input field (Syne font, bold, centered)
- Popular airports grid: 8 airports shown with live driver count and city name
- MCO, IAH, ATL, LAX, DFW, ORD, JFK, MIA shown as defaults
- Privacy notice: "Driver contact info hidden until connected. You browse anonymously."
- Search button → goes to Screen 2 with that airport code

### Screen 2 — Vehicle Class Filter + Driver Pool
- URL: thydriver.com/find-a-driver/[IATA]
- Airport shown in top bar (e.g. MCO · Orlando)
- Filter bar: All Classes · Comfort · XL · Black · XLL
- Sort: Rating · Availability · Rate
- Pool header: "[X] drivers accepting new clients at [IATA] · [City]"
- Sub-note: "Contact info hidden until connected"

**Driver pool card shows:**
- Profile photo
- First name + last initial only (Ray R.)
- Masked driver code: MCO·R**·**** — airport visible, rest hidden
- Star rating + ride count
- Airport badge(s)
- Vehicle class badge (COMFORT / XL / BLACK / XLL)
- Vehicle approved badge + insurance type badge
- Vehicle make/model/year/color/passenger count/seatbelt confirmation
- Rate card: Hourly + Flat local
- Availability days (Mon–Sun dots, on/off) + hours
- "Accepting new clients" status
- Two buttons: [View Profile] [Request · $9.99]

**Driver pool card NEVER shows:**
- Full last name
- Phone number
- Email
- Full driver code
- Insurance provider name
- Any contact method outside ThyDriver

### Screen 3 — Full Driver Profile
- URL: thydriver.com/find-a-driver/[IATA]/profile
- Profile banner with avatar, vehicle class badge
- First name + last initial, masked code, rating badges, airport badges
- Privacy notice prominent at top: contact info hidden until connected
- Vehicle photos: 4 uploaded images (front, rear, interior front, interior rear)
- Vehicle approved badge from ThyDriver admin review
- Full vehicle details: make/model/year/color/passengers/seatbelts/condition
- Full rate card: hourly/flat local/flat distance/empty return/pay timing
- Availability: days + hours + accepting clients status
- Ratings: numeric score + written reviews (anonymized reviewer)
- Airports served: full airport badge(s)
- "About connecting" note explaining what unlocks after approval
- Request Connection button at bottom

### Screen 4 — Request + Pay
- URL: thydriver.com/find-a-driver/[IATA]/request
- Driver summary card (dark navy): avatar, name, class, vehicle, rating, masked code
- Matching fee card:
  - Title: "One-time matching fee"
  - Description: charged once, all future bookings free to make
  - Fee amount: $9.99
  - Non-refundable if driver declines
  - Driver may optionally credit fee back as discount on first ride
- What happens next (5 steps):
  1. $9.99 processed, request sent to driver
  2. Driver reviews — 24 hours to respond
  3. If approved — full code and contact info unlock instantly
  4. Passenger can now book rides through ThyDriver
  5. Driver may credit $9.99 as discount on first ride
- Payment via Stripe (credit/debit card)
- Confirm button: "Pay $9.99 · Request [Driver Name] →"
- Back to pool button

### After approval
- Full driver code unlocks: MCO·R**·**** becomes MCO·RRV·8831
- Driver's contact information becomes visible
- Driver appears in passenger's "My Drivers" list
- Driver appears on passenger's home screen under their airport
- Normal booking flow begins — same as invite code flow

### Vehicle classes and standards

| Class | Vehicle types | Insurance required | Max passengers |
|-------|--------------|-------------------|----------------|
| Comfort | Sedan, clean, 2018+ | Rideshare endorsement | 3 |
| XL | SUV or minivan, 2018+ | Rideshare endorsement | 6 |
| Black | Luxury sedan or SUV, 2018+ | Commercial livery | 4 |
| XLL | Large luxury SUV or Sprinter, 2018+ | Commercial livery | 8+ |

**Vehicle standard (all classes):**
- 2018 or newer
- No major body damage (no missing panels, cracked windshield, broken mirrors)
- Minor wear acceptable (small scratches)
- Interior clean — no visible stains
- Working AC and heat
- All seatbelts functional
- 4 photos uploaded: front, rear, interior front, interior rear
- ThyDriver admin reviews and approves before driver goes live in pool

**Insurance must match vehicle class:**
- Comfort + XL: personal auto with rideshare endorsement minimum
- Black + XLL: commercial livery insurance required
- Insurance declaration page uploaded during onboarding
- Policy must name the vehicle being used
- Coverage dates must be current
- Admin reviews and verifies before pool activation

### Locked decisions — Find a Driver

- [x] Name = "Find a Driver" not "Find Me a Driver"
- [x] Passenger browses and chooses their own driver — not admin-assigned
- [x] Flow = Airport Entry → Class Filter + Pool → Full Profile → Request + Pay
- [x] $9.99 fee charged at point of request — not before browsing, not after approval
- [x] Fee is non-refundable if driver declines
- [x] Driver may optionally credit fee back as first ride discount
- [x] Contact info hidden throughout browsing — revealed only after approval
- [x] Driver code masked in pool (MCO·R**·****) — unlocks after approval
- [x] First name + last initial only in pool (Ray R.) — no full name until connected
- [x] Insurance type shown (Rideshare / Commercial Livery) — provider name hidden in pool
- [x] Vehicle photos required: 4 angles — front, rear, interior front, interior rear
- [x] Vehicle admin approval required before driver appears in pool
- [x] Vehicle must be 2018 or newer — no major body damage
- [x] Insurance must match vehicle class — Black and XLL require commercial livery
- [x] Four vehicle classes: Comfort · XL · Black · XLL
- [x] Filter by class before browsing — passenger only sees relevant class
- [x] Sort by: Rating · Availability · Rate
- [x] Pool only shows drivers with "Accepting new clients" toggled ON
- [x] Driver agreement: no sharing contact info outside platform during pool browsing
- [x] Payment via Stripe on the ThyDriver platform account


---

*ThyDriver is a ThyNetwork Inc. product. Houston, TX. © 2026*
