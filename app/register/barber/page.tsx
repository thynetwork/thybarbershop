'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config, { splitServiceName } from '@/lib/config';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type LocType = 'shop' | 'mobile' | 'both';
type SubKey = 'solo' | 'multi' | 'all' | 'free';
type Experience = '' | 'Less than 1 year' | '1–2 years' | '3–5 years' | '6–10 years' | '10+ years';

const STEP_META: { num: Step; name: string; desc: string }[] = [
  { num: 1, name: 'Basic Info', desc: 'Name · contact · photo' },
  { num: 2, name: 'Location', desc: 'Shop · mobile · or both' },
  { num: 3, name: 'Credentials', desc: 'License number' },
  { num: 4, name: 'Service Menu', desc: 'Min 2 · max 4' },
  { num: 5, name: 'Specialties', desc: 'Select all that apply' },
  { num: 6, name: 'Plan & Pledge', desc: 'Subscription · standard' },
  { num: 7, name: 'Review & Submit', desc: 'Confirm everything' },
];

const SPECIALTIES = [
  'Fades', 'Tapers', 'Line-ups', 'Beards', 'Designs', 'Natural Hair',
  'Locs', 'Twists', 'Waves', 'Kids Cuts', 'Gray Blending', 'Color',
  'Trending Haircuts',
];

const STATES = ['TX', 'CA', 'NY', 'FL', 'GA', 'IL', 'NC', 'OH', 'PA', 'AZ'];

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: '', duration: '', price: '' },
  { id: 's2', name: '', duration: '', price: '' },
  { id: 's3', name: '', duration: '', price: '' },
];

