import { NextRequest, NextResponse } from 'next/server';

/* ── Demo data — replace with DB queries ─── */
const DEMO_SETTINGS = {
  defaults: {
    cancellation: 'Standard',
    waitTimeCharge: 'Off',
    noShow: 'Charge',
    planeDelay: 'No charge',
  },
  clients: [
    {
      id: 'sc',
      name: 'Sarah Chen',
      initials: 'SC',
      rides: 47,
      description: 'Weekly client \u00b7 Airport specialist',
      setAmount: 120,
      policies: {
        cancellation: 'Flexible',
        waitTimeCharge: 'Off',
        noShow: 'Waive once',
        planeDelay: 'No charge',
      },
    },
    {
      id: 'dt',
      name: 'Dana Torres',
      initials: 'DT',
      rides: 8,
      description: 'Long haul routes \u00b7 Austin runs',
      setAmount: null,
      policies: {
        cancellation: 'Standard',
        waitTimeCharge: 'On',
        waitType: '$/min',
        freeMinutes: 10,
        noShow: 'Charge',
        planeDelay: 'Charge',
      },
    },
  ],
};

export async function GET() {
  // In production: authenticate, query DB
  return NextResponse.json(DEMO_SETTINGS);
}

export async function PATCH(request: NextRequest) {
  // In production: authenticate, validate, update DB
  const body = await request.json();
  const { clientId, field, value, scope } = body;

  if (scope === 'defaults') {
    // Update default policies
    return NextResponse.json({
      success: true,
      message: `Default ${field} updated to ${value}`,
    });
  }

  if (clientId && field) {
    // Update per-client policy
    return NextResponse.json({
      success: true,
      message: `${field} for client ${clientId} updated to ${value}`,
    });
  }

  return NextResponse.json(
    { error: 'Missing required fields: clientId, field, value' },
    { status: 400 }
  );
}
