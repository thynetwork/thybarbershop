import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — ThyBarberShop',
  description: 'ThyBarberShop privacy policy. How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
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
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last Updated: April 2026</p>

        <p className="legal-intro">
          ThyBarberShop (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is operated by ThyFreelancers Inc., headquartered in Houston, Texas. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the ThyBarberShop platform, including our website at thybarbershop.com and any associated mobile applications or services.
        </p>

        {/* ── 1. Information We Collect ──────────────────── */}
        <h2 className="legal-heading">1. Information We Collect</h2>
        <p className="legal-body">We collect information that you voluntarily provide when creating an account, booking a ride, or interacting with the platform:</p>
        <ul className="legal-list">
          <li><strong>Account Information:</strong> Full name, email address, phone number, and account credentials.</li>
          <li><strong>Payment Information:</strong> Payment method details you choose to display on your profile (for drivers) or use for platform fees (for all users). This may include Zelle, Venmo, Cash App handles, or Stripe billing details for subscription and matching fees.</li>
          <li><strong>Location Data:</strong> Airport codes, pickup and dropoff addresses associated with bookings, and home airport preferences.</li>
          <li><strong>Driver Credentials:</strong> For driver accounts, we collect the last four digits of your driver&rsquo;s license number, insurance provider and policy information, vehicle details (make, model, year, color), and vehicle photographs.</li>
          <li><strong>Safety Protocol Data:</strong> Emergency contact information, identification verification data, and safety acknowledgments submitted by both clients and drivers.</li>
          <li><strong>Communications:</strong> Messages sent through the platform, booking requests, and support inquiries.</li>
          <li><strong>Device &amp; Usage Data:</strong> Browser type, IP address, pages visited, and session duration for platform functionality and security.</li>
        </ul>

        {/* ── 2. How We Use Your Information ─────────────── */}
        <h2 className="legal-heading">2. How We Use Your Information</h2>
        <p className="legal-body">We use the information we collect for the following purposes:</p>
        <ul className="legal-list">
          <li><strong>Booking Facilitation:</strong> To connect clients with their designated drivers, process booking requests, and display scheduling information.</li>
          <li><strong>Notifications:</strong> To send booking confirmations, reminders, driver alerts, schedule changes, and account-related notifications via email and SMS.</li>
          <li><strong>Safety Protocol:</strong> To maintain and enforce our mutual Safety Protocol, including encrypted storage of emergency contact data accessible only to ThyBarberShop administrators in emergency situations.</li>
          <li><strong>Account Management:</strong> To create and maintain your account, process subscription payments (drivers), and process matching fees (clients using Find a Driver).</li>
          <li><strong>Platform Improvement:</strong> To analyze usage patterns, improve the booking experience, and maintain platform security.</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
        </ul>

        {/* ── 3. Information Sharing ────────────────────── */}
        <h2 className="legal-heading">3. Information Sharing</h2>
        <p className="legal-body">ThyBarberShop does not sell, rent, or trade your personal information to third parties. We share information only in the following limited circumstances:</p>
        <ul className="legal-list">
          <li><strong>Between Connected Clients and Drivers:</strong> When a client and driver are connected via a driver code, limited profile information (name, contact details, vehicle information, and booking details) is shared between the two parties to facilitate the ride.</li>
          <li><strong>Driver Pool Browsing:</strong> Drivers who opt into the public driver pool make limited profile information visible to prospective clients, including name, vehicle class, airport coverage, availability, and rate ranges. Contact information is not displayed during pool browsing.</li>
          <li><strong>Service Providers:</strong> We use Twilio for SMS notifications and Stripe for payment processing. These providers receive only the data necessary to perform their services and are bound by their own privacy policies.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law, subpoena, court order, or government request, or if we believe disclosure is necessary to protect the rights, safety, or property of ThyBarberShop, our users, or the public.</li>
        </ul>

        {/* ── 4. Safety Protocol Data ───────────────────── */}
        <h2 className="legal-heading">4. Safety Protocol Data</h2>
        <p className="legal-body">
          Our Safety Protocol requires both clients and drivers to submit emergency contact information and identification details before their first ride. This data is treated with the highest level of security:
        </p>
        <ul className="legal-list">
          <li>All Safety Protocol data is encrypted at rest and in transit using industry-standard AES-256 encryption.</li>
          <li>Safety Protocol records are accessible only to authorized ThyBarberShop administrators.</li>
          <li>Emergency contact information is accessed only in genuine emergency situations or when required by law enforcement.</li>
          <li>Neither clients nor drivers can view each other&rsquo;s Safety Protocol submissions directly. The platform displays only a confirmation that the other party has completed the protocol.</li>
        </ul>

        {/* ── 5. Driver Credentials ─────────────────────── */}
        <h2 className="legal-heading">5. Driver Credentials</h2>
        <p className="legal-body">
          Driver credential information, including the last four digits of driver&rsquo;s license numbers and insurance policy details, is collected to verify that drivers meet ThyBarberShop&rsquo;s standards. This information is:
        </p>
        <ul className="legal-list">
          <li>Encrypted and stored securely with access restricted to ThyBarberShop administrators only.</li>
          <li>Never displayed to clients. Clients see only a verification badge confirming the driver&rsquo;s credentials have been reviewed and approved.</li>
          <li>Used solely for verification and compliance purposes.</li>
          <li>Subject to periodic re-verification to ensure ongoing compliance.</li>
        </ul>

        {/* ── 6. Payment Information ────────────────────── */}
        <h2 className="legal-heading">6. Payment Information</h2>
        <p className="legal-body">
          ThyBarberShop operates as a platform facilitator, not a payment processor for ride fares. It is important to understand our payment model:
        </p>
        <ul className="legal-list">
          <li><strong>Ride Payments:</strong> All ride payments are made directly between the client and the driver. ThyBarberShop does not process, hold, collect, or transfer ride fare payments. The payment methods displayed on a driver&rsquo;s profile (Zelle, Venmo, Cash App, etc.) are the driver&rsquo;s own personal accounts.</li>
          <li><strong>Subscription Fees:</strong> Driver subscription fees ($9.99/week) are billed directly via Stripe. ThyBarberShop stores only the Stripe customer ID and subscription status, not your full card number.</li>
          <li><strong>Matching Fees:</strong> The one-time $9.99 Find a Driver matching fee is processed via Stripe with the same security standards.</li>
        </ul>

        {/* ── 7. SMS / Text Messages ───────────────────── */}
        <h2 className="legal-heading">7. SMS / Text Messages</h2>
        <p className="legal-body">
          By creating a ThyBarberShop account and providing your phone number, you consent to receive SMS/text message notifications related to your account and booking activity. Details:
        </p>
        <ul className="legal-list">
          <li>Messages are sent via Twilio from our registered number (+1 620-254-8664).</li>
          <li>Message types include: booking confirmations, driver alerts, ride reminders, schedule changes, and account security notifications.</li>
          <li>Message frequency varies based on your booking activity.</li>
          <li>Standard message and data rates from your carrier may apply.</li>
          <li>You may opt out of SMS notifications at any time by replying <strong>STOP</strong> to any message. You will receive a single confirmation message and no further texts.</li>
          <li>Reply <strong>HELP</strong> to any message for support information.</li>
          <li>Opting out of SMS does not affect your ability to use the platform, but you may miss time-sensitive booking notifications.</li>
        </ul>

        {/* ── 8. Data Retention ─────────────────────────── */}
        <h2 className="legal-heading">8. Data Retention</h2>
        <p className="legal-body">We retain your personal information as follows:</p>
        <ul className="legal-list">
          <li><strong>Active Accounts:</strong> Your data is retained for as long as your account remains active and in good standing.</li>
          <li><strong>Inactive Accounts:</strong> Accounts with no login activity for 12 consecutive months may be flagged for review. We will notify you before taking any action.</li>
          <li><strong>Account Deletion:</strong> When you request account deletion, we remove your personal data within 30 days. Certain records may be retained longer if required by law or for legitimate business purposes (e.g., completed booking records for tax or dispute resolution).</li>
          <li><strong>Safety Protocol Records:</strong> Safety Protocol data associated with completed bookings may be retained for up to 12 months after the last booking for safety and liability purposes.</li>
        </ul>

        {/* ── 9. Cookies & Tracking ─────────────────────── */}
        <h2 className="legal-heading">9. Cookies &amp; Tracking</h2>
        <p className="legal-body">ThyBarberShop uses minimal tracking technologies:</p>
        <ul className="legal-list">
          <li><strong>Session Cookies:</strong> We use session cookies to maintain your login state and remember your preferences during a browsing session. These expire when you close your browser or after your session times out.</li>
          <li><strong>Authentication Tokens:</strong> Secure tokens are used to keep you logged in across visits if you choose to stay signed in.</li>
          <li><strong>No Third-Party Tracking:</strong> ThyBarberShop does not use third-party advertising trackers, analytics pixels, or social media tracking scripts. We do not build advertising profiles or share browsing data with ad networks.</li>
        </ul>

        {/* ── 10. Children's Privacy ────────────────────── */}
        <h2 className="legal-heading">10. Children&rsquo;s Privacy</h2>
        <p className="legal-body">
          ThyBarberShop is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a user is under 18, we will promptly deactivate their account and delete their personal information. If you believe a minor has created an account on ThyBarberShop, please contact us immediately at support@thybarbershop.com.
        </p>

        {/* ── 11. Your Rights ──────────────────────────── */}
        <h2 className="legal-heading">11. Your Rights</h2>
        <p className="legal-body">You have the following rights regarding your personal information:</p>
        <ul className="legal-list">
          <li><strong>Access:</strong> You may request a copy of the personal information we hold about you at any time.</li>
          <li><strong>Update:</strong> You may update your account information directly through your ThyBarberShop dashboard, or contact us for assistance with data that cannot be self-edited.</li>
          <li><strong>Delete:</strong> You may request deletion of your account and personal data. Deletion requests are processed within 30 days.</li>
          <li><strong>Opt Out of Communications:</strong> You may opt out of SMS notifications by replying STOP, and manage email preferences in your account settings.</li>
          <li><strong>Data Portability:</strong> You may request an export of your data in a commonly used format.</li>
        </ul>
        <p className="legal-body">
          To exercise any of these rights, contact us at support@thybarbershop.com. We will respond to your request within 30 days.
        </p>

        {/* ── 12. Security ─────────────────────────────── */}
        <h2 className="legal-heading">12. Security</h2>
        <p className="legal-body">
          We implement industry-standard security measures to protect your information, including encryption in transit (TLS 1.2+), encryption at rest (AES-256), role-based access controls, and regular security reviews. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        {/* ── 13. Changes to This Policy ────────────────── */}
        <h2 className="legal-heading">13. Changes to This Policy</h2>
        <p className="legal-body">
          We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email or a prominent notice on our platform. Your continued use of ThyBarberShop after any changes constitutes acceptance of the revised policy. The &ldquo;Last Updated&rdquo; date at the top of this page reflects the most recent revision.
        </p>

        {/* ── 14. Contact Us ───────────────────────────── */}
        <h2 className="legal-heading">14. Contact Us</h2>
        <p className="legal-body">
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