export default function BarberRegistrationPage() {
  const { prefix, highlight } = splitServiceName();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);

  // Step 2
  const [locType, setLocType] = useState<LocType>('shop');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopCity, setShopCity] = useState('');
  const [shopState, setShopState] = useState('');
  const [shopZip, setShopZip] = useState('');
  const [mobileCity, setMobileCity] = useState('');
  const [mobileState, setMobileState] = useState('');
  const [mobileZip, setMobileZip] = useState('');
  const [serviceZips, setServiceZips] = useState<Set<string>>(new Set());
  const [zipInput, setZipInput] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');

  // Step 3
  const [dlNumber, setDlNumber] = useState('');
  const [dlFront, setDlFront] = useState<File | null>(null);
  const [dlBack, setDlBack] = useState<File | null>(null);
  const [barberLicOn, setBarberLicOn] = useState(true);
  const [barberLicNumber, setBarberLicNumber] = useState('');
  const [barberLicExpiry, setBarberLicExpiry] = useState('');
  const [barberLicFile, setBarberLicFile] = useState<File | null>(null);
  const [shopLicense, setShopLicense] = useState<File | null>(null);
  const [experience, setExperience] = useState<Experience>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step 4
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  // Step 5
  const [activeSpecs, setActiveSpecs] = useState<Set<string>>(new Set(['Fades']));

  // Step 6
  const [subscription, setSubscription] = useState<SubKey>('solo');
  const [walletAddress, setWalletAddress] = useState('');
  const [pledged, setPledged] = useState(false);

  function goTo(next: Step) {
    setStep(next);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  function addServiceZip(raw: string) {
    const cleaned = raw.replace(/\D/g, '').slice(0, 5);
    if (cleaned.length !== 5) return;
    setServiceZips(prev => {
      const n = new Set(prev);
      n.add(cleaned);
      return n;
    });
    setZipInput('');
  }

  function removeServiceZip(z: string) {
    setServiceZips(prev => {
      const n = new Set(prev);
      n.delete(z);
      return n;
    });
  }

  function toggleSpec(s: string) {
    setActiveSpecs(prev => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s); else n.add(s);
      return n;
    });
  }

  function addService() {
    if (services.length >= 4) return;
    setServices(prev => [...prev, { id: 's' + (Date.now()), name: '', duration: '', price: '' }]);
  }

  function removeService(id: string) {
    if (services.length <= 2) return;
    setServices(prev => prev.filter(s => s.id !== id));
  }

  function updateService(id: string, field: keyof Service, value: string) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  // Vercel caps a serverless function's request body at 4.5 MB. Six raw
  // phone-camera images (≈5 MB each) blow past that. Re-encode any
  // image File client-side to a max 1600px JPEG at quality 0.82 — that
  // pulls a typical 5 MB photo down to ~300 KB while still being plenty
  // sharp for ThyAdmin's manual review. Non-image files (PDFs) pass
  // through untouched since they're already small.
  async function compressImage(file: File, maxEdge = 1600, quality = 0.82): Promise<File> {
    if (!file.type.startsWith('image/')) return file;
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('image load failed'));
        el.src = url;
      });
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, w, h);
      const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
      if (!blob) return file;
      const newName = file.name.replace(/\.\w+$/, '') + '.jpg';
      return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function submitApplication() {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const useShopLoc = locType === 'shop' || locType === 'both';
      const fd = new FormData();
      fd.set('email', email);
      fd.set('password', password);
      fd.set('name', fullName);
      fd.set('phone', phone);
      fd.set('role', 'driver');

      // Location — primary city/state/zip per location type.
      fd.set('city', useShopLoc ? shopCity : mobileCity);
      fd.set('state', useShopLoc ? shopState : mobileState);
      fd.set('zipCode', useShopLoc ? shopZip : mobileZip);
      if (serviceZips.size > 0) fd.set('serviceAreas', Array.from(serviceZips).join(','));

      // Credentials.
      if (dlNumber) fd.set('dlNumber', dlNumber);
      if (barberLicOn && barberLicNumber) fd.set('barberLicenseNumber', barberLicNumber);
      if (barberLicOn && barberLicExpiry) fd.set('barberLicenseExpiry', barberLicExpiry);
      if (experience) fd.set('yearsExperience', experience);

      // Documents — keys must match DocumentSlot values in lib/uploads.ts so
      // the API can map each File straight to its drivers column. Compress
      // images first so the multipart body stays under Vercel's 4.5 MB cap.
      const compressed = await Promise.all([
        profilePhoto ? compressImage(profilePhoto) : Promise.resolve(null),
        logo ? compressImage(logo) : Promise.resolve(null),
        dlFront ? compressImage(dlFront) : Promise.resolve(null),
        dlBack ? compressImage(dlBack) : Promise.resolve(null),
        (barberLicOn && barberLicFile) ? compressImage(barberLicFile) : Promise.resolve(null),
        (useShopLoc && shopLicense) ? compressImage(shopLicense) : Promise.resolve(null),
      ]);
      const [cProfile, cLogo, cDlFront, cDlBack, cBarberLic, cShopLic] = compressed;
      if (cProfile) fd.set('profile', cProfile);
      if (cLogo) fd.set('logo', cLogo);
      if (cDlFront) fd.set('dl-front', cDlFront);
      if (cDlBack) fd.set('dl-back', cDlBack);
      if (cBarberLic) fd.set('barber-license', cBarberLic);
      if (cShopLic) fd.set('shop-license', cShopLic);

      const res = await fetch('/api/auth/register', { method: 'POST', body: fd });
      const rawText = await res.text();
      let data: { error?: string } = {};
      try { data = rawText ? JSON.parse(rawText) : {}; } catch { /* not JSON */ }
      if (!res.ok) {
        const detail = data?.error
          || rawText
          || `HTTP ${res.status} ${res.statusText || ''}`.trim();
        setSubmitError(detail);
        console.error('Register failed:', res.status, rawText);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Submit error:', err);
      setSubmitError(`Network error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = (step / 7) * 100;

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Marcus Rivera';
  const subscriptionLabel = ({
    solo: 'Solo · $9.99/week',
    multi: 'Multi · $14.99/week',
    all: 'All Access · $19.99/week',
    free: 'Waived · pending verification',
  } as Record<SubKey, string>)[subscription];

  return (
    <>
      <style>{`
        .br-shell{min-height:100vh;display:grid;grid-template-columns:16.25rem 1fr;background:#0a0a2e;}
        .br-sidebar{background:linear-gradient(180deg,#0d0d38,#0a0a2e);border-right:1px solid rgba(255,255,255,.06);padding:2rem 1.5rem;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow:hidden;}
        .br-sb-logo{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:.25rem;}
        .br-sb-logo span{color:#F5A623;}
        .br-sb-tagline{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:2rem;}
        .br-sb-title{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:1rem;}
        .br-steps{display:flex;flex-direction:column;flex:1;}
        .br-step-item{display:flex;align-items:flex-start;gap:.85rem;padding:.75rem 0;cursor:pointer;position:relative;background:none;border:none;text-align:left;width:100%;font-family:inherit;}
        .br-step-item:not(:last-child)::after{content:'';position:absolute;left:.85rem;top:2.2rem;width:1px;height:calc(100% - 1rem);background:rgba(255,255,255,.08);}
        .br-step-num{width:1.7rem;height:1.7rem;border-radius:50%;border:1.5px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:.68rem;font-weight:800;color:rgba(255,255,255,.3);flex-shrink:0;background:transparent;position:relative;z-index:1;}
        .br-step-item.active .br-step-num{background:#F5A623;border-color:#F5A623;color:#0a0a2e;}
        .br-step-item.done .br-step-num{background:#3B6D11;border-color:#97C459;color:#fff;font-size:.75rem;}
        .br-step-info{flex:1;}
        .br-step-name{font-size:.75rem;font-weight:600;color:rgba(255,255,255,.3);line-height:1.2;}
        .br-step-item.active .br-step-name{color:#fff;}
        .br-step-item.done .br-step-name{color:rgba(255,255,255,.5);}
        .br-step-desc{font-size:.62rem;color:rgba(255,255,255,.2);margin-top:.15rem;line-height:1.4;}
        .br-step-item.active .br-step-desc{color:rgba(255,255,255,.4);}
        .br-sb-foot{font-size:.6rem;color:rgba(255,255,255,.18);text-align:center;padding-top:1rem;border-top:1px solid rgba(255,255,255,.06);line-height:1.7;}

        .br-main{background:#F7F7F8;padding:3rem 3.5rem;min-height:100vh;}
        .br-progress-bar{height:.1875rem;background:rgba(0,0,0,.07);border-radius:9999px;margin-bottom:2.5rem;overflow:hidden;}
        .br-progress-fill{height:100%;background:#F5A623;border-radius:9999px;transition:width .4s ease;}

        .br-panel-head{margin-bottom:2rem;}
        .br-panel-step{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#D4830A;margin-bottom:.4rem;}
        .br-panel-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#111118;margin-bottom:.4rem;line-height:1.2;}
        .br-panel-sub{font-size:.82rem;color:#5A5A6A;line-height:1.5;}

        .br-form-grid{display:grid;gap:1.2rem;}
        .br-g2{grid-template-columns:1fr 1fr;}
        .br-g3{grid-template-columns:1fr 1fr 1fr;}

        .br-field{display:flex;flex-direction:column;gap:.35rem;}
        .br-field-label{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5A5A6A;}
        .br-field-hint{font-size:.65rem;color:#9A9AAA;margin-top:-.1rem;}
        .br-field-input{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:.65rem;padding:.7rem .9rem;font-family:'DM Sans',sans-serif;font-size:.85rem;color:#111118;outline:none;width:100%;}
        .br-field-input:focus{border-color:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.12);}

        .br-upload-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        .br-upload-box{border:2px dashed rgba(0,0,0,.12);border-radius:.9rem;padding:1.5rem 1rem;text-align:center;cursor:pointer;background:#fff;position:relative;}
        .br-upload-box:hover{border-color:#F5A623;background:rgba(245,166,35,.1);}
        .br-upload-box.uploaded{border-style:solid;border-color:#97C459;background:#EAF3DE;}
        .br-upload-box input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
        .br-upload-icon{font-size:1.8rem;margin-bottom:.5rem;}
        .br-upload-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;color:#111118;margin-bottom:.2rem;}
        .br-upload-sub{font-size:.65rem;color:#9A9AAA;}
        .br-upload-badge{display:inline-block;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.3);border-radius:9999px;padding:.15rem .6rem;font-size:.6rem;font-weight:700;color:#D4830A;margin-top:.4rem;}
        .br-upload-badge.req{background:rgba(180,40,40,.08);border-color:rgba(180,40,40,.2);color:#b42828;}
        .br-upload-badge.ok{background:#EAF3DE;border-color:#97C459;color:#3B6D11;}

        .br-loc-toggle{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-bottom:1rem;}
        .br-loc-btn{border:1.5px solid rgba(0,0,0,.1);border-radius:.9rem;padding:.85rem .5rem;text-align:center;cursor:pointer;background:#fff;font-family:inherit;}
        .br-loc-btn:hover{border-color:#F5A623;}
        .br-loc-btn.active{background:#0a0a2e;border-color:#0a0a2e;}
        .br-loc-btn.active .br-loc-btn-icon{color:#fff;}
        .br-loc-btn.active .br-loc-btn-label{color:#F5A623;}
        .br-loc-btn-icon{font-size:1.3rem;margin-bottom:.3rem;}
        .br-loc-btn-label{font-family:'Syne',sans-serif;font-size:.7rem;font-weight:700;color:#5A5A6A;}

        .br-loc-section-title{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5A5A6A;margin-bottom:.8rem;padding-bottom:.5rem;border-bottom:1px solid rgba(0,0,0,.1);}

        .br-geo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin-top:.5rem;}
        .br-geo-chip{display:flex;align-items:center;gap:.4rem;background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:9999px;padding:.45rem .75rem;font-size:.75rem;font-weight:600;color:#5A5A6A;cursor:pointer;font-family:inherit;}
        .br-geo-chip.on{background:#0a0a2e;border-color:#0a0a2e;color:#F5A623;}

        .br-cred-section{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:1.1rem;padding:1.2rem 1.3rem;margin-bottom:1rem;}
        .br-cred-section-title{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#111118;margin-bottom:1rem;padding-bottom:.7rem;border-bottom:1px solid rgba(0,0,0,.1);}
        .br-cred-required{display:inline-block;background:rgba(180,40,40,.08);border:1px solid rgba(180,40,40,.2);border-radius:9999px;padding:.1rem .55rem;font-size:.6rem;font-weight:700;color:#b42828;margin-left:.5rem;letter-spacing:.05em;text-transform:uppercase;}
        .br-cred-optional{display:inline-block;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.3);border-radius:9999px;padding:.1rem .55rem;font-size:.6rem;font-weight:700;color:#D4830A;margin-left:.5rem;letter-spacing:.05em;text-transform:uppercase;}

        .br-toggle-switch{width:2.4rem;height:1.3rem;background:rgba(0,0,0,.12);border-radius:9999px;cursor:pointer;position:relative;border:none;flex-shrink:0;transition:background .2s;}
        .br-toggle-switch.on{background:#F5A623;}
        .br-toggle-knob{position:absolute;top:.15rem;left:.15rem;width:1rem;height:1rem;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 .0625rem .1875rem rgba(0,0,0,.2);}
        .br-toggle-switch.on .br-toggle-knob{transform:translateX(1.1rem);}

        .br-info-note{background:rgba(245,166,35,.07);border:1px solid rgba(245,166,35,.2);border-radius:.65rem;padding:.7rem .9rem;font-size:.72rem;color:#5A5A6A;line-height:1.6;margin-bottom:1rem;}
        .br-info-note strong{color:#D4830A;}

        .br-svc-list{display:flex;flex-direction:column;gap:.7rem;margin-bottom:1rem;}
        .br-svc-row{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:.6rem;align-items:end;background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:.9rem;padding:.85rem 1rem;}
        .br-svc-row:focus-within{border-color:#F5A623;}
        .br-svc-row-label{font-size:.62rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.3rem;}
        .br-svc-input{border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:.82rem;color:#111118;background:transparent;width:100%;padding:.2rem 0;border-bottom:1px solid rgba(0,0,0,.1);}
        .br-svc-remove{width:1.8rem;height:1.8rem;border-radius:50%;border:1.5px solid rgba(0,0,0,.1);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.9rem;color:#9A9AAA;align-self:center;font-family:inherit;}
        .br-svc-remove:hover{border-color:#c0392b;color:#c0392b;background:rgba(192,57,43,.05);}
        .br-add-svc-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;background:none;border:1.5px dashed rgba(0,0,0,.15);border-radius:.9rem;padding:.75rem 1rem;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;color:#5A5A6A;cursor:pointer;width:100%;}
        .br-add-svc-btn:hover{border-color:#F5A623;color:#D4830A;}
        .br-add-svc-btn:disabled{opacity:.35;cursor:not-allowed;}
        .br-svc-counter{font-size:.7rem;color:#9A9AAA;text-align:right;margin-top:.3rem;}
        .br-svc-counter strong{color:#D4830A;font-weight:700;}

        .br-spec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(8.125rem,1fr));gap:.6rem;}
        .br-spec-chip{border:1.5px solid rgba(0,0,0,.1);border-radius:9999px;padding:.5rem .9rem;font-size:.75rem;font-weight:600;color:#5A5A6A;cursor:pointer;text-align:center;background:#fff;font-family:inherit;}
        .br-spec-chip:hover{border-color:#F5A623;color:#D4830A;}
        .br-spec-chip.selected{background:#F5A623;border-color:#F5A623;color:#0a0a2e;font-weight:700;}

        .br-sub-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:1rem;}
        .br-sub-card{border:2px solid rgba(0,0,0,.1);border-radius:1.1rem;padding:1.2rem;cursor:pointer;background:#fff;position:relative;font-family:inherit;text-align:left;}
        .br-sub-card:hover{border-color:#F5A623;}
        .br-sub-card.selected{border-color:#F5A623;background:rgba(245,166,35,.05);}
        .br-sub-card.selected::after{content:'✓';position:absolute;top:.7rem;right:.8rem;width:1.3rem;height:1.3rem;background:#F5A623;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:#0a0a2e;}
        .br-sub-tier{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9A9AAA;margin-bottom:.3rem;}
        .br-sub-name{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#111118;margin-bottom:.2rem;}
        .br-sub-price{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#D4830A;margin-bottom:.5rem;}
        .br-sub-price span{font-size:.72rem;font-weight:400;color:#9A9AAA;}
        .br-sub-desc{font-size:.7rem;color:#5A5A6A;line-height:1.5;}
        .br-sub-card.free-tier{border-color:rgba(59,109,17,.3);background:#EAF3DE;grid-column:1/-1;}
        .br-sub-card.free-tier.selected{border-color:#3B6D11;background:rgba(59,109,17,.08);}
        .br-sub-card.free-tier .br-sub-price{color:#3B6D11;}

        .br-wallet-box{background:#0a0a2e;border-radius:1.1rem;padding:1.5rem;margin-top:.8rem;}
        .br-wallet-box-title{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:800;color:#fff;margin-bottom:.3rem;}
        .br-wallet-box-sub{font-size:.72rem;color:rgba(255,255,255,.4);margin-bottom:1rem;line-height:1.5;}
        .br-wallet-btn{display:flex;align-items:center;justify-content:center;gap:.6rem;background:rgba(245,166,35,.12);border:1px solid rgba(245,166,35,.3);border-radius:.9rem;padding:.75rem 1rem;font-family:'Syne',sans-serif;font-size:.78rem;font-weight:700;color:#F5A623;cursor:pointer;margin-bottom:.6rem;width:100%;}
        .br-wallet-btn:hover{background:rgba(245,166,35,.2);}
        .br-wallet-or{text-align:center;font-size:.68rem;color:rgba(255,255,255,.25);margin:.6rem 0;}
        .br-wallet-input{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:.65rem;padding:.65rem .9rem;font-family:'DM Mono',monospace;font-size:.78rem;color:#fff;outline:none;width:100%;}
        .br-wallet-input:focus{border-color:#F5A623;}
        .br-wallet-note{font-size:.62rem;color:rgba(255,255,255,.25);margin-top:.5rem;line-height:1.5;}

        .br-pledge-box{background:rgba(10,10,46,.04);border:1.5px solid rgba(10,10,46,.1);border-radius:.9rem;padding:1.1rem 1.2rem;margin-bottom:1.2rem;display:flex;gap:.85rem;align-items:flex-start;}
        .br-pledge-check{width:1.2rem;height:1.2rem;border:2px solid rgba(0,0,0,.14);border-radius:.25rem;flex-shrink:0;margin-top:.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;background:#fff;font-size:.7rem;}
        .br-pledge-check.checked{background:#0a0a2e;border-color:#0a0a2e;color:#fff;}
        .br-pledge-text{font-size:.78rem;color:#5A5A6A;line-height:1.6;font-style:italic;}
        .br-pledge-text strong{color:#111118;font-style:normal;}

        .br-review-section{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:1.1rem;padding:1.2rem 1.4rem;margin-bottom:1rem;}
        .br-review-section-title{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:800;color:#111118;margin-bottom:.8rem;padding-bottom:.6rem;border-bottom:1px solid rgba(0,0,0,.1);display:flex;justify-content:space-between;align-items:center;}
        .br-review-edit{font-size:.65rem;font-weight:600;color:#D4830A;cursor:pointer;background:none;border:none;font-family:inherit;}
        .br-review-row{display:flex;justify-content:space-between;padding:.35rem 0;font-size:.78rem;border-bottom:1px solid rgba(0,0,0,.04);}
        .br-review-row:last-child{border-bottom:none;}
        .br-review-key{color:#9A9AAA;}
        .br-review-val{color:#111118;font-weight:500;text-align:right;max-width:60%;}

        .br-confirm{text-align:center;padding:3rem 2rem;}
        .br-confirm-icon{width:5rem;height:5rem;border-radius:50%;background:#EAF3DE;border:2px solid #97C459;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.5rem;color:#3B6D11;}
        .br-confirm-title{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#111118;margin-bottom:.5rem;}
        .br-confirm-sub{font-size:.9rem;color:#5A5A6A;max-width:26.25rem;margin:0 auto 2rem;line-height:1.7;}
        .br-confirm-cards{display:grid;grid-template-columns:1fr 1fr;gap:1rem;max-width:30rem;margin:0 auto 2rem;}
        .br-confirm-card{background:#fff;border:1.5px solid rgba(0,0,0,.1);border-radius:1.1rem;padding:1.1rem;text-align:left;}
        .br-confirm-card-icon{font-size:1.3rem;margin-bottom:.4rem;}
        .br-confirm-card-title{font-family:'Syne',sans-serif;font-size:.78rem;font-weight:800;color:#111118;margin-bottom:.25rem;}
        .br-confirm-card-text{font-size:.7rem;color:#5A5A6A;line-height:1.5;}

        .br-nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(0,0,0,.1);}
        .br-btn-back{background:none;border:1.5px solid rgba(0,0,0,.1);border-radius:.9rem;padding:.75rem 1.5rem;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;color:#5A5A6A;cursor:pointer;}
        .br-btn-back:hover{border-color:#5A5A6A;color:#111118;}
        .br-btn-next{background:#0a0a2e;border:none;border-radius:.9rem;padding:.75rem 2rem;font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;color:#F5A623;cursor:pointer;letter-spacing:.03em;}
        .br-btn-next:hover{background:#14145c;}
        .br-btn-submit{background:#F5A623;border:none;border-radius:.9rem;padding:.75rem 2.5rem;font-family:'Syne',sans-serif;font-size:.88rem;font-weight:800;color:#0a0a2e;cursor:pointer;letter-spacing:.03em;}
        .br-btn-submit:hover{background:#e09910;}
        .br-step-count{font-size:.72rem;color:#9A9AAA;}
        .br-step-count strong{color:#111118;}

        @media(max-width:48rem){.br-shell{grid-template-columns:1fr;}.br-sidebar{display:none;}.br-main{padding:1.5rem;}.br-g2,.br-g3{grid-template-columns:1fr;}.br-sub-grid{grid-template-columns:1fr;}.br-confirm-cards{grid-template-columns:1fr;}.br-svc-row{grid-template-columns:1fr;}}
      `}</style>

      <div className="br-shell">
        <aside className="br-sidebar">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="br-sb-logo">{prefix}<span>{highlight}</span></div>
          </Link>
          <div className="br-sb-tagline">{config.tagline}</div>
          <div className="br-sb-title">Barber Registration</div>

          <div className="br-steps">
            {STEP_META.map((m) => {
              const cls = submitted ? 'done' : step === m.num ? 'active' : step > m.num ? 'done' : '';
              return (
                <button
                  key={m.num}
                  type="button"
                  className={'br-step-item' + (cls ? ' ' + cls : '')}
                  onClick={() => !submitted && goTo(m.num)}
                >
                  <div className="br-step-num">{cls === 'done' ? '✓' : m.num}</div>
                  <div className="br-step-info">
                    <div className="br-step-name">{m.name}</div>
                    <div className="br-step-desc">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="br-sb-foot">&copy; {config.copyrightYear} {config.companyName}<br/>All rights reserved.</div>
        </aside>

        <main className="br-main">
          <div className="br-progress-bar">
            <div className="br-progress-fill" style={{ width: submitted ? '100%' : `${progressPct}%` }}></div>
          </div>

          {submitted ? (
            <div className="br-confirm">
              <div className="br-confirm-icon">✓</div>
              <div className="br-confirm-title">Application Submitted</div>
              <div className="br-confirm-sub">Your application is under review. ThyAdmin will verify your license and approve your profile within 1–2 business days. Check your email for confirmation.</div>
              <div className="br-confirm-cards">
                <div className="br-confirm-card">
                  <div className="br-confirm-card-icon">📧</div>
                  <div className="br-confirm-card-title">Check your email</div>
                  <div className="br-confirm-card-text">A confirmation has been sent to {email || 'your email'} with your application details.</div>
                </div>
                <div className="br-confirm-card">
                  <div className="br-confirm-card-icon">🔡</div>
                  <div className="br-confirm-card-title">What happens next</div>
                  <div className="br-confirm-card-text">ThyAdmin reviews your license. Once approved your Barber Code is generated and your profile goes live.</div>
                </div>
                <div className="br-confirm-card">
                  <div className="br-confirm-card-icon">✂️</div>
                  <div className="br-confirm-card-title">Your Barber Code</div>
                  <div className="br-confirm-card-text">Your unique code is generated after approval. You&rsquo;ll receive it by email and SMS. Share it with your clients to get connected.</div>
                </div>
                <div className="br-confirm-card">
                  <div className="br-confirm-card-icon">🔒</div>
                  <div className="br-confirm-card-title">Safety Protocol</div>
                  <div className="br-confirm-card-text">After approval you&rsquo;ll complete your Safety Protocol before your profile goes live to clients.</div>
                </div>
              </div>
              <button type="button" className="br-btn-next" style={{ margin: '0 auto', display: 'block' }} onClick={() => router.push('/')}>Return to Login</button>
            </div>
          ) : step === 1 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 1 of 7</div>
                <div className="br-panel-title">Tell us about yourself</div>
                <div className="br-panel-sub">This information appears on your public profile and helps clients find and trust you.</div>
              </div>

              <div className="br-form-grid">
                <div className="br-form-grid br-g2">
                  <div className="br-field">
                    <div className="br-field-label">First Name</div>
                    <input className="br-field-input" placeholder="Marcus" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                  </div>
                  <div className="br-field">
                    <div className="br-field-label">Last Name</div>
                    <input className="br-field-input" placeholder="Rivera" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                  </div>
                </div>
                <div className="br-field">
                  <div className="br-field-label">Email Address</div>
                  <input className="br-field-input" type="email" placeholder="marcus@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="br-field">
                  <div className="br-field-label">Phone Number</div>
                  <input className="br-field-input" type="tel" placeholder="(713) 555-0142" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div className="br-field">
                  <div className="br-field-label">Password</div>
                  <input className="br-field-input" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="br-field">
                  <div className="br-field-label">Confirm Password</div>
                  <input className="br-field-input" type="password" placeholder="Repeat your password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}/>
                </div>
              </div>

              <div style={{ marginTop: '1.2rem' }}>
                <div className="br-field-label" style={{ marginBottom: '.7rem' }}>Photos</div>
                <div className="br-upload-row">
                  <label className={'br-upload-box' + (profilePhoto ? ' uploaded' : '')}>
                    <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] ?? null)}/>
                    <div className="br-upload-icon">📷</div>
                    <div className="br-upload-label">Profile Photo</div>
                    <div className="br-upload-sub">Clear headshot recommended</div>
                    <div className={'br-upload-badge ' + (profilePhoto ? 'ok' : 'req')}>{profilePhoto ? '✓ Uploaded' : 'Required'}</div>
                  </label>
                  <label className={'br-upload-box' + (logo ? ' uploaded' : '')}>
                    <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)}/>
                    <div className="br-upload-icon">✂️</div>
                    <div className="br-upload-label">Shop / Brand Logo</div>
                    <div className="br-upload-sub">PNG with transparent bg ideal</div>
                    <div className={'br-upload-badge ' + (logo ? 'ok' : '')}>{logo ? '✓ Uploaded' : 'Optional'}</div>
                  </label>
                </div>
              </div>

              <div className="br-nav-row">
                <div className="br-step-count">Step <strong>1</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(2)}>Continue &rarr;</button>
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 2 of 7</div>
                <div className="br-panel-title">Where do you work?</div>
                <div className="br-panel-sub">Select all that apply. Clients will see this on your profile and booking confirmation.</div>
              </div>

              <div className="br-loc-toggle">
                {([
                  { key: 'shop' as LocType, icon: '🏠', label: 'Shop' },
                  { key: 'mobile' as LocType, icon: '🚐', label: 'Mobile' },
                  { key: 'both' as LocType, icon: '⚡', label: 'Both' },
                ]).map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    className={'br-loc-btn' + (locType === opt.key ? ' active' : '')}
                    onClick={() => setLocType(opt.key)}
                  >
                    <div className="br-loc-btn-icon">{opt.icon}</div>
                    <div className="br-loc-btn-label">{opt.label}</div>
                  </button>
                ))}
              </div>

              {(locType === 'shop' || locType === 'both') && (
                <div>
                  <div className="br-loc-section-title">Shop Details</div>
                  <div className="br-form-grid" style={{ marginBottom: '1.2rem' }}>
                    <div className="br-field">
                      <div className="br-field-label">Shop Name</div>
                      <input className="br-field-input" placeholder="The Studio · Cuts by Marcus · etc." value={shopName} onChange={(e) => setShopName(e.target.value)}/>
                    </div>
                    <div className="br-field">
                      <div className="br-field-label">Street Address</div>
                      <input className="br-field-input" placeholder="4521 Main Street" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)}/>
                    </div>
                    <div className="br-form-grid br-g3">
                      <div className="br-field">
                        <div className="br-field-label">City</div>
                        <input className="br-field-input" placeholder="Houston" value={shopCity} onChange={(e) => setShopCity(e.target.value)}/>
                      </div>
                      <div className="br-field">
                        <div className="br-field-label">State</div>
                        <select className="br-field-input" value={shopState} onChange={(e) => setShopState(e.target.value)}>
                          <option value="">Select</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="br-field">
                        <div className="br-field-label">ZIP Code</div>
                        <input className="br-field-input" inputMode="numeric" maxLength={5} placeholder="77002" value={shopZip} onChange={(e) => setShopZip(e.target.value.replace(/\D/g, '').slice(0, 5))}/>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(locType === 'mobile' || locType === 'both') && (
                <div>
                  <div className="br-loc-section-title">Mobile Service Area</div>
                  <div className="br-form-grid" style={{ marginBottom: '1.2rem' }}>
                    <div className="br-form-grid br-g3">
                      <div className="br-field">
                        <div className="br-field-label">City</div>
                        <input className="br-field-input" placeholder="Houston" value={mobileCity} onChange={(e) => setMobileCity(e.target.value)}/>
                      </div>
                      <div className="br-field">
                        <div className="br-field-label">State</div>
                        <select className="br-field-input" value={mobileState} onChange={(e) => setMobileState(e.target.value)}>
                          <option value="">Select</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="br-field">
                        <div className="br-field-label">ZIP Code</div>
                        <input className="br-field-input" inputMode="numeric" maxLength={5} placeholder="77002" value={mobileZip} onChange={(e) => setMobileZip(e.target.value.replace(/\D/g, '').slice(0, 5))}/>
                      </div>
                    </div>
                    <div className="br-field">
                      <div className="br-field-label">Neighborhoods <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A9AAA' }}>(optional)</span></div>
                      <div className="br-field-hint">List specific neighborhoods you serve, separated by commas</div>
                      <input className="br-field-input" placeholder="e.g. Midtown, Third Ward, Acres Homes, Sugar Land" value={neighborhoods} onChange={(e) => setNeighborhoods(e.target.value)}/>
                    </div>
                    <div className="br-info-note">
                      <strong>Mobile barbers:</strong> Your exact address is never shown publicly. Only your city, ZIP codes, and neighborhoods appear on your profile. Full address shared only on confirmed appointment cards.
                    </div>
                  </div>
                </div>
              )}

              {/* Service ZIP coverage — always visible · powers the FA1 pool match. */}
              <div className="br-loc-section-title" style={{ marginTop: '1.5rem' }}>Service ZIP Codes</div>
              <div className="br-field">
                <div className="br-field-hint">
                  Add every ZIP code where you accept clients. Clients searching any of these ZIPs will see you in the {config.serviceName} pool. You can add as many as you want.
                </div>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '.5rem' }}>
                  <input
                    className="br-field-input"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="77002"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
                        e.preventDefault();
                        addServiceZip(zipInput);
                      }
                    }}
                    style={{ maxWidth: '8rem', fontFamily: "'DM Mono',monospace", letterSpacing: '.05em' }}
                  />
                  <button
                    type="button"
                    onClick={() => addServiceZip(zipInput)}
                    disabled={zipInput.length !== 5}
                    style={{
                      background: '#0a0a2e', color: '#F5A623', border: 'none',
                      borderRadius: '.65rem', padding: '.7rem 1.1rem',
                      fontFamily: "'Syne',sans-serif", fontSize: '.78rem', fontWeight: 800,
                      cursor: zipInput.length === 5 ? 'pointer' : 'not-allowed',
                      opacity: zipInput.length === 5 ? 1 : 0.45,
                    }}
                  >
                    + Add
                  </button>
                </div>
                {serviceZips.size > 0 && (
                  <div className="br-geo-grid" style={{ marginTop: '.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(6rem, 1fr))' }}>
                    {Array.from(serviceZips).map(z => (
                      <button
                        key={z}
                        type="button"
                        className="br-geo-chip on"
                        onClick={() => removeServiceZip(z)}
                        title="Remove"
                        style={{ fontFamily: "'DM Mono',monospace" }}
                      >
                        {z} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(1)}>&larr; Back</button>
                <div className="br-step-count">Step <strong>2</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(3)}>Continue &rarr;</button>
              </div>
            </div>
          ) : step === 3 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 3 of 7</div>
                <div className="br-panel-title">Your credentials</div>
                <div className="br-panel-sub">ThyAdmin reviews all documents manually before your profile goes live. Review takes 1–3 business days. Your information is stored securely and never shared publicly.</div>
              </div>

              <div className="br-form-grid">
                <div className="br-cred-section">
                  <div className="br-cred-section-title">Driver License <span className="br-cred-required">Required</span></div>
                  <div className="br-field" style={{ marginBottom: '1rem' }}>
                    <div className="br-field-label">Driver License Number</div>
                    <div className="br-field-hint">As it appears on your license</div>
                    <input className="br-field-input" placeholder="e.g. 12345678" value={dlNumber} onChange={(e) => setDlNumber(e.target.value)} style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '.05em' }}/>
                  </div>
                  <div className="br-upload-row">
                    <label className={'br-upload-box' + (dlFront ? ' uploaded' : '')}>
                      <input type="file" accept="image/*" onChange={(e) => setDlFront(e.target.files?.[0] ?? null)}/>
                      <div className="br-upload-icon">🪪</div>
                      <div className="br-upload-label">Front of License</div>
                      <div className="br-upload-sub">Clear photo · all text readable</div>
                      <div className={'br-upload-badge ' + (dlFront ? 'ok' : 'req')}>{dlFront ? '✓ Uploaded' : 'Required'}</div>
                    </label>
                    <label className={'br-upload-box' + (dlBack ? ' uploaded' : '')}>
                      <input type="file" accept="image/*" onChange={(e) => setDlBack(e.target.files?.[0] ?? null)}/>
                      <div className="br-upload-icon">🪪</div>
                      <div className="br-upload-label">Back of License</div>
                      <div className="br-upload-sub">Clear photo · all text readable</div>
                      <div className={'br-upload-badge ' + (dlBack ? 'ok' : 'req')}>{dlBack ? '✓ Uploaded' : 'Required'}</div>
                    </label>
                  </div>
                </div>

                <div className="br-cred-section">
                  <div className="br-cred-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Barber License <span className="br-cred-optional">Optional</span></span>
                    <button type="button" className={'br-toggle-switch' + (barberLicOn ? ' on' : '')} onClick={() => setBarberLicOn(p => !p)}>
                      <div className="br-toggle-knob"></div>
                    </button>
                  </div>
                  <div className="br-info-note" style={{ marginBottom: '.8rem' }}>
                    Uploading your barber license earns a <strong>Verified</strong> badge on your profile — visible to all clients. Helps build trust and stand out in the Find a Barber pool.
                  </div>
                  {barberLicOn && (
                    <div>
                      <div className="br-form-grid br-g2" style={{ marginBottom: '1rem' }}>
                        <div className="br-field">
                          <div className="br-field-label">Barber License Number</div>
                          <input className="br-field-input" placeholder="e.g. TX-BBR-0042871" value={barberLicNumber} onChange={(e) => setBarberLicNumber(e.target.value)} style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '.05em' }}/>
                        </div>
                        <div className="br-field">
                          <div className="br-field-label">License Expiry Date</div>
                          <input className="br-field-input" type="date" value={barberLicExpiry} onChange={(e) => setBarberLicExpiry(e.target.value)}/>
                        </div>
                      </div>
                      <div className="br-upload-row">
                        <label className={'br-upload-box' + (barberLicFile ? ' uploaded' : '')} style={{ gridColumn: '1 / -1' }}>
                          <input type="file" accept="image/*,.pdf" onChange={(e) => setBarberLicFile(e.target.files?.[0] ?? null)}/>
                          <div className="br-upload-icon">📄</div>
                          <div className="br-upload-label">Barber License Copy</div>
                          <div className="br-upload-sub">Photo or PDF · issued by state board</div>
                          <div className={'br-upload-badge ' + (barberLicFile ? 'ok' : '')}>{barberLicFile ? '✓ Uploaded' : 'Gets you Verified ✓'}</div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {(locType === 'shop' || locType === 'both') && (
                  <div className="br-cred-section">
                    <div className="br-cred-section-title">Shop License <span className="br-cred-optional">Optional</span></div>
                    <div className="br-info-note" style={{ marginBottom: '.8rem' }}>
                      Shop owners only. Upload your shop&rsquo;s business license to verify the location. Helps unlock the <strong>Shop Verified</strong> badge after ThyAdmin review.
                    </div>
                    <div className="br-upload-row">
                      <label className={'br-upload-box' + (shopLicense ? ' uploaded' : '')} style={{ gridColumn: '1 / -1' }}>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setShopLicense(e.target.files?.[0] ?? null)}/>
                        <div className="br-upload-icon">🏠</div>
                        <div className="br-upload-label">Shop Business License</div>
                        <div className="br-upload-sub">Photo or PDF · current and valid</div>
                        <div className={'br-upload-badge ' + (shopLicense ? 'ok' : '')}>{shopLicense ? '✓ Uploaded' : 'Optional'}</div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="br-form-grid br-g2">
                  <div className="br-field">
                    <div className="br-field-label">Years of Experience</div>
                    <select className="br-field-input" value={experience} onChange={(e) => setExperience(e.target.value as Experience)}>
                      <option value="">Select</option>
                      <option>Less than 1 year</option>
                      <option>1–2 years</option>
                      <option>3–5 years</option>
                      <option>6–10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="br-info-note">
                  <strong>Review process:</strong> ThyAdmin manually reviews all submitted documents within 1–3 business days. You will receive an email once approved. Your profile is not visible to clients until review is complete.
                </div>
              </div>

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(2)}>&larr; Back</button>
                <div className="br-step-count">Step <strong>3</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(4)}>Continue &rarr;</button>
              </div>
            </div>
          ) : step === 4 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 4 of 7</div>
                <div className="br-panel-title">Build your service menu</div>
                <div className="br-panel-sub">Add the services you offer. Minimum 2 required. Maximum 4 here — add more from your dashboard after approval.</div>
              </div>

              <div className="br-svc-list">
                {services.map((svc, i) => (
                  <div key={svc.id} className="br-svc-row">
                    <div>
                      <div className="br-svc-row-label">Service Name</div>
                      <input className="br-svc-input" placeholder={i === 0 ? 'e.g. Adult Haircut' : i === 1 ? 'e.g. Beard Trim' : 'Service name'} value={svc.name} onChange={(e) => updateService(svc.id, 'name', e.target.value)}/>
                    </div>
                    <div>
                      <div className="br-svc-row-label">Duration</div>
                      <input className="br-svc-input" placeholder={i === 0 ? '30 min' : i === 1 ? '20 min' : '— min'} value={svc.duration} onChange={(e) => updateService(svc.id, 'duration', e.target.value)}/>
                    </div>
                    <div>
                      <div className="br-svc-row-label">Starting Price</div>
                      <input className="br-svc-input" placeholder={i === 0 ? '$35' : i === 1 ? '$20' : '$—'} value={svc.price} onChange={(e) => updateService(svc.id, 'price', e.target.value)}/>
                    </div>
                    <button type="button" className="br-svc-remove" title="Remove" onClick={() => removeService(svc.id)} disabled={services.length <= 2}>×</button>
                  </div>
                ))}
              </div>

              <button type="button" className="br-add-svc-btn" onClick={addService} disabled={services.length >= 4}>+ Add Another Service</button>
              <div className="br-svc-counter">Services added: <strong>{services.length}</strong> / 4 &nbsp;·&nbsp; Minimum 2 required</div>

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(3)}>&larr; Back</button>
                <div className="br-step-count">Step <strong>4</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(5)}>Continue &rarr;</button>
              </div>
            </div>
          ) : step === 5 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 5 of 7</div>
                <div className="br-panel-title">Your specialties</div>
                <div className="br-panel-sub">Select all that apply. These appear as badges on your profile and help clients find you in the pool. You can update these anytime from your dashboard.</div>
              </div>

              <div className="br-spec-grid">
                {SPECIALTIES.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={'br-spec-chip' + (activeSpecs.has(s) ? ' selected' : '')}
                    onClick={() => toggleSpec(s)}
                  >{s}</button>
                ))}
              </div>

              <div className="br-info-note" style={{ marginTop: '1.2rem' }}>
                Optional at this step — you can always add or remove specialties from your dashboard after approval.
              </div>

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(4)}>&larr; Back</button>
                <div className="br-step-count">Step <strong>5</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(6)}>Continue &rarr;</button>
              </div>
            </div>
          ) : step === 6 ? (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 6 of 7</div>
                <div className="br-panel-title">Your plan &amp; professional standard</div>
                <div className="br-panel-sub">Choose your subscription and commit to the {config.serviceName} standard. If you do more freelance work you can buy access to them without full price.</div>
              </div>

              <div className="br-field-label" style={{ marginBottom: '.8rem' }}>Subscription Plan</div>
              <div className="br-sub-grid">
                {([
                  { key: 'solo' as SubKey, tier: 'Tier 1', name: 'Solo', price: '$9.99', desc: `${config.serviceName} only. Perfect for barbers focused on one platform.` },
                  { key: 'multi' as SubKey, tier: 'Tier 2', name: 'Multi', price: '$14.99', desc: `Up to 3 ${config.companyName.replace(' Inc.', '')} platforms. e.g. ${config.serviceName}, ThySalon, ThyMusician — and other freelancing gigs.` },
                  { key: 'all' as SubKey, tier: 'Tier 3', name: 'All Access', price: '$19.99', desc: `Access to all ${config.companyName.replace(' Inc.', '')} database — every platform now and every future launch.` },
                ]).map(s => (
                  <button
                    key={s.key}
                    type="button"
                    className={'br-sub-card' + (subscription === s.key ? ' selected' : '')}
                    onClick={() => setSubscription(s.key)}
                  >
                    <div className="br-sub-tier">{s.tier}</div>
                    <div className="br-sub-name">{s.name}</div>
                    <div className="br-sub-price">{s.price}<span>/week</span></div>
                    <div className="br-sub-desc">{s.desc}</div>
                  </button>
                ))}
                <button
                  type="button"
                  className={'br-sub-card free-tier' + (subscription === 'free' ? ' selected' : '')}
                  onClick={() => setSubscription('free')}
                >
                  <div className="br-sub-tier">NFT Holder or {config.companyName.replace(' Inc.', '')} Member</div>
                  <div className="br-sub-name">Waived</div>
                  <div className="br-sub-price">$0<span>/week</span></div>
                  <div className="br-sub-desc">Connect your wallet or submit verifiable membership info. ThyAdmin confirms — not instant.</div>
                </button>
              </div>

              {subscription === 'free' && (
                <div className="br-wallet-box">
                  <div className="br-wallet-box-title">Verify your waiver</div>
                  <div className="br-wallet-box-sub">Connect your wallet to verify NFT ownership, or paste your {config.companyName.replace(' Inc.', '')} membership details below. ThyAdmin reviews within 1–2 business days.</div>
                  <button type="button" className="br-wallet-btn">⛓ Connect Wallet</button>
                  <div className="br-wallet-or">— or enter membership info manually —</div>
                  <input className="br-wallet-input" placeholder={`${config.companyName.replace(' Inc.', '')} membership ID or wallet address`} value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)}/>
                  <div className="br-wallet-note">Your waiver is pending until ThyAdmin confirms. You will be notified by email. Standard $9.99/week applies until confirmed.</div>
                </div>
              )}

              <div style={{ marginTop: '1.4rem' }}>
                <div className="br-field-label" style={{ marginBottom: '.8rem' }}>Professional Standard</div>
                <div className="br-pledge-box">
                  <div className={'br-pledge-check' + (pledged ? ' checked' : '')} onClick={() => setPledged(p => !p)}>{pledged ? '✓' : ''}</div>
                  <div className="br-pledge-text">
                    <strong>I agree to the {config.serviceName} Professional Standard.</strong> I represent myself and my clients with professionalism on every visit. I understand that my conduct is subject to the {config.serviceName} end-of-appointment check-in system, and that repeated unprofessional conduct may result in suspension or removal from the platform.
                  </div>
                </div>
              </div>

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(5)}>&larr; Back</button>
                <div className="br-step-count">Step <strong>6</strong> of 7</div>
                <button type="button" className="br-btn-next" onClick={() => goTo(7)}>Review &rarr;</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="br-panel-head">
                <div className="br-panel-step">Step 7 of 7</div>
                <div className="br-panel-title">Review your application</div>
                <div className="br-panel-sub">Everything looks good? Submit to ThyAdmin for review. You&rsquo;ll hear back within 1–2 business days.</div>
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Basic Info <button type="button" className="br-review-edit" onClick={() => goTo(1)}>Edit</button></div>
                <div className="br-review-row"><span className="br-review-key">Name</span><span className="br-review-val">{fullName}</span></div>
                <div className="br-review-row"><span className="br-review-key">Email</span><span className="br-review-val">{email || '—'}</span></div>
                <div className="br-review-row"><span className="br-review-key">Phone</span><span className="br-review-val">{phone || '—'}</span></div>
                <div className="br-review-row"><span className="br-review-key">Profile photo</span><span className="br-review-val" style={{ color: profilePhoto ? '#3B6D11' : '#9A9AAA' }}>{profilePhoto ? '✓ Uploaded' : 'Not uploaded'}</span></div>
                <div className="br-review-row"><span className="br-review-key">Logo</span><span className="br-review-val" style={{ color: logo ? '#3B6D11' : '#9A9AAA' }}>{logo ? '✓ Uploaded' : 'Not uploaded'}</span></div>
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Location <button type="button" className="br-review-edit" onClick={() => goTo(2)}>Edit</button></div>
                <div className="br-review-row"><span className="br-review-key">Type</span><span className="br-review-val">{locType === 'shop' ? 'Shop-based' : locType === 'mobile' ? 'Mobile' : 'Shop & Mobile'}</span></div>
                {(locType === 'shop' || locType === 'both') && (
                  <>
                    <div className="br-review-row"><span className="br-review-key">Shop name</span><span className="br-review-val">{shopName || '—'}</span></div>
                    <div className="br-review-row"><span className="br-review-key">Address</span><span className="br-review-val">{[shopAddress, shopCity, shopState, shopZip].filter(Boolean).join(', ') || '—'}</span></div>
                  </>
                )}
                {(locType === 'mobile' || locType === 'both') && (
                  <div className="br-review-row"><span className="br-review-key">Mobile area</span><span className="br-review-val">{[mobileCity, mobileState, mobileZip].filter(Boolean).join(', ') || '—'}</span></div>
                )}
                <div className="br-review-row"><span className="br-review-key">Service ZIPs</span><span className="br-review-val" style={{ fontFamily: "'DM Mono',monospace" }}>{Array.from(serviceZips).join(' · ') || '—'}</span></div>
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Credentials <button type="button" className="br-review-edit" onClick={() => goTo(3)}>Edit</button></div>
                <div className="br-review-row"><span className="br-review-key">Driver license</span><span className="br-review-val" style={{ fontFamily: "'DM Mono', monospace" }}>{dlNumber || '—'}</span></div>
                {barberLicOn && <div className="br-review-row"><span className="br-review-key">Barber license</span><span className="br-review-val" style={{ fontFamily: "'DM Mono', monospace" }}>{barberLicNumber || '—'}</span></div>}
                {barberLicOn && barberLicExpiry && <div className="br-review-row"><span className="br-review-key">License expires</span><span className="br-review-val">{barberLicExpiry}</span></div>}
                {(locType === 'shop' || locType === 'both') && <div className="br-review-row"><span className="br-review-key">Shop license</span><span className="br-review-val" style={{ color: shopLicense ? '#3B6D11' : '#9A9AAA' }}>{shopLicense ? '✓ Uploaded' : 'Not uploaded'}</span></div>}
                <div className="br-review-row"><span className="br-review-key">Experience</span><span className="br-review-val">{experience || '—'}</span></div>
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Service Menu <button type="button" className="br-review-edit" onClick={() => goTo(4)}>Edit</button></div>
                {services.filter(s => s.name).map(s => (
                  <div key={s.id} className="br-review-row">
                    <span className="br-review-key">{s.name}</span>
                    <span className="br-review-val">{[s.duration, s.price].filter(Boolean).join(' · ') || '—'}</span>
                  </div>
                ))}
                {services.filter(s => s.name).length === 0 && <div className="br-review-row"><span className="br-review-key">Services</span><span className="br-review-val" style={{ color: '#9A9AAA' }}>None added</span></div>}
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Specialties <button type="button" className="br-review-edit" onClick={() => goTo(5)}>Edit</button></div>
                <div className="br-review-row"><span className="br-review-key">Selected</span><span className="br-review-val">{Array.from(activeSpecs).join(' · ') || '—'}</span></div>
              </div>

              <div className="br-review-section">
                <div className="br-review-section-title">Plan <button type="button" className="br-review-edit" onClick={() => goTo(6)}>Edit</button></div>
                <div className="br-review-row"><span className="br-review-key">Subscription</span><span className="br-review-val">{subscriptionLabel}</span></div>
                <div className="br-review-row"><span className="br-review-key">Professional Standard</span><span className="br-review-val" style={{ color: pledged ? '#3B6D11' : '#b42828' }}>{pledged ? '✓ Agreed' : 'Not agreed'}</span></div>
              </div>

              {submitError && (
                <div className="br-info-note" style={{ background: 'rgba(180,40,40,.07)', borderColor: 'rgba(180,40,40,.25)', color: '#b42828', marginTop: '1rem' }}>
                  <strong>Submission failed:</strong> {submitError}
                </div>
              )}

              <div className="br-nav-row">
                <button type="button" className="br-btn-back" onClick={() => goTo(6)} disabled={submitting}>&larr; Back</button>
                <div className="br-step-count">Step <strong>7</strong> of 7</div>
                <button type="button" className="br-btn-submit" onClick={submitApplication} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Application →'}</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
