/* ============================================================
   AUTH UTILITIES — Password hashing + JWT sessions
   Uses Web Crypto API (no native dependencies)
   ============================================================ */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'thybarbershop-jwt-secret-change-in-production-min-32-chars!!'
);

const JWT_ISSUER = 'thyfreelancer';
const JWT_EXPIRY = '7d';

/* ── Password hashing (PBKDF2 via Web Crypto) ──────────────── */

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashArray = new Uint8Array(bits);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, storedHashHex] = stored.split(':');
  if (!saltHex || !storedHashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === storedHashHex;
}

/* ── JWT session tokens ─────────────────────────────────────── */

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function createSession(payload: Omit<SessionPayload, 'iss' | 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: JWT_ISSUER });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/* ── Get session from cookie ────────────────────────────────── */

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('thybarbershop_session')?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}

/* ── Driver code generation ─────────────────────────────────── */

export function generateCodeDigits(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
