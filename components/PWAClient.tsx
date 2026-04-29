'use client';

/* ============================================================
   PWAClient — mounted once in the root layout. Registers the
   service worker, handles the "Add to Home Screen" install
   prompt (shown on the second visit), and provides a global
   hamburger toggle for the sidebar at <= 48rem widths.
   No px units — rem and em only.
   ============================================================ */

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const VISIT_KEY = 'tbs-visit-count';
const INSTALL_DISMISSED_KEY = 'tbs-install-dismissed';
const INSTALL_NEVER_KEY = 'tbs-install-never';

export default function PWAClient() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Service-worker registration.
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  // Bump visit count, decide whether to show the install banner on visit 2+.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(INSTALL_NEVER_KEY) === '1') return;
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === '1';
      if (visits >= 2 && !dismissed) setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  // Toggle a body class so the global mobile CSS can show/hide the sidebar.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('tbs-nav-open', navOpen);
    return () => document.body.classList.remove('tbs-nav-open');
  }, [navOpen]);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setShowInstall(false);
    setInstallEvent(null);
  }

  function dismissOnce() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    setShowInstall(false);
  }

  function dismissForever() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(INSTALL_NEVER_KEY, '1');
    setShowInstall(false);
  }

  return (
    <>
      {/* Hamburger — visible only at narrow widths (CSS-driven). */}
      <button
        type="button"
        className="tbs-nav-toggle"
        aria-label={navOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={navOpen}
        onClick={() => setNavOpen((o) => !o)}
      >
        <span></span><span></span><span></span>
      </button>

      {/* Backdrop covers content when sidebar is open on mobile. */}
      {navOpen && <button type="button" className="tbs-nav-backdrop" aria-label="Close menu" onClick={() => setNavOpen(false)} />}

      {/* Install prompt — visit 2+ only, until dismissed. */}
      {showInstall && (
        <div className="tbs-install-banner" role="dialog" aria-label="Add to Home Screen">
          <div className="tbs-install-icon">Thy<span>BS</span></div>
          <div className="tbs-install-body">
            <div className="tbs-install-title">Add ThyBarberShop to your Home Screen</div>
            <div className="tbs-install-sub">Faster, full-screen, and works offline.</div>
          </div>
          <button type="button" className="tbs-install-add" onClick={handleInstall}>Add</button>
          <button type="button" className="tbs-install-dismiss" onClick={dismissOnce} aria-label="Not now">×</button>
          <button type="button" className="tbs-install-never" onClick={dismissForever}>Never show</button>
        </div>
      )}
    </>
  );
}
