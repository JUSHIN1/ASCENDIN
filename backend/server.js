// Ascendin backend - Express shell that wires together the service modules.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { load, persist } from './services/db.js';
import { post } from './services/ledger.js';
import * as kyc from './services/kyc.js';
import * as accounts from './services/accounts.js';
import * as mtn from './services/mtn.js';
import * as airtel from './services/airtel.js';
import * as market from './services/market.js';
import * as p2p from './services/p2p.js';
import * as flw from './services/flutterwave.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../Frontend'));

// KYC
app.post('/api/kyc/register', kyc.register);

// Account storage
app.post('/api/accounts', accounts.save);
app.get('/api/accounts/:phone', accounts.get);
app.post('/api/p2p', p2p.create);
app.get('/api/p2p/:code', p2p.get);
app.post('/api/p2p/:code/complete', p2p.complete);
app.post('/api/deposits/fw', flw.deposit);
app.get('/api/deposits/fw/status/:ref', flw.depositStatus);
app.post('/api/withdrawals/fw', flw.withdraw);
app.get('/api/withdrawals/fw/status/:ref', flw.withdrawStatus);
app.post('/api/webhooks/flutterwave', flw.webhook);

// Deposits / withdrawals
app.post('/api/deposits', async (req, res) => {
  const { phone, amount, network } = req.body || {};
  const db = load();
  const user = db.users[phone];
  if (!user) return res.status(404).json({ error: 'Register KYC first.' });
  if (!(amount >= 500 && amount <= 5000000)) return res.status(400).json({ error: 'Amount must be 500 to 5,000,000' });
  if (!['MTN','AIRTEL'].includes(network)) return res.status(400).json({ error: 'network must be MTN or AIRTEL' });
  const ref = crypto.randomUUID();
  db.requests[ref] = { ref, phone, amount, network, type: 'deposit', status: 'pending' };
  persist();
  try {
    if (network === 'MTN') await mtn.requestToPay(user, amount, ref);
    else await airtel.requestToPay(user, amount, ref);
    res.json({ ref, status: 'pending', message: 'Payment request sent. PIN prompt goes to ' + phone });
  } catch (e) {
    db.requests[ref].status = 'failed'; persist();
    res.status(502).json({ error: String(e.message || e) });
  }
});

app.post('/api/withdrawals', async (req, res) => {
  const { phone, amount, network } = req.body || {};
  const db = load();
  const user = db.users[phone];
  if (!user) return res.status(404).json({ error: 'Register KYC first.' });
  if (!(amount >= 1000 && amount <= 5000000)) return res.status(400).json({ error: 'Amount must be 1,000 to 5,000,000' });
  const fee = Math.round(amount * (network === 'MTN' ? 0.015 : 0.010));
  const balance = accounts.balance(phone);
  if (balance < amount + fee) return res.status(400).json({ error: 'Insufficient balance including fee' });
  const ref = crypto.randomUUID();
  db.requests[ref] = { ref, phone, amount, network, type: 'withdraw', status: 'pending' };
  post('user:' + phone, 'hold:' + phone, amount, ref, 'Withdrawal hold');
  persist();
  try {
    if (network === 'MTN') await mtn.disburse(user, amount, ref);
    else await airtel.disburse(user, amount, ref);
    res.json({ ref, status: 'pending', fee, message: 'Disbursement instructed to ' + phone });
  } catch (e) {
    settle(ref, false);
    res.status(502).json({ error: String(e.message || e) });
  }
});

// Telco webhooks
app.post('/webhooks/mtn', (req, res) => {
  const ref = req.headers['x-reference-id'] || (req.body || {}).externalId;
  const st = String((req.body || {}).status || '').toUpperCase();
  settle(ref, st === 'SUCCESSFUL' || st === 'SUCCESS');
  res.json({ ok: true });
});
app.post('/webhooks/airtel', (req, res) => {
  const b = req.body || {};
  const ref = b.reference || b.id;
  const ok = /success/i.test((b.result && b.result.status) || b.status || '');
  settle(ref, ok);
  res.json({ ok: true });
});
function settle(ref, ok){
  const db = load();
  const r = db.requests[ref];
  if (!r || r.status !== 'pending') return;
  if (ok){
    if (r.type === 'deposit'){
      post('float:' + r.network, 'user:' + r.phone, r.amount, ref, 'Deposit');
    } else {
      post('hold:' + r.phone, 'float:' + r.network, r.amount, ref, 'Withdrawal');
      const fee = Math.round(r.amount * (r.network === 'MTN' ? 0.015 : 0.010));
      if (fee > 0) post('hold:' + r.phone, 'ops:revenue', fee, ref, 'Withdrawal fee');
    }
    r.status = 'success';
  } else {
    if (r.type === 'withdraw') post('hold:' + r.phone, 'user:' + r.phone, r.amount, ref, 'Hold reversal');
    r.status = 'failed';
  }
  db.txns.push({ ref, type: r.type, phone: r.phone, amount: r.amount, network: r.network, status: r.status, ts: new Date().toISOString() });
  persist();
}

// Market data
app.get('/api/market/stocks', market.stocks);
app.get('/api/market/stocks/:id/history', market.history);

// Health
app.get('/api/health', (_req, res) => {
  const db = load();
  res.json({
    ok: true,
    mode: (process.env.MTN_COLLECTIONS_KEY ? 'mtn-sandbox ' : 'mtn-off ') +
          (process.env.AIRTEL_CLIENT_ID ? 'airtel-sandbox' : 'airtel-off'),
    accounts: Object.keys(db.accounts).length,
        flw: process.env.FLW_SECRET_KEY ? 'live' : 'off',
    callback: (process.env.PUBLIC_CALLBACK || 'not set')
  });
});

import crypto from 'crypto';
app.listen(process.env.PORT || 8080, () => console.log('Ascendin backend on ' + (process.env.PORT || 8080)));