import { NextRequest, NextResponse } from 'next/server';

/* ── Demo data — replace with DB queries ─── */
const DEMO_PAYMENTS = {
  stats: {
    monthTotal: 1840,
    rides: 22,
    pending: 1,
    month: 'July',
  },
  payments: [
    {
      id: 'p1',
      clientName: 'Sarah Chen',
      clientInitials: 'SC',
      date: '2026-07-17',
      route: 'Airport to Home',
      amount: 120,
      status: 'paid',
    },
    {
      id: 'p2',
      clientName: 'Lisa Morales',
      clientInitials: 'LM',
      date: '2026-07-18',
      route: 'Home to office',
      amount: 45,
      status: 'paid',
    },
    {
      id: 'p3',
      clientName: 'Dana Torres',
      clientInitials: 'DT',
      date: '2026-07-19',
      route: 'Houston \u2192 Austin',
      amount: 210,
      status: 'pending',
    },
    {
      id: 'p4',
      clientName: 'Marcus Johnson',
      clientInitials: 'MJ',
      date: '2026-07-14',
      route: 'Airport pickup',
      amount: 95,
      status: 'paid',
    },
    {
      id: 'p5',
      clientName: 'Sarah Chen',
      clientInitials: 'SC',
      date: '2026-07-10',
      route: 'Airport to Home \u00b7 No-show waived',
      amount: 0,
      status: 'waived',
    },
  ],
  topClients: [
    { name: 'Sarah Chen', total: 720 },
    { name: 'Marcus Johnson', total: 380 },
    { name: 'Dana Torres', total: 295 },
    { name: 'Lisa Morales', total: 270 },
  ],
};

export async function GET(request: NextRequest) {
  // In production: authenticate, parse filters from searchParams, query DB
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const clientId = searchParams.get('clientId');
  const month = searchParams.get('month');

  let filteredPayments = [...DEMO_PAYMENTS.payments];

  if (filter === 'by-client' && clientId) {
    filteredPayments = filteredPayments.filter(
      (p) => p.clientInitials === clientId
    );
  }

  if (filter === 'month' && month) {
    // In production: filter by actual month
    // Demo returns all
  }

  return NextResponse.json({
    ...DEMO_PAYMENTS,
    payments: filteredPayments,
  });
}
