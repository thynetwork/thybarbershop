import Link from 'next/link';

export const metadata = {
  title: 'Conditions of Use — ThyBarberShop',
  description: 'ThyBarberShop conditions of use including SMS terms, booking conditions, payment conditions, and platform rules.',
};

export default function ConditionsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>
      {/* ── Topbar ──────────────────────────────────────── */}
      <div className="app-topbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="topbar-logo">Thy<span>BarberShop</span></div>
        </Link>
        <div className="topbar-right">
          <Link href="/privacy" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500 }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500 }}>Terms</Link>
          <Link href="/conditions" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500 }}>Conditions</Link>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="legal-page">
        <h1 className="legal-title">Conditions of Use</h1>
        <p className="legal-updated">Last Updated: April 2026</p>

        <p className="legal-intro">
          These Conditions of Use outline specific terms governing SMS communications, booking procedures, payment processes, vehicle standards, insurance requirements, and platform rules for all ThyBarberShop users. These Conditions supplement our <Link href="/terms" style={{ color: 'var(--navy)', fontWeight: 600 }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--navy)', fontWeight: 600 }}>Privacy Policy</Link>.
        </p>

        {/* ── 1. SMS / Text Message Terms ───────────────── */}
        <h2 className="legal-heading">1. SMS / Text Message Terms</h2>
        <p className="legal-body">
          By creating a ThyBarberShop account and providing your mobile phone number, you expressly consent to receive SMS (Short Message Service) and text message notifications from ThyBarberShop. Please review the following terms carefully:
        </p>

        <h3 className="legal-subheading">Consent</h3>
        <p className="legal-body">
          By creating a ThyBarberShop account, you consent to receive automated SMS notifications related to your account, bookings, and platform activity. This consent is not a condition of purchasing any goods or services, though opting out may affect the timeliness of booking-related communications.
        </p>

        <h3 className="legal-subheading">Message Types</h3>
        <p className="legal-body">You may receive the following types of SMS messages:</p>
        <ul className="legal-list">
          <li>Booking confirmations and booking request alerts</li>
          <li>Driver acceptance and decline notifications</li>
          <li>Ride reminders (e.g., upcoming ride in 24 hours, 1 hour)</li>
          <li>Schedule changes and cancellation notices</li>
          <li>Account security notifications (login alerts, password resets)</li>
          <li>Payment and subscription reminders</li>
          <li>Safety Protocol completion notifications</li>
        </ul>

        <h3 className="legal-subheading">Message Frequency</h3>
        <p className="legal-body">
          Message frequency varies based on your booking activity and account events. Users with frequent bookings may receive multiple messages per week. Users with no active bookings will receive minimal messages (account security and subscription-related only).
        </p>

        <h3 className="legal-subheading">Costs</h3>
        <p className="legal-body">
          Standard message and data rates from your wireless carrier may apply to SMS messages sent to or received from ThyBarberShop. ThyBarberShop does not charge any additional fee for SMS notifications. Contact your carrier for details about your messaging plan.
        </p>

        <h3 className="legal-subheading">Opt-Out</h3>
        <p className="legal-body">
          You may opt out of SMS notifications at any time by replying <strong>STOP</strong> to any ThyBarberShop text message. Upon receiving your STOP request, we will send a single confirmation message and cease all further SMS communications. Opting out of SMS does not close your account or affect your ability to use the platform through the website.
        </p>

        <h3 className="legal-subheading">Help</h3>
        <p className="legal-body">
          For assistance with ThyBarberShop SMS messages, reply <strong>HELP</strong> to any message, or contact us at support@thybarbershop.com. You may also call or text our support line for immediate assistance.
        </p>

        <h3 className="legal-subheading">Carrier Information</h3>
        <p className="legal-body">
          ThyBarberShop SMS messages are sent via Twilio from the following registered number:
        </p>
        <div className="legal-highlight">
          <p><strong>ThyBarberShop SMS Number:</strong> +1 (620) 254-8664</p>
          <p><strong>Messaging Provider:</strong> Twilio</p>
          <p><strong>Supported Carriers:</strong> All major US carriers including AT&amp;T, T-Mobile, Verizon, and others</p>
        </div>

        {/* ── 2. Booking Conditions ────────────────────── */}
        <h2 className="legal-heading">2. Booking Conditions</h2>
        <p className="legal-body">
          The following conditions apply to all bookings made through the ThyBarberShop platform:
        </p>
        <ul className="legal-list">
          <li><strong>Direct Arrangement:</strong> All bookings represent a direct arrangement between the client and driver. ThyBarberShop facilitates the connection and provides the scheduling tools, but is not a party to the transportation agreement.</li>
          <li><strong>Platform Facilitator:</strong> ThyBarberShop is a technology platform, not a transportation provider. We do not dispatch drivers, set fares, or guarantee ride availability.</li>
          <li><strong>Safety Protocol Required:</strong> Clients must complete the ThyBarberShop Safety Protocol before their first ride with any driver. This includes submitting emergency contact information and identity verification. Bookings cannot be confirmed until both parties have completed the protocol.</li>
          <li><strong>Driver Approval:</strong> All booking requests are subject to driver acceptance. Drivers may decline booking requests at their discretion based on availability, location, or other factors.</li>
          <li><strong>Driver Credentials:</strong> Drivers must maintain valid credentials and active insurance coverage at all times. Drivers whose credentials expire or are revoked will have their accounts suspended until credentials are renewed.</li>
          <li><strong>Booking Accuracy:</strong> Clients are responsible for providing accurate pickup and dropoff locations, dates, and times. Significant changes to booking details after confirmation may require a new booking request.</li>
        </ul>

        {/* ── 3. Payment Conditions ────────────────────── */}
        <h2 className="legal-heading">3. Payment Conditions</h2>
        <p className="legal-body">
          ThyBarberShop maintains a clear separation between ride payments and platform fees:
        </p>

        <h3 className="legal-subheading">Ride Payments</h3>
        <ul className="legal-list">
          <li>All ride payments go directly from the client to the driver using the driver&rsquo;s preferred payment method(s).</li>
          <li>ThyBarberShop does not process, hold, collect, escrow, or transfer any ride fare payments.</li>
          <li>Payment methods displayed on a driver&rsquo;s profile (Zelle, Venmo, Cash App, etc.) are the driver&rsquo;s own personal accounts. ThyBarberShop is not responsible for the accuracy of payment information provided by drivers.</li>
          <li>Clients and drivers are responsible for resolving any payment disputes directly between themselves.</li>
          <li>ThyBarberShop may assist in mediation upon request but is not obligated to do so and bears no liability for payment disputes.</li>
        </ul>

        <h3 className="legal-subheading">Driver Subscription</h3>
        <ul className="legal-list">
          <li>Active driver accounts require a weekly subscription of <strong>$9.99 per week</strong>.</li>
          <li>Subscriptions are billed automatically via Stripe on a recurring weekly basis.</li>
          <li>Drivers may cancel their subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
          <li>Failed payments result in an account hold. Drivers have a 7-day grace period to resolve payment issues before their account is suspended.</li>
        </ul>

        <h3 className="legal-subheading">Find a Driver Matching Fee</h3>
        <ul className="legal-list">
          <li>Clients who use the Find a Driver feature to be matched with a new driver are charged a one-time matching fee of <strong>$9.99</strong>.</li>
          <li>This fee is billed via Stripe at the time of match confirmation.</li>
          <li>The matching fee is non-refundable once a driver has been matched and a driver code issued.</li>
          <li>Clients who already have a driver code from an existing ThyBarberShop driver do not pay a matching fee.</li>
        </ul>

        {/* ── 4. Vehicle Standards ─────────────────────── */}
        <h2 className="legal-heading">4. Vehicle Standards</h2>
        <p className="legal-body">
          All vehicles used on the ThyBarberShop platform must meet the following minimum standards:
        </p>
        <ul className="legal-list">
          <li><strong>Model Year:</strong> 2018 or newer.</li>
          <li><strong>Exterior Condition:</strong> No major body damage, dents, or cosmetic issues that would affect passenger comfort or the professional appearance of the vehicle.</li>
          <li><strong>Climate Control:</strong> Working air conditioning and heating systems in full operational condition.</li>
          <li><strong>Safety Equipment:</strong> All seatbelts must be present and functional for every seating position.</li>
          <li><strong>Cleanliness:</strong> Vehicles must be clean, well-maintained, and free of offensive odors at the time of each ride.</li>
          <li><strong>Admin Approval:</strong> All vehicles must be reviewed and approved by a ThyBarberShop administrator before the driver can accept bookings. Drivers must submit four vehicle photographs (front exterior, rear exterior, front interior, rear interior) during registration.</li>
          <li><strong>Ongoing Compliance:</strong> Vehicles are subject to periodic review. ThyBarberShop reserves the right to require updated photographs or suspend a driver whose vehicle no longer meets platform standards.</li>
        </ul>

        {/* ── 5. Insurance Requirements ────────────────── */}
        <h2 className="legal-heading">5. Insurance Requirements</h2>
        <p className="legal-body">
          Insurance requirements vary by vehicle class. All drivers must maintain coverage that meets or exceeds the following minimums:
        </p>
        <ul className="legal-list">
          <li><strong>Comfort Class:</strong> Personal auto insurance with a rideshare endorsement at minimum.</li>
          <li><strong>XL Class:</strong> Personal auto insurance with a rideshare endorsement at minimum.</li>
          <li><strong>Black Class:</strong> Commercial livery insurance required. Personal auto insurance with a rideshare endorsement is not sufficient.</li>
          <li><strong>XLL Class:</strong> Commercial livery insurance required. Personal auto insurance with a rideshare endorsement is not sufficient.</li>
        </ul>
        <p className="legal-body">
          Drivers must upload proof of active insurance during registration and update their insurance documents whenever their policy is renewed. Operating without valid insurance is a violation of ThyBarberShop&rsquo;s Terms of Service and applicable law, and will result in immediate account suspension.
        </p>

        {/* ── 6. Platform Rules ────────────────────────── */}
        <h2 className="legal-heading">6. Platform Rules</h2>
        <p className="legal-body">
          All users must adhere to the following platform rules to maintain a safe, professional, and fair environment:
        </p>

        <h3 className="legal-subheading">Contact Information Protection</h3>
        <p className="legal-body">
          Clients browsing the driver pool may not solicit or share a driver&rsquo;s personal contact information (phone number, email, social media) outside of the ThyBarberShop platform. Once a client and driver are connected via a driver code, contact information is shared through the platform for booking purposes only.
        </p>

        <h3 className="legal-subheading">Credential Integrity</h3>
        <p className="legal-body">
          Falsifying any credentials, safety information, insurance documents, vehicle details, or personal identification submitted to ThyBarberShop is strictly prohibited and will result in immediate and permanent account termination. ThyBarberShop may also report fraudulent submissions to appropriate authorities.
        </p>

        <h3 className="legal-subheading">Booking Reliability</h3>
        <p className="legal-body">
          Drivers are expected to respond to booking requests in a timely manner. Three consecutive missed or ignored booking requests within a 30-day period will trigger an administrative review of the driver&rsquo;s account. Possible outcomes include a warning, temporary hold, or account suspension depending on the circumstances and the driver&rsquo;s history.
        </p>

        <h3 className="legal-subheading">Professional Conduct</h3>
        <p className="legal-body">
          All users are expected to conduct themselves professionally and respectfully. This includes maintaining a safe driving environment, being punctual for scheduled pickups, communicating schedule changes promptly, and treating all parties with courtesy and respect.
        </p>

        {/* ── 7. Contact ───────────────────────────────── */}
        <h2 className="legal-heading">7. Contact</h2>
        <p className="legal-body">
          For questions about these Conditions of Use, contact us:
        </p>
        <div className="legal-contact">
          <p><strong>ThyFreelancers Inc.</strong></p>
          <p>Houston, Texas</p>
          <p>Email: <a href="mailto:support@thybarbershop.com">support@thybarbershop.com</a></p>
          <p>Website: <a href="https://thybarbershop.com" target="_blank" rel="noopener noreferrer">thybarbershop.com</a></p>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="legal-footer">
        <div>
          &copy; 2026 ThyBarberShop &middot; ThyFreelancers Inc.
        </div>
        <div className="legal-footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/conditions">Conditions</Link>
        </div>
      </footer>
    </div>
  );
}
