// Flutterwave rails: mobile money collections (deposits) and transfers (withdrawals).
// Keys from dashboard.flutterwave.com -> Settings -> API (use TEST mode keys first).
import crypto from 'crypto';
import { load, persist } from './db.js';
import { post } from './ledger.js';

const BASE = 'https://api.flutterwave.com/v3';
function auth(){ return { 'Authorization': 'Bearer ' + process.env.FLW_SECRET_KEY, 'Content-Type': 'application/json' }; }
function store(){ const db = load(); if (!db.requests) db.requests = {}; return db.requests; }

function creditAccount(phone, amount, memo, ref){
  const db = load();
  post('float:FLW', 'user:' + phone, amount, ref, memo);
  const acc = db.accounts && db.accounts[phone];
  if (acc && acc.data){ acc.data.balance = (acc.data.balance || 0) + amount; }
  persist();
}
function debitAccount(phone, amount, memo, ref){
  const db = load();
  post('user:' + phone, 'float:FLW', amount, ref, memo);
  const acc = db.accounts && db.accounts[phone];
  if (acc && acc.data){ acc.data.balance = Math.max(0, (acc.data.balance || 0) - amount); }
  persist();
}

export async function deposit(req, res){
  const { phone, amount, network } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });
  if (!process.env.FLW_SECRET_KEY) return res.status(503).json({ error: 'Flutterwave not configured' });
  const ref = 'ASC-' + crypto.randomUUID().slice(0, 12);
  try {
    const r = await fetch(BASE + '/charges', {
      method: 'POST', headers: auth(),
      body: JSON.stringify({
        tx_ref: ref, amount, currency: 'UGX', payment_type: 'mobile_money',
        mobile_money: { network: network === 'MTN' ? 'mtn' : 'airtel', phone },
        customer: { email: phone + '@ascendin.app', name: 'Ascendin user', phonenumber: phone },
        meta: { source: 'ascendin-app' }
      })
    });
    const j = await r.json();
    const d = j.data || {};
    store()[ref] = { ref, phone, amount, network, type: 'deposit', status: 'pending', flwId: d.id || null };
    persist();
    res.json({ ref, link: d.link || null, status: d.status || 'pending' });
  } catch (e) { res.status(502).json({ error: String(e.message || e) }); }
}

export async function depositStatus(req, res){
  const r = store()[req.params.ref];
  if (!r) return res.status(404).json({ error: 'unknown ref' });
  if (r.status === 'pending' && r.flwId){
    try {
      const v = await fetch(BASE + '/transactions/' + r.flwId + '/verify', { headers: auth() });
      const j = await v.json();
      if (j.data && j.data.status === 'successful') settleDeposit(r);
      else if (j.data && j.data.status === 'failed'){ r.status = 'failed'; persist(); }
    } catch (e) {}
  }
  res.json({ status: r.status });
}
function settleDeposit(r){
  if (r.status !== 'pending') return;
  r.status = 'success';
  creditAccount(r.phone, r.amount, 'Deposit via Flutterwave ' + r.network, r.ref);
}

export async function withdraw(req, res){
  const { phone, amount, network } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });
  if (!process.env.FLW_SECRET_KEY) return res.status(503).json({ error: 'Flutterwave not configured' });
  const db = load();
  const acc = db.accounts && db.accounts[phone];
  const bal = acc && acc.data ? acc.data.balance : 0;
  if (amount > bal) return res.status(400).json({ error: 'Insufficient balance' });
  const net = network || 'MTN';
  const ref = 'ASCW-' + crypto.randomUUID().slice(0, 12);
  try {
    const r = await fetch(BASE + '/transfers', {
      method: 'POST', headers: auth(),
      body: JSON.stringify({
        reference: ref, amount, currency: 'UGX',
        beneficiary: { bank_code: net === 'MTN' ? 'MTN_UG' : 'AIRTEL_UG', account_number: phone }
      })
    });
    const j = await r.json();
    const d = j.data || {};
    store()[ref] = { ref, phone, amount, network: net, type: 'withdraw', status: d.status === 'SUCCESSFUL' ? 'success' : 'pending', flwId: d.id || null };
    if (store()[ref].status === 'success') debitAccount(phone, amount, 'Withdrawal via Flutterwave', ref);
    persist();
    res.json({ ref, status: store()[ref].status });
  } catch (e) { res.status(502).json({ error: String(e.message || e) }); }
}

export async function withdrawStatus(req, res){
  const r = store()[req.params.ref];
  if (!r) return res.status(404).json({ error: 'unknown ref' });
  if (r.status === 'pending' && r.flwId){
    try {
      const v = await fetch(BASE + '/transfers/' + r.flwId, { headers: auth() });
      const j = await v.json();
      if (j.data && j.data.status === 'SUCCESSFUL'){ r.status = 'success'; debitAccount(r.phone, r.amount, 'Withdrawal via Flutterwave', r.ref); persist(); }
      else if (j.data && j.data.status === 'FAILED'){ r.status = 'failed'; persist(); }
    } catch (e) {}
  }
  res.json({ status: r.status });
}

export function webhook(req, res){
  const hash = process.env.FLW_WEBHOOK_HASH;
  if (hash && req.headers['verif-hash'] !== hash) return res.status(401).json({ error: 'bad signature' });
  const b = req.body || {};
  if (b.event === 'charge.completed' && b.data && b.data.tx_ref){
    const r = store()[b.data.tx_ref];
    if (r && r.type === 'deposit' && b.data.status === 'successful') settleDeposit(r);
    persist();
  }
  if (b.event === 'transfer.completed' && b.data && b.data.reference){
    const r = store()[b.data.reference];
    if (r && r.type === 'withdraw' && b.data.status === 'SUCCESSFUL'){ r.status = 'success'; debitAccount(r.phone, r.amount, 'Withdrawal via Flutterwave', r.ref); persist(); }
  }
  res.json({ ok: true });
}
