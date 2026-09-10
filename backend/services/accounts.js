import { load, persist } from './db.js';
import { balance } from './ledger.js';

export function save(req, res){
  const { phone, data } = req.body || {};
  if (!phone || !data) return res.status(400).json({ error: 'phone and data are required' });
  const db = load();
  db.accounts[phone] = { data, updatedAt: new Date().toISOString() };
  persist();
  res.json({ ok: true, phone, updatedAt: db.accounts[phone].updatedAt });
}

export function get(req, res){
  const db = load();
  const acc = db.accounts[req.params.phone];
  if (!acc) return res.status(404).json({ error: 'No stored account for this phone yet' });
  res.json(acc);
}

export { balance };