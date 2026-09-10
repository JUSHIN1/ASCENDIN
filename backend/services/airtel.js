// Airtel Money adapter (UAT Open API)
async function token(){
  const r = await fetch(process.env.AIRTEL_BASE + '/auth/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(process.env.AIRTEL_CLIENT_ID + ':' + process.env.AIRTEL_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('Airtel token failed: ' + r.status);
  return (await r.json()).access_token;
}

export async function requestToPay(user, amount, ref){
  const t = await token();
  const r = await fetch(process.env.AIRTEL_BASE + '/payments/', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference: ref,
      subscriber: { msisdn: user.phone },
      transaction: { amount, id: ref },
      notification: { callbackUrl: process.env.PUBLIC_CALLBACK + '/webhooks/airtel' }
    })
  });
  if (!r.ok && r.status !== 202) throw new Error('Airtel payments failed: ' + r.status);
}

export async function disburse(user, amount, ref){
  const t = await token();
  const r = await fetch(process.env.AIRTEL_BASE + '/disbursements/', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference: ref,
      disbursements: [{ msisdn: user.phone, amount, id: ref }],
      notification: { callbackUrl: process.env.PUBLIC_CALLBACK + '/webhooks/airtel' }
    })
  });
  if (!r.ok && r.status !== 202) throw new Error('Airtel disbursements failed: ' + r.status);
}