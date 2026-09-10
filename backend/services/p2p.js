import { load, persist } from './db.js';
function store(){ const db = load(); if (!db.p2p) db.p2p = {}; return db.p2p; }
export function create(req, res){
  const o = req.body || {};
  if (!o.code || !o.symbol || !o.units || !o.total) return res.status(400).json({ error:'code, symbol, units and total are required' });
  const p = store();
  p[o.code] = Object.assign({}, o, { status:'open', createdAt:new Date().toISOString() });
  persist();
  res.json({ ok:true, code:o.code });
}
export function get(req, res){
  const o = store()[req.params.code];
  if (!o) return res.status(404).json({ error:'No open order for that code' });
  res.json(o);
}
export function complete(req, res){
  const o = store()[req.params.code];
  if (!o) return res.status(404).json({ error:'Unknown code' });
  o.status = 'completed'; o.completedAt = new Date().toISOString();
  persist();
  res.json({ ok:true, order:o });
}