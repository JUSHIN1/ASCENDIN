// Market data: REAL quotes for US stocks/ETFs via Yahoo Finance proxy (60s cache),
// simulated for USE and new listings (no free live feed exists for the USE).
const CATALOG = [
  { id:'MTNU', cur:'UGX', base:195 }, { id:'UMEME', cur:'UGX', base:267 },
  { id:'SBU', cur:'UGX', base:42 }, { id:'DFCU', cur:'UGX', base:210 },
  { id:'BATU', cur:'UGX', base:8200 }, { id:'EQTY', cur:'UGX', base:1650 },
  { id:'PLRX', cur:'UGX', base:640 }, { id:'KLAT', cur:'UGX', base:118 },
  { id:'NBSE', cur:'UGX', base:355 }, { id:'RVLC', cur:'UGX', base:92 },
  { id:'HUT', cur:'USD', base:76.98 }, { id:'TSLA', cur:'USD', base:355.82 },
  { id:'NVDA', cur:'USD', base:217.27 }, { id:'GOOGL', cur:'USD', base:337.13 },
  { id:'AMZN', cur:'USD', base:254.00 }, { id:'AAPL', cur:'USD', base:325.11 },
  { id:'MSFT', cur:'USD', base:428.10 }, { id:'META', cur:'USD', base:504.30 },
  { id:'COIN', cur:'USD', base:177.08 }, { id:'SPY', cur:'USD', base:543.20 },
  { id:'QQQ', cur:'USD', base:468.90 }
];
function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return Math.abs(h); }
function mulberry(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function simQuote(c){
  const day = new Date().toISOString().slice(0,10);
  const rnd = mulberry(hash(c.id + day));
  const chg = (rnd() - 0.48) * 6;
  return { id:c.id, cur:c.cur, price:+(c.base*(1+chg/100)).toFixed(2), chg:+chg.toFixed(2), live:false };
}
async function yahooQuote(id){
  const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+id+'?interval=5m&range=1d', { headers:{ 'User-Agent':'Mozilla/5.0' } });
  if (!r.ok) throw new Error('yahoo '+r.status);
  const j = await r.json();
  const meta = j.chart.result[0].meta;
  return { price: meta.regularMarketPrice, chg: meta.regularMarketChangePercent || 0 };
}
let quoteCache = { ts:0, data:null };
export async function stocks(_req, res){
  const now = Date.now();
  if (quoteCache.data && now - quoteCache.ts < 60000) return res.json(quoteCache.data);
  const us = CATALOG.filter(c => c.cur === 'USD');
  const settled = await Promise.allSettled(us.map(c => yahooQuote(c.id)));
  const liveMap = {};
  settled.forEach((s, i) => { if (s.status === 'fulfilled') liveMap[us[i].id] = s.value; });
  const data = CATALOG.map(c => {
    const q = liveMap[c.id];
    if (q && q.price) return { id:c.id, cur:c.cur, price:+q.price.toFixed(2), chg:+(q.chg||0).toFixed(2), live:true };
    return simQuote(c);
  });
  quoteCache = { ts: now, data };
  res.json(data);
}
const RANGE = { '1D':['1d','5m'], '1W':['5d','30m'], '1M':['1mo','1d'], '1Y':['1y','1d'], 'All':['5y','1wk'] };
export async function history(req, res){
  const c = CATALOG.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error:'Unknown symbol' });
  const tf = req.query.tf || '1D';
  if (c.cur === 'USD'){
    try {
      const [range, interval] = RANGE[tf] || RANGE['1D'];
      const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+c.id+'?range='+range+'&interval='+interval, { headers:{ 'User-Agent':'Mozilla/5.0' } });
      if (r.ok){
        const j = await r.json();
        const close = j.chart.result[0].indicators.quote[0].close || [];
        const series = close.filter(v => v != null).map(v => +v.toFixed(2));
        if (series.length > 1) return res.json({ symbol:c.id, tf, series, live:true });
      }
    } catch(e){ /* fall back to simulated */ }
  }
  const rnd = mulberry(hash(c.id + tf));
  const n = 90; const pts = [];
  let v = c.base * (1 - (rnd() - 0.5) * 0.1);
  for (let i=0;i<n;i++){ v += (rnd() - 0.5) * c.base * 0.01; pts.push(+v.toFixed(2)); }
  res.json({ symbol:c.id, tf, series: pts, live:false });
}