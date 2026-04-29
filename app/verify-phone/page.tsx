'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

const RESEND_SECONDS = 30;
const CORRECT = '847291'; // Demo · matches mockup

function VerifyPhoneContent() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get('phone') || '(713) 555-0199';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [toast, setToast] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    startCountdown();
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCountdown() {
    if (tickRef.current) clearInterval(tickRef.current);
    setSeconds(RESEND_SECONDS);
    tickRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function setDigit(idx: number, value: string) {
    const v = value.replace(/[^0-9]/g, '').slice(0, 1);
    setDigits(prev => {
      const next = [...prev];
      next[idx] = v;
      // Auto-advance focus.
      if (v && idx < 5) {
        setTimeout(() => inputRefs.current[idx + 1]?.focus(), 0);
      }
      // Submit when last digit lands.
      if (v && idx === 5) {
        setTimeout(() => checkCode(next.join('')), 0);
      }
      return next;
    });
    if (error) setError(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      setDigits(prev => {
        const next = [...prev];
        next[idx - 1] = '';
        return next;
      });
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    e.preventDefault();
    const next = pasted.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setDigits(next);
    const lastIdx = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIdx]?.focus();
    if (pasted.length === 6) setTimeout(() => checkCode(pasted), 0);
  }

  function checkCode(code: string) {
    if (code.length < 6) return;
    if (code === CORRECT) {
      setSuccess(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setError(false);
      }, 700);
    }
  }

  function resendCode() {
    startCountdown();
    showToast(`New code sent to ${phoneParam}`);
  }

  function continueToHome() {
    router.push('/home');
  }

  return (
    <>
      <style>{`
        .vp-shell{min-height:100vh;background:#F7F7F8;color:#111118;font-family:'DM Sans',sans-serif;}
        .vp-topbar{background:#0a0a2e;height:3.5rem;display:flex;align-items:center;padding:0 2rem;}
        .vp-topbar-logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;text-decoration:none;}
        .vp-topbar-logo span{color:#F5A623;}
        .vp-main{max-width:26rem;margin:0 auto;padding:3rem 1.5rem 4rem;text-align:center;animation:vp-fade .25s ease both;}
        @keyframes vp-fade{from{opacity:0;transform:translateY(.375rem);}to{opacity:1;transform:translateY(0);}}

        .vp-icon{width:10rem;height:10rem;border-radius:50%;background:#EAF3DE;border:2px solid #97C459;display:flex;align-items:center;justify-content:center;margin:0 auto 1.75rem;}

        .vp-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#111118;margin-bottom:.4rem;}
        .vp-sub{font-size:.88rem;color:#5A5A6A;line-height:1.7;margin-bottom:.5rem;}
        .vp-phone{font-family:'DM Mono',monospace;font-size:.9rem;font-weight:500;color:#0a0a2e;background:#F7F7F8;border:1.5px solid rgba(0,0,0,.09);border-radius:1rem;padding:.6rem 1.25rem;display:inline-block;margin-bottom:2rem;}

        .vp-code-wrap{display:flex;justify-content:center;gap:.6rem;margin-bottom:.75rem;}
        .vp-code-digit{width:3.2rem;height:3.8rem;border:2px solid rgba(0,0,0,.09);border-radius:1rem;background:#fff;font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#0a0a2e;text-align:center;outline:none;transition:border-color .15s;caret-color:#F5A623;}
        .vp-code-digit:focus{border-color:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.08);}
        .vp-code-digit.filled{border-color:#0a0a2e;}
        .vp-code-digit.error{border-color:#e53e3e;background:rgba(229,62,62,.04);}
        .vp-code-digit.success{border-color:#3B6D11;}

        .vp-error{font-size:.78rem;font-weight:600;color:#e53e3e;min-height:1.2rem;margin-bottom:1rem;transition:opacity .2s;}
        .vp-error.hidden{opacity:0;}

        .vp-success-wrap{margin-bottom:1.5rem;}
        .vp-success-badge{display:inline-flex;align-items:center;gap:.5rem;background:#EAF3DE;border:1.5px solid #97C459;border-radius:9999px;padding:.5rem 1.25rem;font-size:.82rem;font-weight:700;color:#3B6D11;}

        .vp-resend-wrap{margin-bottom:1.5rem;}
        .vp-resend-btn{background:none;border:none;font-size:.82rem;font-weight:600;color:#D4830A;cursor:pointer;font-family:inherit;}
        .vp-resend-btn:hover{color:#F5A623;}
        .vp-resend-btn:disabled{color:#9A9AAA;cursor:default;}
        .vp-countdown{font-size:.78rem;color:#9A9AAA;}

        .vp-change{font-size:.75rem;color:#9A9AAA;cursor:pointer;background:none;border:none;display:block;margin:0 auto 1.5rem;font-family:inherit;}
        .vp-change:hover{color:#5A5A6A;}

        .vp-btn{width:100%;background:#0a0a2e;border:none;border-radius:1rem;padding:.95rem;font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#F5A623;cursor:pointer;transition:background .15s;}
        .vp-btn:hover{background:#14145c;}

        @keyframes vp-shake{0%,100%{transform:translateX(0);}15%{transform:translateX(-.4rem);}30%{transform:translateX(.4rem);}45%{transform:translateX(-.3rem);}60%{transform:translateX(.3rem);}75%{transform:translateX(-.15rem);}90%{transform:translateX(.15rem);}}
        .vp-shake{animation:vp-shake .45s ease both;}

        .vp-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0a0a2e;color:#fff;padding:.7rem 1.4rem;border-radius:2rem;font-size:.82rem;font-weight:600;z-index:400;box-shadow:0 .25rem 1rem rgba(0,0,0,.2);white-space:nowrap;}
      `}</style>

      <div className="vp-shell">
        <nav className="vp-topbar">
          <Link href="/" className="vp-topbar-logo">{prefix}<span>{highlight}</span></Link>
        </nav>

        <div className="vp-main">
          <div className="vp-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>

          <div className="vp-title">Verify your phone</div>
          <div className="vp-sub">We texted a 6-digit code to</div>
          <div className="vp-phone">{phoneParam}</div>

          <div className={'vp-code-wrap' + (shake ? ' vp-shake' : '')}>
            {digits.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                className={'vp-code-digit' + (val ? (success ? ' success' : ' filled') : '') + (error ? ' error' : '')}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => setDigit(idx, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, idx)}
                onPaste={onPaste}
                disabled={success}
              />
            ))}
          </div>

          <div className={'vp-error' + (error ? '' : ' hidden')}>Incorrect code · please try again</div>

          {success && (
            <div className="vp-success-wrap">
              <div className="vp-success-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Phone verified
              </div>
            </div>
          )}

          {!success && (
            <div className="vp-resend-wrap">
              <button type="button" className="vp-resend-btn" onClick={resendCode} disabled={seconds > 0}>Resend code</button>
              {seconds > 0 && (
                <div className="vp-countdown">Resend available in <span>{seconds}</span>s</div>
              )}
            </div>
          )}

          {!success && (
            <button type="button" className="vp-change" onClick={() => router.push('/register/rider')}>
              Wrong number? Change it →
            </button>
          )}

          {success && (
            <button type="button" className="vp-btn" onClick={continueToHome}>
              Continue to {config.serviceName} →
            </button>
          )}
        </div>

        {toast && <div className="vp-toast">{toast}</div>}
      </div>
    </>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={null}>
      <VerifyPhoneContent />
    </Suspense>
  );
}
