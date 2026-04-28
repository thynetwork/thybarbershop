/* ============================================================
   Demo account plan flag — drives the conditional Household nav
   item, the R1 member selector, and the RS1 membership card.
   In production this comes from the session/user record.
   ============================================================ */

export type AccountPlan = 'single' | 'household';

/** Current logged-in client's plan. Demo default: household. */
export const ACCOUNT_PLAN: AccountPlan = 'household';

/** Household renewal date — surfaces on RS1 and HH1. */
export const HOUSEHOLD_RENEWAL = 'July 3, 2027';

export interface HouseholdMember {
  id: string;
  initials: string;
  name: string;
  shortName: string;
  clientId: string;
  bg: string;
  fg: string;
  primary?: boolean;
}

export const HOUSEHOLD_MEMBERS: HouseholdMember[] = [
  { id: 'm1', initials: 'RG', name: 'Rayford Gibson', shortName: 'Rayford', clientId: 'RAYF·8834', bg: '#F5A623', fg: '#0a0a2e', primary: true },
  { id: 'm2', initials: 'MG', name: 'Margaret Gibson', shortName: 'Margaret', clientId: 'MARG·4421', bg: '#6b3fc8', fg: '#fff' },
  { id: 'm3', initials: 'DR', name: 'Darius Gibson', shortName: 'Darius', clientId: 'DRAY·5501', bg: '#1565c0', fg: '#fff' },
  { id: 'm4', initials: 'KG', name: 'Kevin Gibson', shortName: 'Kevin', clientId: 'KRAY·6612', bg: '#2e7d32', fg: '#fff' },
  { id: 'm5', initials: 'SG', name: 'Shayla Gibson', shortName: 'Shayla', clientId: 'SLEY·7723', bg: '#a0522d', fg: '#fff' },
];
