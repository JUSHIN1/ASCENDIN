// MTN MoMo adapter: Collections (deposit requesttopay) and Disbursements (withdrawal transfer)
import { load } from './db.js';

async function token(product, key){
  const r = await fetch(process.env.MTN_BASE + '/' + product + '/token/', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(':' + key).toString('base64'),
      'Ocp-Apim-Subscription-Key': key
    }
  });
  if (!r.ok) throw new Error('MTN token failed: ' + r.status);
  return (await r.json()).access_token;
}

export async function requestToPay(user, amount, ref){
  const key = process.env.MTN_COLLECTIONS_KEY;
  const t = await token('collection', key);
  const r = await fetch(process.env.MTN_BASE + '/collection/v1_0/requesttopay', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + t,
      'Ocp-Apim-Subscription-Key': key,
      'X-Reference-Id': ref,
      'X-Target-Environment': 'sandbox',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: String(amount), currency: 'UGX', externalId: ref,
      payer: { partyIdType: 'MSISDN', partyId: user.phone },
      payeeNote: 'Ascendin deposit', payerMessage: 'Ascendin'
    })
  });
  if (r.status !== 202) throw new Error('MTN requesttopay failed: ' + r.status);
}

export async function disburse(user, amount, ref){
  const key = process.env.MTN_DISBURSEMENTS_KEY;
  const t = await token('disbursement', key);
  const r = await fetch(process.env.MTN_BASE + '/disbursement/v1_0/transfer', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + t,
      'Ocp-Apim-Subscription-Key': key,
      'X-Reference-Id': ref,
      'X-Target-Environment': 'sandbox',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: String(amount), currency: 'UGX', externalId: ref,
      payee: { partyIdType: 'MSISDN', partyId: user.phone },
      payerMessage: 'Ascendin withdrawal', payeeNote: 'Ascendin'
    })
  });
  if (r.status !== 202) throw new Error('MTN transfer failed: ' + r.status);
}