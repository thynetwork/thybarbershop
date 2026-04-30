import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — ThyBarberShop',
  description: 'ThyBarberShop terms of service. Rules, responsibilities, and policies for using the platform.',
};

export default function TermsPage() {
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
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last Updated: April 2026</p>

        <p className="legal-intro">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the ThyBarberShop platform, operated by ThyFreelancers Inc. (&ldquo;ThyBarberShop,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account or using our services, you agree to be bound by these Terms. If you do not agree, do not use the platform.
        </p>

        {/* ── 1. Acceptance of Terms ────────────────────── */}
        <h2 className="legal-heading">1. Acceptance of Terms</h2>
        <p className="legal-body">
          By accessing or using ThyBarberShop, you confirm that you are at least 18 years of age, that you have read and understood these Terms, and that you agree to be legally bound by them. If you are using ThyBarberShop on behalf of a business or other entity, you represent that you have the authority to bind that entity to these Terms.
        </p>

        {/* ── 2. Service Description ───────────────────── */}
        <h2 className="legal-heading">2. Service Description</h2>
        <p className="legal-body">
          ThyBarberShop is a private booking platform that connects independent barbers with their clients. ThyBarberShop provides the technology platform for scheduling, communication, and coordination between barbers and clients. Key aspects of our service:
        </p>
        <ul className="legal-list">
          <li>ThyBarberShop is a platform facilitator, not a transportation company. We do not employ, contract, or supervise barbers.</li>
          <li>Barbers on ThyBarberShop are independent professionals who set their own rates, schedules, and service areas.</li>
          <li>All ride services are provided directly by the barber to the client. ThyBarberShop does not provide, guarantee, or insure any transportation service.</li>
          <li>The platform enables barbers to share personalized booking codes with their existing clients and, optionally, to be discovered by new clients through the barber pool.</li>
        </ul>

        {/* ── 3. User Accounts ─────────────────────────── */}
        <h2 className="legal-heading">3. User Accounts</h2>
        <p className="legal-body">ThyBarberShop supports two account types:</p>
        <ul className="legal-list">
          <li><strong>Client Accounts:</strong> Created by individuals who wish to book rides with barbers on the platform. Clients must have a valid barber code from an active ThyBarberShop barber to log in, or may use the Find a Barber feature to be matched with a barber.</li>
          <li><strong>Barber Accounts:</strong> Created by independent barbers who wish to use ThyBarberShop to manage their client bookings, share their barber code, and optionally list in the barber pool.</li>
        </ul>
        <p className="legal-body">You are responsible for:</p>
        <ul className="legal-list">
          <li>Providing accurate and truthful information during registration and maintaining up-to-date account details.</li>
          <li>Maintaining the confidentiality of your account credentials. You are responsible for all activity under your account.</li>
          <li>Notifying ThyBarberShop immediately if you suspect unauthorized access to your account.</li>
        </ul>

        {/* ── 4. Barber Code System ────────────────────── */}
        <h2 className="legal-heading">4. Barber Code System</h2>
        <p className="legal-body">
          Each barber on ThyBarberShop is assigned a unique barber code (e.g., South Houston·TX·MRC·3341) that identifies their city, state, initials, and a unique numeric identifier. The barber code system is central to how ThyBarberShop operates:
        </p>
        <ul className="legal-list">
          <li><strong>Invite-Only Access:</strong> Clients access a specific barber&rsquo;s booking page by entering that barber&rsquo;s code. This ensures that barbers control who can book with them.</li>
          <li><strong>Anti-Poaching Protection:</strong> Barber codes are proprietary to ThyBarberShop. Clients who discover a barber through the ThyBarberShop platform (including the barber pool) must book through the platform. Soliciting a barber&rsquo;s personal contact information to circumvent the platform during the pool browsing process is prohibited.</li>
          <li><strong>Code Ownership:</strong> Barber codes remain the property of ThyBarberShop. Upon account termination, the code is retired and will not be reassigned.</li>
        </ul>

        {/* ── 5. Booking & Payments ────────────────────── */}
        <h2 className="legal-heading">5. Booking &amp; Payments</h2>
        <p className="legal-body">
          ThyBarberShop facilitates the booking process but does not process ride payments:
        </p>
        <ul className="legal-list">
          <li><strong>Booking:</strong> Clients submit booking requests through the platform specifying date, time, pickup and dropoff locations, and ride type. Barbers accept or decline requests at their discretion.</li>
          <li><strong>Rates:</strong> Barbers set their own rates. ThyBarberShop displays rate information as provided by the barber. ThyBarberShop does not set, negotiate, or guarantee pricing.</li>
          <li><strong>Ride Payments:</strong> All ride payments are made directly between the client and barber using the barber&rsquo;s preferred payment methods (Zelle, Venmo, Cash App, or cash). ThyBarberShop does not process, hold, or transfer ride fare payments.</li>
          <li><strong>Platform Fees:</strong> ThyBarberShop charges platform fees (subscription fees for barbers, matching fees for clients) separately from ride payments. These are processed via Stripe.</li>
        </ul>

        {/* ── 6. Subscription ──────────────────────────── */}
        <h2 className="legal-heading">6. Subscription</h2>
        <p className="legal-body">
          Barbers pay a weekly subscription fee of $9.99 to maintain an active ThyBarberShop account. Subscription terms:
        </p>
        <ul className="legal-list">
          <li>Subscriptions are billed weekly and auto-renew unless cancelled.</li>
          <li>You may cancel your subscription at any time through your dashboard or by contacting support. Cancellation takes effect at the end of the current billing period.</li>
          <li>No refunds are provided for partial billing periods.</li>
          <li>If your subscription payment fails, your account may be placed on hold until payment is resolved. Existing bookings will be honored, but new bookings will be paused.</li>
          <li>ThyBarberShop reserves the right to change subscription pricing with 30 days&rsquo; advance notice.</li>
        </ul>

        {/* ── 7. Matching Fee ──────────────────────────── */}
        <h2 className="legal-heading">7. Matching Fee</h2>
        <p className="legal-body">
          Clients who use the Find a Barber feature to be matched with a new barber are charged a one-time matching fee of $9.99. This fee:
        </p>
        <ul className="legal-list">
          <li>Is charged at the time of match confirmation, processed via Stripe.</li>
          <li>Is non-refundable once a match has been made and a barber code has been issued to the client.</li>
          <li>Covers the matching service only. It does not include any ride fares or ongoing platform fees.</li>
          <li>Is waived for clients who already have a barber code from a barber on the platform.</li>
        </ul>

        {/* ── 8. Safety Protocol ───────────────────────── */}
        <h2 className="legal-heading">8. Safety Protocol</h2>
        <p className="legal-body">
          ThyBarberShop requires all clients and barbers to complete a mutual Safety Protocol before their first ride together. This is a mandatory requirement and cannot be bypassed:
        </p>
        <ul className="legal-list">
          <li>Both parties must submit emergency contact information and identity verification data.</li>
          <li>All Safety Protocol data is encrypted and accessible only to ThyBarberShop administrators.</li>
          <li>Safety Protocol data is used solely for emergency situations and is never shared with the other party or any third party except as required by law.</li>
          <li>Failure to complete the Safety Protocol will prevent booking confirmation.</li>
          <li>Submitting false or misleading Safety Protocol information is grounds for immediate account termination.</li>
        </ul>

        {/* ── 9. Insurance Requirements ────────────────── */}
        <h2 className="legal-heading">9. Insurance Requirements</h2>
        <p className="legal-body">
          All barbers on ThyBarberShop must maintain active and valid insurance coverage appropriate to their vehicle class:
        </p>
        <ul className="legal-list">
          <li><strong>Comfort and XL Classes:</strong> Minimum of a rideshare endorsement on your personal auto insurance policy.</li>
          <li><strong>Black and XLL Classes:</strong> Commercial livery insurance is required.</li>
          <li>Barbers must upload proof of insurance during registration and update it when policies are renewed.</li>
          <li>ThyBarberShop verifies insurance information but does not provide insurance coverage. Barbers are solely responsible for maintaining adequate coverage.</li>
          <li>Operating without valid insurance is a violation of these Terms and grounds for immediate suspension.</li>
        </ul>

        {/* ── 10. Cancellation Policy ──────────────────── */}
        <h2 className="legal-heading">10. Cancellation Policy</h2>
        <p className="legal-body">
          The following cancellation policy applies to confirmed bookings:
        </p>
        <ul className="legal-list">
          <li><strong>More than 24 hours before pickup:</strong> Free cancellation for both clients and barbers. No fee is charged.</li>
          <li><strong>Within 24 hours of pickup:</strong> A cancellation fee of 50% of the agreed ride fare may apply. The non-cancelling party is entitled to this fee as compensation for the late cancellation.</li>
          <li><strong>No-Show:</strong> If a client fails to appear at the pickup location within a reasonable time (as determined by the barber, typically 15 minutes), the full agreed fare may be charged.</li>
          <li>Cancellation fees are settled directly between the client and barber. ThyBarberShop facilitates communication but does not collect or enforce cancellation fees.</li>
          <li>Repeated cancellations may result in account review and potential restrictions.</li>
        </ul>

        {/* ── 11. Prohibited Conduct ───────────────────── */}
        <h2 className="legal-heading">11. Prohibited Conduct</h2>
        <p className="legal-body">The following conduct is prohibited on ThyBarberShop and may result in immediate account suspension or termination:</p>
        <ul className="legal-list">
          <li><strong>Fraud:</strong> Submitting false information, creating fake accounts, or engaging in any deceptive practices.</li>
          <li><strong>False Credentials:</strong> Providing fraudulent barber&rsquo;s license information, fake insurance documents, or misrepresenting vehicle details.</li>
          <li><strong>Harassment:</strong> Any form of harassment, discrimination, threats, or abusive behavior toward other users, ThyBarberShop staff, or third parties.</li>
          <li><strong>Platform Circumvention:</strong> Soliciting a barber&rsquo;s personal contact information during pool browsing to book rides outside the platform, or encouraging clients to leave the platform.</li>
          <li><strong>Unauthorized Use:</strong> Sharing your account credentials, using another person&rsquo;s account, or allowing unauthorized access to the platform.</li>
          <li><strong>Illegal Activity:</strong> Using ThyBarberShop for any unlawful purpose, including but not limited to transporting illegal goods or engaging in any criminal activity.</li>
          <li><strong>Data Scraping:</strong> Using automated tools to scrape, copy, or harvest data from the platform.</li>
        </ul>

        {/* ── 12. Limitation of Liability ──────────────── */}
        <h2 className="legal-heading">12. Limitation of Liability</h2>
        <p className="legal-body">
          ThyBarberShop is a technology platform that facilitates connections between independent barbers and clients. To the maximum extent permitted by law:
        </p>
        <ul className="legal-list">
          <li>ThyBarberShop does not employ, contract, control, or supervise any barber on the platform. Barbers are independent professionals responsible for their own conduct, vehicle maintenance, and compliance with local laws and regulations.</li>
          <li>ThyBarberShop is not liable for any damages, injuries, losses, or disputes arising from rides arranged through the platform, including but not limited to personal injury, property damage, or financial loss.</li>
          <li>ThyBarberShop makes no warranties, express or implied, regarding the quality, safety, legality, or reliability of any ride service provided by barbers on the platform.</li>
          <li>ThyBarberShop&rsquo;s total aggregate liability to you for any claims arising from your use of the platform shall not exceed the total fees you have paid to ThyBarberShop in the 12 months preceding the claim.</li>
          <li>ThyBarberShop is not responsible for the actions, omissions, or behavior of any user, whether client or barber.</li>
        </ul>

        {/* ── 13. Termination ──────────────────────────── */}
        <h2 className="legal-heading">13. Termination</h2>
        <p className="legal-body">
          Either party may terminate the relationship at any time:
        </p>
        <ul className="legal-list">
          <li><strong>By You:</strong> You may delete your account at any time through your dashboard settings or by contacting support@thybarbershop.com. For barbers, any remaining subscription period will not be refunded.</li>
          <li><strong>By ThyBarberShop:</strong> We reserve the right to suspend or terminate any account at our sole discretion, with or without cause, including but not limited to violations of these Terms, fraudulent activity, safety concerns, or non-payment of fees.</li>
          <li>Upon termination, your right to use the platform ceases immediately. Any pending bookings will be cancelled and the other party notified.</li>
          <li>Provisions of these Terms that by their nature should survive termination (including limitation of liability, governing law, and dispute resolution) will survive.</li>
        </ul>

        {/* ── 14. Governing Law ────────────────────────── */}
        <h2 className="legal-heading">14. Governing Law</h2>
        <p className="legal-body">
          These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the state or federal courts located in Harris County, Texas, and you consent to the personal jurisdiction of such courts.
        </p>

        {/* ── 15. Changes to Terms ─────────────────────── */}
        <h2 className="legal-heading">15. Changes to Terms</h2>
        <p className="legal-body">
          ThyBarberShop reserves the right to modify these Terms at any time. When we make material changes, we will provide notice via email or a prominent notice on the platform at least 14 days before the changes take effect. Your continued use of ThyBarberShop after the effective date constitutes acceptance of the revised Terms. If you do not agree with the changes, you must discontinue use and delete your account.
        </p>

        {/* ── 16. Contact ──────────────────────────────── */}
        <h2 className="legal-heading">16. Contact</h2>
        <p className="legal-body">
          For questions or concerns about these Terms of Service, please contact us:
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
