'use client';

import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const demoUser = { name: 'Dana Torres', initials: 'DT' };
const demoDriver = {
  name: 'James Rivera',
  initials: 'JR',
  code: 'JDR\u00B74207',
  phone: '(713) 555-0121',
  vehicle: '2022 Camry XSE',
  vehicleShort: '2022 Camry \u00B7 Silver',
  seats: 3,
  airportPermitted: true,
  insuranceProvider: 'Allstate',
  insuranceType: 'Rideshare',
};

export default function BookingConfirmedPage() {
  const router = useRouter();
  const { prefix, highlight } = splitServiceName();

  return (
    <div className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="topbar-logo">{prefix}<span>{highlight}</span></div>
        <div className="topbar-right">
          <div className="topbar-name">{demoUser.name}</div>
          <div className="topbar-avatar">{demoUser.initials}</div>
        </div>
      </div>

      <div className="layout-2col">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="main-content">
          {/* Photo pair */}
          <div className="photo-pair mb-20">
            <div className="photo-side">
              <div className="avatar av-amber av-xl av-check" style={{ margin: '0 auto' }}>
                {demoDriver.initials}
              </div>
              <div className="photo-role">Who is picking you up</div>
              <div className="photo-name">{demoDriver.name}</div>
              {demoDriver.airportPermitted && (
                <div style={{ marginTop: 6 }}>
                  <span className="badge badge-blue">&#9992; Airport permitted</span>
                </div>
              )}
            </div>
            <div className="photo-divider" />
            <div className="photo-side">
              <div className="avatar av-navy av-xl" style={{ margin: '0 auto' }}>
                {demoUser.initials}
              </div>
              <div className="photo-role">Who you are picking up</div>
              <div className="photo-name">{demoUser.name}</div>
              <div style={{ marginTop: 6 }}>
                <span className="badge badge-green">&#10003; Safety Protocol</span>
              </div>
            </div>
          </div>

          {/* Ride summary */}
          <div className="card mb-14">
            <div className="row">
              <span className="row-label">Route</span>
              <span className="row-value">Houston &rarr; Austin</span>
            </div>
            <div className="row">
              <span className="row-label">Date &amp; time</span>
              <span className="row-value">Sat Jul 19 &middot; 6:00 am</span>
            </div>
            <div className="row">
              <span className="row-label">Amount</span>
              <span className="row-value t-mono">$210 &middot; on pickup</span>
            </div>
            <div className="row">
              <span className="row-label">Vehicle</span>
              <span className="row-value">{demoDriver.vehicleShort}</span>
            </div>
            <div className="row">
              <span className="row-label">Insurance</span>
              <span className="badge badge-green">
                {demoDriver.insuranceProvider} &middot; {demoDriver.insuranceType}
              </span>
            </div>
          </div>

          {/* Cancellation reminder */}
          <div className="card-red-tint mb-14" style={{ fontSize: 12, color: 'var(--red)' }}>
            Cancellation within 24 hrs &mdash; 50% fee. No-show &mdash; full amount charged.
          </div>

          {/* SUPPORT button */}
          <button className="support-btn">&#9873; &nbsp; SUPPORT</button>
          <div className="support-sub">
            Call {config.providerLabel.toLowerCase()} &middot; Message {config.providerLabel.toLowerCase()} &middot; Contact {config.serviceName}
          </div>

          <button
            className="btn btn-ghost btn-full"
            onClick={() => router.push('/home')}
          >
            Book another trip &rarr;
          </button>
        </div>

        {/* ── Right panel ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="t-label mb-12">{config.providerLabel} info</div>

          <div className="ins-strip">
            <div className="ins-dot" />
            <div className="ins-text">
              {demoDriver.insuranceProvider} &middot; {demoDriver.insuranceType} &middot; Active
            </div>
          </div>

          <div className="card-surface mb-12">
            <div className="row">
              <span className="row-label">Code</span>
              <span className="row-value t-mono" style={{ color: 'var(--amber-dim)' }}>
                {demoDriver.code}
              </span>
            </div>
            <div className="row">
              <span className="row-label">Phone</span>
              <span className="row-value">{demoDriver.phone}</span>
            </div>
            <div className="row">
              <span className="row-label">Vehicle</span>
              <span className="row-value">{demoDriver.vehicle}</span>
            </div>
            <div className="row">
              <span className="row-label">Seats</span>
              <span className="row-value">{demoDriver.seats} passengers</span>
            </div>
          </div>

          <div className="t-label mb-8">Support options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              &#128222; &nbsp; Call {demoDriver.name.split(' ')[0]} directly
            </button>
            <button className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              &#128172; &nbsp; Message {demoDriver.name.split(' ')[0]}
            </button>
            <button className="btn btn-ghost btn-full" style={{ justifyContent: 'flex-start' }}>
              &#128737; &nbsp; Contact {config.serviceName} support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
