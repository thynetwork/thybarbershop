import { NextResponse } from 'next/server';

/* ── Demo data — replace with DB queries ─── */
const DEMO_DASHBOARD = {
  stats: {
    thisWeek: 420,
    thisMonth: 1840,
    pendingRequests: 2,
    activeClients: 14,
  },
  insurance: {
    provider: 'Allstate',
    coverageType: 'Rideshare',
    policyActive: true,
  },
  bookingRequests: [
    {
      id: 'bk-1',
      clientName: 'Sarah Chen',
      clientInitials: 'SC',
      route: 'Airport to Home',
      date: '2026-07-17',
      time: '9:00 AM',
      amount: 120,
      type: 'set_amount',
    },
    {
      id: 'bk-2',
      clientName: 'Dana Torres',
      clientInitials: 'DT',
      route: 'Houston \u2192 Austin',
      date: '2026-07-19',
      time: null,
      amount: null,
      type: 'new_destination',
    },
  ],
  clientRequests: [
    {
      id: 'cr-1',
      name: 'Tom Williams',
      initials: 'TW',
      referredBy: 'Sarah Chen',
    },
  ],
  upcomingBookings: [
    {
      id: 'up-1',
      clientName: 'Sarah Chen',
      clientInitials: 'SC',
      date: '2026-07-17',
      time: '9:00 AM',
      route: 'Airport to Home',
      amount: 120,
      type: 'set_amount',
      status: 'confirmed',
    },
    {
      id: 'up-2',
      clientName: 'Lisa Morales',
      clientInitials: 'LM',
      date: '2026-07-18',
      time: '7:00 AM',
      route: 'Home to office',
      amount: 45,
      type: 'hourly',
      status: 'confirmed',
    },
  ],
  credentials: {
    safetyProtocol: 'complete',
    barbersLicense: 'verified',
    airportPermit: 'active',
    insurance: 'Allstate',
  },
  // License renewal — DD1A banner reads these. licenseExpiry is ISO yyyy-mm-dd
  // or null if no license is on file (e.g., barber registered without uploading).
  licenseNumber: 'TX-BBR-0042871',
  licenseExpiry: (() => {
    // Demo: 14 days from now so the banner triggers in dev.
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  })(),
  licenseVerified: true,
  todaySchedule: [],
};

export async function GET() {
  // In production: authenticate, query DB for this barber's data
  return NextResponse.json(DEMO_DASHBOARD);
}
