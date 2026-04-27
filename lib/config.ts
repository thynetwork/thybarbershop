/* ============================================================
   THYFREELANCER — Multi-Tenant Configuration
   Reads environment variables with ThyDriver defaults.
   Every reference to service name, labels, colors comes from here.
   ============================================================ */

export interface SiteConfig {
  /** Display name — e.g. "ThyDriver" */
  serviceName: string;
  /** Lowercase type key — e.g. "driver" */
  serviceType: string;
  /** URL slug — e.g. "thydriver" */
  serviceSlug: string;
  /** Brand accent color — e.g. "#F5A623" */
  accentColor: string;
  /** Tagline shown on login — e.g. "Your Driver. Every Airport." */
  tagline: string;
  /** What the provider is called — e.g. "Driver" */
  providerLabel: string;
  /** What the client is called — e.g. "Rider" */
  clientLabel: string;
  /** Driver code prefix — e.g. "DR" */
  codePrefix: string;
  /** Code format — 'airport' = 3-part (airport+initials+digits), 'classic' = 2-part (initials+digits) */
  codeFormat: 'airport' | 'classic';
  /** Featured airport codes shown on login page */
  airportCodes: string[];
  /** Weekly subscription amount in dollars */
  subscriptionAmount: number;
  /** Domain — e.g. "thydriver.com" */
  domain: string;
  /** Copyright year */
  copyrightYear: number;
  /** Company name */
  companyName: string;
}

function env(key: string, fallback: string): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

export const config: SiteConfig = {
  serviceName: env('NEXT_PUBLIC_SERVICE_NAME', 'ThyDriver'),
  serviceType: env('NEXT_PUBLIC_SERVICE_TYPE', 'driver'),
  serviceSlug: env('NEXT_PUBLIC_SERVICE_SLUG', 'thydriver'),
  accentColor: env('NEXT_PUBLIC_ACCENT_COLOR', '#F5A623'),
  tagline: env('NEXT_PUBLIC_TAGLINE', 'Your Driver. Every Airport.'),
  providerLabel: env('NEXT_PUBLIC_PROVIDER_LABEL', 'Driver'),
  clientLabel: env('NEXT_PUBLIC_CLIENT_LABEL', 'Rider'),
  codePrefix: env('NEXT_PUBLIC_CODE_PREFIX', 'DR'),
  codeFormat: 'airport',
  airportCodes: ['IAH', 'HOU', 'MCO', 'LAX', 'ATL', 'ORD', 'DFW', 'JFK', 'MIA'],
  subscriptionAmount: parseFloat(env('NEXT_PUBLIC_SUBSCRIPTION_AMOUNT', '9.99')),
  domain: env('NEXT_PUBLIC_DOMAIN', 'thydriver.com'),
  copyrightYear: 2026,
  companyName: 'ThyNetwork Inc.',
};

/** Split "ThyDriver" into {prefix:"Thy", highlight:"Driver"} for styled logos */
export function splitServiceName(name?: string): { prefix: string; highlight: string } {
  const n = name ?? config.serviceName;
  if (n.startsWith('Thy')) {
    return { prefix: 'Thy', highlight: n.slice(3) };
  }
  return { prefix: '', highlight: n };
}

/** Feature bullets shown on login left panel — customisable per service type */
export function getLoginFeatures(): string[] {
  const pl = config.providerLabel.toLowerCase();
  return [
    `Your trusted ${pl} at your home airport — and every airport you fly to`,
    `Invite-only. Your ${pl} shared a personal code with you.`,
    `Pay directly via Zelle, Venmo, Cash App — no commission cut`,
    `Insured ${pl}s. Safety Protocol for both parties.`,
  ];
}

export default config;
