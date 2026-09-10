import { load, persist } from './db.js';

export function register(req, res){
  const { phone, name, nin } = req.body || {};
  if (!/^2567\d{8}$/.test(phone || '')) return res.status(400).json({ error: 'Phone must be 2567XXXXXXXX' });
  if (!name || !nin) return res.status(400).json({ error: 'name and nin are required' });
  const db = load();
  if (db.users[phone]) return res.status(409).json({ error: 'User already exists' });
  // NIRA national-ID verification is stubbed here.
  db.users[phone] = { phone, name, nin, kyc: 'verified', createdAt: new Date().toISOString() };
  persist();
  res.json({ user: db.users[phone], balance: 0, note: 'KYC verified (NIRA check stubbed in sandbox)' });
}