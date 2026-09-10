import crypto from 'crypto';
import { load, persist } from './db.js';

export function post(debit, credit, amount, ref, memo){
  const db = load();
  db.journal.push({
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    debit, credit, amount, ref, memo
  });
}

export function balance(phone){
  const db = load();
  let b = 0;
  for (const j of db.journal){
    if (j.credit === 'user:' + phone) b += j.amount;
    if (j.debit  === 'user:' + phone) b -= j.amount;
  }
  return b;
}