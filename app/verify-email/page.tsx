'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const RESEND_SECONDS = 60;

function VerifyEmailContent() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || 'rayford@email.com';

  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [toast, setToast] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function resendEmail() {
    setSeconds(RESEND_SECONDS);
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    showToast(`Confirmation email resent to ${emailParam}`);
  }

  return (
    <>
      <style>{`
        .ev-shell{min-height:100vh;background:#F7F7F8;color:#111118;font-family:'DM Sans',sans-serif;}
        .ev-topbar{background:#0a0a2e;height:3.5rem;display:flex;align-items:center;padding:0 2rem;}
        .ev-topbar-logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;text-decoration:none;}
        .ev-topbar-logo span{color:#F5A623;}
        .ev-main{max-width:26rem;margin:0 auto;padding:3rem 1.5rem 4rem;text-align:center;animation:ev-fade .25s ease both;}
        @keyframes ev-fade{from{opacity:0;transform:translateY(.375rem);}to{opacity:1;transform:translateY(0);}}

        .ev-icon{width:10rem;height:10rem;border-radius:50%;background:rgba(245,166,35,.08);border:2px solid rgba(245,166,35,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 1.75rem;}

        .ev-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#111118;margin-bottom:.4rem;}
        .ev-sub{font-size:.88rem;color:#5A5A6A;line-height:1.7;margin-bottom:.5rem;}
        .ev-addr{font-family:'DM Mono',monospace;font-size:.9rem;font-weight:500;color:#0a0a2e;background:#F7F7F8;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.6rem 1.25rem;display:inline-block;margin-bottom:2rem;}

        .ev-steps{background:#fff;border:1.5px solid rgba(0,0,0,.09);border-radius:1.25rem;padding:1.25rem;margin-bottom:1.75rem;text-align:left;box-shadow:0 .25rem 1rem rgba(0,0,0,.07);}
        .ev-step-row{display:flex;align-items:flex-start;gap:.85rem;padding:.6rem 0;border-bottom:1px solid rgba(0,0,0,.09);}
        .ev-step-row:last-child{border-bottom:none;}
        .ev-step-num{width:1.6rem;height:1.6rem;border-radius:50%;background:#0a0a2e;color:#F5A623;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:.68rem;flex-shrink:0;margin-top:.1rem;}
        .ev-step-text{font-size:.82rem;color:#5A5A6A;line-height:1.6;}
        .ev-step-text strong{color:#111118;}

        .ev-resend-wrap{margin-bottom:.75rem;}
        .ev-resend-btn{background:none;border:none;font-size:.82rem;font-weight:600;color:#D4830A;cursor:pointer;font-family:inherit;}
        .ev-resend-btn:hover{color:#F5A623;}
        .ev-resend-btn:disabled{color:#9A9AAA;cursor:default;}
        .ev-countdown{font-size:.78rem;color:#9A9AAA;}

        .ev-change{font-size:.75rem;color:#9A9AAA;cursor:pointer;background:none;border:none;display:block;margin:0 auto;font-family:inherit;}
        .ev-change:hover{color:#5A5A6A;}

        .ev-spam{font-size:.68rem;color:#9A9AAA;margin-top:1.5rem;line-height:1.7;}

        .ev-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.7rem 1.4rem;border-radius:2rem;font-size:.82rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="ev-shell">
        <nav className="ev-topbar">
          <Link href="/" className="ev-topbar-logo">{prefix}<span>{highlight}</span></Link>
        </nav>

        <div className="ev-main">
          <div className="ev-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D4830A" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <div className="ev-title">Check your email</div>
          <div className="ev-sub">We sent a confirmation link to</div>
          <div className="ev-addr">{emailParam}</div>

          <div className="ev-steps">
            <div className="ev-step-row">
              <div className="ev-step-num">1</div>
              <div className="ev-step-text"><strong>Open the email</strong> from {config.serviceName} in your inbox.</div>
            </div>
            <div className="ev-step-row">
              <div className="ev-step-num">2</div>
              <div className="ev-step-text"><strong>Tap the confirmation link.</strong> It takes you directly to the next step.</div>
            </div>
            <div className="ev-step-row">
              <div className="ev-step-num">3</div>
              <div className="ev-step-text"><strong>Verify your phone number</strong> with a 6-digit code we&rsquo;ll send by text.</div>
            </div>
          </div>

          <div className="ev-resend-wrap">
            <button type="button" className="ev-resend-btn" onClick={resendEmail} disabled={seconds > 0}>Resend email</button>
            {seconds > 0 && (
              <div className="ev-countdown">Resend available in <span>{seconds}</span>s</div>
            )}
          </div>

          <button type="button" className="ev-change" onClick={() => router.push('/register/rider')}>
            Wrong email address? Change it →
          </button>

          <div className="ev-spam">
            Can&rsquo;t find it? Check your spam or junk folder.<br/>
            The link expires in 24 hours.
          </div>
        </div>

        {toast && <div className="ev-toast">{toast}</div>}
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
