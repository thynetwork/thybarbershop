/* ============================================================
   THYFREELANCER — Multi-Tenant Configuration
   Reads environment variables with ThyBarberShop defaults.
   Every reference to service name, labels, colors comes from here.
   ============================================================ */

export interface SiteConfig {
  serviceName: string;
  serviceType: string;
  serviceSlug: string;
  accentColor: string;
  tagline: string;
  providerLabel: string;
  clientLabel: string;
  codePrefix: string;
  /** Code format — 'city' = 3-part (city+initials+digits), 'airport' = airport-based */
  codeFormat: 'city' | 'airport';
  /** First segment label for the code field */
  codeFirstLabel: string;
  /** Featured locations shown on login page */
  locationPills: string[];
  subscriptionAmount: number;
  domain: string;
  copyrightYear: number;
  companyName: string;
}

function env(key: string, fallback: string): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

export const config: SiteConfig = {
  serviceName: env('NEXT_PUBLIC_SERVICE_NAME', 'ThyBarberShop'),
  serviceType: env('NEXT_PUBLIC_SERVICE_TYPE', 'barber'),
  serviceSlug: env('NEXT_PUBLIC_SERVICE_SLUG', 'thybarbershop'),
  accentColor: env('NEXT_PUBLIC_ACCENT_COLOR', '#F5A623'),
  tagline: env('NEXT_PUBLIC_TAGLINE', 'The Chair Is Waiting.'),
  providerLabel: env('NEXT_PUBLIC_PROVIDER_LABEL', 'Barber'),
  clientLabel: env('NEXT_PUBLIC_CLIENT_LABEL', 'Client'),
  codePrefix: env('NEXT_PUBLIC_CODE_PREFIX', 'BR'),
  codeFormat: 'city',
  codeFirstLabel: 'City/Town',
  locationPills: ['Watts, CA', 'South Houston, TX', 'HTX', 'ATL', 'NYC'],
  subscriptionAmount: parseFloat(env('NEXT_PUBLIC_SUBSCRIPTION_AMOUNT', '9.99')),
  domain: env('NEXT_PUBLIC_DOMAIN', 'thybarbershop.com'),
  copyrightYear: 2026,
  companyName: 'ThyFreelancers Inc.',
};

/** Split "ThyBarberShop" into {prefix:"Thy", highlight:"BarberShop"} */
export function splitServiceName(name?: string): { prefix: string; highlight: string } {
  const n = name ?? config.serviceName;
  if (n.startsWith('Thy')) {
    return { prefix: 'Thy', highlight: n.slice(3) };
  }
  return { prefix: '', highlight: n };
}

/** Feature bullets shown on login left panel */
export function getLoginFeatures(): string[] {
  return [
    `These aren't customers. They're your clients. Treat them like it.`,
    `Your barber. Locked in. Every time. No strangers, no roulette.`,
    `Invite-only. Your barber's personal code gets you in.`,
    `Pay directly. No commission cut. No platform fees on your cut.`,
    `Licensed. Verified. Safety Protocol for both sides.`,
    `Find a Barber Away From Home. Verified barbers in every city — whenever you need one.`,
  ];
}

export default config;
