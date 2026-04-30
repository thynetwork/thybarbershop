'use client';

import Link from 'next/link';
import config from '@/lib/config';

interface Props {
  activeItem?: string;
  pendingCount?: number;
}

const NAV_ITEMS = [
  { icon: '\u229e', label: 'Dashboard', href: '/dashboard' },
  { icon: '\uD83D\uDCC5', label: 'Calendar', href: '/calendar' },
  { icon: '\uD83D\uDC65', label: 'Clients', href: '/clients' },
  { icon: '\uD83D\uDCB0', label: 'Payment log', href: '/payments' },
  { icon: '\uD83D\uDD17', label: 'Share code', href: '/share' },
  { icon: '\uD83D\uDC64', label: 'Profile', href: '/edit-profile' },
  { icon: '\u2699', label: 'Settings', href: '/settings' },
];

export default function BarberSidebar({ activeItem = 'Dashboard', pendingCount = 0 }: Props) {
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <nav className="side-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`side-link${item.label === activeItem ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span className="side-icon">{item.icon}</span>
            {item.label}
            {item.label === 'Clients' && pendingCount > 0 && (
              <span className="side-badge">{pendingCount}</span>
            )}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <div className="sub-banner">
          <div className="sub-text">${config.subscriptionAmount}/week &middot; Active</div>
          <div className="sub-pill">Renews Fri</div>
        </div>
      </div>
    </div>
  );
}
