/* Additive UI layer v2 - defensive. Never edits core files. */
(function(){
  var A = window.Ascendin;

  function bondFallback(){
    var el = A.$('bond-list'); if (!el || !A.BONDS || !A.BONDS.length) return;
    var h = '';
    for (var i=0;i<A.BONDS.length;i++){
      var b = A.BONDS[i];
      h += '<div class="bond-card" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')">'+
        '<div class="bc-top"><span class="bc-type">'+b.type+'</span><span class="bc-risk">'+b.risk+' risk</span></div>'+
        '<div class="bc-name">'+b.name+'</div>'+
        '<div class="bc-issuer">'+b.issuer+'</div>'+
        '<div class="bc-rate-row"><span class="bc-rate">'+b.rate.toFixed(1)+'<em>% / yr</em></span><span class="bc-tenor">1-24 months</span></div>'+
        '<div class="bc-bar"><i style="width:'+Math.max(8,Math.round(b.rate/25))+'%"></i></div>'+
        '<div class="bc-min">from '+A.ugx(b.min)+'</div></div>';
    }
    el.innerHTML = h;
  }

  function fillHero(){
    var bestM=0,bestMin=0,inv=0,inc=0,e;
    for(var i=0;i<A.BONDS.length;i++){ var m=A.BONDS[i].min*A.BONDS[i].rate/100/12; if(m>bestM){bestM=m;bestMin=A.BONDS[i].min;} }
    if (A.state && A.state.bondHold) for (var k in A.state.bondHold){ var bd=null; for(var x=0;x<A.BONDS.length;x++) if(A.BONDS[x].id===k) bd=A.BONDS[x]; if(bd){ inv+=A.state.bondHold[k].amount; inc+=A.state.bondHold[k].amount*bd.rate/100; } }
    if((e=A.$('bond-top'))) e.textContent=A.ugx(bestM)+' / mo';
    if((e=A.$('bond-top-sub'))) e.textContent='from a '+A.ugx(bestMin)+' investment';
    if((e=A.$('bond-mine'))) e.textContent=A.ugx(inv);
    if((e=A.$('bond-mine-year'))) e.textContent='projects '+A.ugx(inc)+' per year';
  }

  function onBoot(){
    var old=document.querySelector('.bond-hero');
    if(old){ old.outerHTML='<div class="bond-hero-card"><span id="bond-toprate" style="display:none"></span><div class="bhc-row"><div><div class="muted small">Earn up to</div><div class="big" id="bond-top">UGX 0</div><div class="muted small" id="bond-top-sub">per month</div></div><div class="bhc-right"><div class="muted small">Your fixed income</div><div class="bold" id="bond-mine">UGX 0</div><div class="muted small" id="bond-mine-year">projects UGX 0 per year</div></div></div></div>'; }
    var vb=A.$('view-bonds');
    if(vb&&!A.$('bonds-bg')){ vb.insertAdjacentHTML('afterbegin','<div class="home-bg" id="bonds-bg"><video id="bonds-video" autoplay muted loop playsinline preload="metadata"></video><div class="home-bg-fade"></div></div>'); }
    var nl=A.$('news-list');
    if(nl&&nl.parentNode.className!=='news-auto'){ var w=document.createElement('div'); w.className='news-auto'; nl.parentNode.insertBefore(w,nl); w.appendChild(nl); }
    var unlock=function(){
      ['home-video','bonds-video'].forEach(function(id){ var v=A.$(id); if(v&&v.paused){ v.play().catch(function(){}); } });
      document.removeEventListener('pointerdown',unlock); document.removeEventListener('keydown',unlock);
    };
    document.addEventListener('pointerdown',unlock); document.addEventListener('keydown',unlock);
  }

  var bR=A.Bonds.render;
  A.Bonds.render=function(){
    try{ bR.apply(A.Bonds,arguments); }catch(e){ bondFallback(); }
    var bl=A.$('bond-list');
    if(!bl || bl.children.length===0){ bondFallback(); }
    fillHero();
    A.Bonds.initVideoX();
  };

  var hR=A.Home.render;
  A.Home.render=function(){ try{ hR.apply(A.Home,arguments); }catch(e){} };
  A.Bonds.initVideoX=function(){
    var v=A.$('bonds-video'),wrap=A.$('bonds-bg');
    if(!v||!wrap||!A.Home.videoList) return;
    var list=A.Home.videoList(); if(!list.length) return;
    list=list.slice(3).concat(list.slice(0,3));
    if(v.dataset.ready==='1'){ if(v.paused&&v.play)v.play().catch(function(){}); return; }
    v.dataset.ready='1'; v.dataset.list=JSON.stringify(list); v.dataset.idx='0'; v.loop=true;
    v.onerror=function(){ wrap.style.display='none'; };
    v.src=list[0];
    if(v.play)v.play().catch(function(){ wrap.style.display='none'; });
    setInterval(function(){
      if(document.hidden) return;
      var s=A.$('view-bonds'); if(!s||!s.classList.contains('active')) return;
      var L=[]; try{L=JSON.parse(v.dataset.list||'[]');}catch(e){}
      if(!L.length) return;
      var i=(parseInt(v.dataset.idx||'0',10)+1)%L.length; v.dataset.idx=String(i);
      v.currentTime=0; v.src=L[i]; if(v.play)v.play().catch(function(){});
    },15000);
  };

  function sweep(){
    try{ if(A.state){ A.Stocks.renderStockTabs(); A.Stocks.renderStocks(); A.Bonds.render(); A.Home.render(); } }catch(e){}
  }
  setTimeout(sweep,0); setTimeout(sweep,500); setTimeout(sweep,1500);

  onBoot();
  /* ---- market expansion: validated, deduped, cannot break core ---- */
  (function(){
    try{
      var have={}; A.STOCKS.forEach(function(x){ have[x.id]=1; });
      var pal=['#f97316','#0ea5e9','#16a34a','#dc2626','#7c3aed','#0891b2','#b45309','#db2777','#059669','#4f46e5','#ca8a04','#0d9488'];
      var R=[['SAFCOM','Safaricom PLC','Telecom','Kenya',2500,'AFR','UGX'],['COOP','Co-op Bank Kenya','Banking','Kenya',900,'AFR','UGX'],['EABL','East African Breweries','Consumer','Kenya',15000,'AFR','UGX'],['KPLC','Kenya Power','Utilities','Kenya',700,'AFR','UGX'],['BAMB','Bamburi Cement','Industrial','Kenya',4200,'AFR','UGX'],['DANGCEM','Dangote Cement','Industrial','Nigeria',45000,'AFR','UGX'],['GTCO','GT Holdings','Banking','Nigeria',3800,'AFR','UGX'],['ZENITH','Zenith Bank','Banking','Nigeria',2600,'AFR','UGX'],['MTNN','MTN Nigeria','Telecom','Nigeria',21000,'AFR','UGX'],['SEPLAT','Seplat Energy','Energy','Nigeria',19000,'AFR','UGX'],['ACCESS','Access Holdings','Banking','Nigeria',1200,'AFR','UGX'],['NNF','Nestle Nigeria','Consumer','Nigeria',25000,'AFR','UGX'],['NPN','Naspers','Internet','South Africa',320000,'AFR','UGX'],['AGL','Anglo American','Mining','South Africa',28000,'AFR','UGX'],['SHP','Shoprite','Retail','South Africa',17000,'AFR','UGX'],['FSR','FirstRand','Banking','South Africa',5200,'AFR','UGX'],['SOL','Sasol','Chemicals','South Africa',14000,'AFR','UGX'],['REM','Remgro','Holdings','South Africa',9000,'AFR','UGX'],['IMP','Impala Platinum','Mining','South Africa',11000,'AFR','UGX'],['NED','Nedbank Group','Banking','South Africa',16000,'AFR','UGX'],['COMI','Commercial Intl Bank','Banking','Egypt',1900,'AFR','UGX'],['TMG','Talaat Moustafa Group','Real Estate','Egypt',1500,'AFR','UGX'],['EAST','Eastern Co','Consumer','Egypt',1700,'AFR','UGX'],['GCB','GCB Bank','Banking','Ghana',4200,'AFR','UGX'],['CRDB','CRDB Bank','Banking','Tanzania',2100,'AFR','UGX'],['VDT','Vodacom Tanzania','Telecom','Tanzania',1300,'AFR','UGX'],['BKR','Bank of Kigali','Banking','Rwanda',900,'AFR','UGX'],['FNBB','FNB Botswana','Banking','Botswana',3000,'AFR','UGX'],['MCB','MCB Group','Banking','Mauritius',8000,'AFR','UGX'],['ATW','Attijariwafa Bank','Banking','Morocco',42000,'AFR','UGX'],['IAM','Maroc Telecom','Telecom','Morocco',10000,'AFR','UGX'],['JPM','JPMorgan Chase','Banking','USA',245,'WRD','USD'],['V','Visa','Payments','USA',310,'WRD','USD'],['MA','Mastercard','Payments','USA',520,'WRD','USD'],['JNJ','Johnson and Johnson','Health','USA',155,'WRD','USD'],['WMT','Walmart','Retail','USA',95,'WRD','USD'],['PG','Procter and Gamble','Consumer','USA',170,'WRD','USD'],['DIS','Disney','Media','USA',112,'WRD','USD'],['NFLX','Netflix','Media','USA',905,'WRD','USD'],['AMD','AMD','Semiconductors','USA',122,'WRD','USD'],['INTC','Intel','Semiconductors','USA',21,'WRD','USD'],['ORCL','Oracle','Software','USA',185,'WRD','USD'],['CRM','Salesforce','Software','USA',275,'WRD','USD'],['ADBE','Adobe','Software','USA',340,'WRD','USD'],['UBER','Uber','Mobility','USA',78,'WRD','USD'],['ABNB','Airbnb','Travel','USA',132,'WRD','USD'],['PYPL','PayPal','Payments','USA',85,'WRD','USD'],['PLTR','Palantir','Software','USA',68,'WRD','USD'],['SOFI','SoFi','Finance','USA',14,'WRD','USD'],['BA','Boeing','Industrial','USA',178,'WRD','USD'],['KO','Coca-Cola','Consumer','USA',63,'WRD','USD'],['HSBA','HSBC Holdings','Banking','UK',12,'WRD','USD'],['BP','BP','Energy','UK',5.8,'WRD','USD'],['SHEL','Shell','Energy','UK',34,'WRD','USD'],['AZN','AstraZeneca','Health','UK',68,'WRD','USD'],['ULVR','Unilever','Consumer','UK',47,'WRD','USD'],['SAP','SAP','Software','Germany',285,'WRD','USD'],['SIE','Siemens','Industrial','Germany',210,'WRD','USD'],['VOW3','Volkswagen','Autos','Germany',92,'WRD','USD'],['BMW','BMW','Autos','Germany',78,'WRD','USD'],['DAI','Daimler Truck','Autos','Germany',165,'WRD','USD'],['MC','LVMH','Luxury','France',480,'WRD','USD'],['OR','Loreal','Luxury','France',385,'WRD','USD'],['SAN','Santander','Banking','Spain',4.8,'WRD','USD'],['BNP','BNP Paribas','Banking','France',62,'WRD','USD'],['NESN','Nestle','Consumer','Switzerland',88,'WRD','USD'],['ROG','Roche','Health','Switzerland',245,'WRD','USD'],['UBS','UBS','Banking','Switzerland',32,'WRD','USD'],['ASML','ASML','Semiconductors','Netherlands',1050,'WRD','USD'],['PHL','Philips','Health','Netherlands',320,'WRD','USD'],['NOVO-B','Novo Nordisk','Health','Denmark',145,'WRD','USD'],['IBE','Iberdrola','Utilities','Spain',12,'WRD','USD'],['7203','Toyota Motor','Autos','Japan',28,'WRD','USD'],['6758','Sony Group','Tech','Japan',92,'WRD','USD'],['9984','SoftBank Group','Tech','Japan',78,'WRD','USD'],['8306','MUFG','Banking','Japan',12,'WRD','USD'],['6861','Keyence','Industrial','Japan',480,'WRD','USD'],['0700','Tencent','Internet','China',52,'WRD','USD'],['9988','Alibaba','Internet','China',118,'WRD','USD'],['3690','Meituan','Internet','China',18,'WRD','USD'],['1810','Xiaomi','Tech','China',4.2,'WRD','USD'],['RELIANCE','Reliance Industries','Energy','India',34,'WRD','USD'],['TCS','TCS','Software','India',41,'WRD','USD'],['HDFCBANK','HDFC Bank','Banking','India',19,'WRD','USD'],['INFY','Infosys','Software','India',18,'WRD','USD'],['005930','Samsung Electronics','Tech','South Korea',58,'WRD','USD'],['000660','SK Hynix','Semiconductors','South Korea',130,'WRD','USD'],['D01','DBS Group','Banking','Singapore',32,'WRD','USD'],['O39','OCBC','Banking','Singapore',11,'WRD','USD'],['PTT','PTT PCL','Energy','Thailand',0.85,'WRD','USD'],['BBCA','Bank Central Asia','Banking','Indonesia',0.58,'WRD','USD'],['1155','Maybank','Banking','Malaysia',2.1,'WRD','USD'],['VCB','Vietcombank','Banking','Vietnam',3.4,'WRD','USD'],['2222','Saudi Aramco','Energy','Saudi Arabia',7.9,'WRD','USD'],['1120','Al Rajhi Bank','Banking','Saudi Arabia',26,'WRD','USD'],['EMAAR','Emaar Properties','Real Estate','UAE',2.0,'WRD','USD'],['QNB','Qatar National Bank','Banking','Qatar',5.4,'WRD','USD'],['SHOP','Shopify','Tech','Canada',95,'WRD','USD'],['RY','Royal Bank of Canada','Banking','Canada',118,'WRD','USD'],['CNQ','Canadian Natural Res','Energy','Canada',62,'WRD','USD'],['VALE','Vale','Mining','Brazil',12,'WRD','USD'],['PETR','Petrobras','Energy','Brazil',3.6,'WRD','USD'],['ITUB','Itau Unibanco','Banking','Brazil',5.8,'WRD','USD'],['AMX','America Movil','Telecom','Mexico',8.9,'WRD','USD'],['WALMEX','Walmex','Retail','Mexico',3.2,'WRD','USD'],['BHP','BHP Group','Mining','Australia',42,'WRD','USD'],['CBA','Commonwealth Bank','Banking','Australia',105,'WRD','USD'],['CSL','CSL','Health','Australia',62,'WRD','USD'],['WES','Wesfarmers','Retail','Australia',48,'WRD','USD']];
      var i=0;
      R.forEach(function(r){
        if(!r[0]||!r[1]||!r[4]||have[r[0]]) return;
        have[r[0]]=1;
        A.STOCKS.push({id:r[0],name:r[1],sector:r[2],market:r[5],region:r[3],L:r[0].charAt(0),color:pal[i++%12],base:r[4],cur:r[6]});
      });
      var bh={}; A.BONDS.forEach(function(x){ bh[x.id]=1; });
      [['gob-3y','Uganda 3-Year Treasury Bond','Government of Uganda','Government Bond',17.2,36,50000,'Low'],
       ['gob-5y','Uganda 5-Year Treasury Bond','Government of Uganda','Government Bond',17.8,60,50000,'Low'],
       ['gob-10y','Uganda 10-Year Treasury Bond','Government of Uganda','Government Bond',18.4,120,100000,'Low'],
       ['gob-15i','Uganda 15-Year Infrastructure Bond','Government of Uganda','Government Bond',19.0,180,100000,'Medium'],
       ['bou-182','Bank of Uganda 182-Day Bill','Bank of Uganda','Treasury Bill',13.5,6,20000,'Low'],
       ['bou-364','Bank of Uganda 364-Day Bill','Bank of Uganda','Treasury Bill',14.5,12,20000,'Low'],
       ['cby-cent','Centenary Bank Income Bond','Centenary Bank','Corporate Bond',19.5,48,100000,'Medium'],
       ['sbu-biz','Stanbic Business Growth Bond','Stanbic Bank Uganda','Corporate Bond',20.0,36,100000,'Medium'],
       ['umeme-en','Umeme Grid Upgrade Bond','Umeme Ltd','Corporate Bond',21.0,60,200000,'Medium']
      ].forEach(function(b){ if(bh[b[0]]) return; bh[b[0]]=1; A.BONDS.push({id:b[0],name:b[1],issuer:b[2],type:b[3],rate:b[4],months:b[5],min:b[6],risk:b[7],about:b[1]+' - a Ugandan fixed income instrument on Ascendin with semi-annual coupons and principal at maturity.'}); });
      var nt={}; A.NEWS.forEach(function(x){ nt[x.title]=1; });
      [['EQTY','Equity Group extends rally on strong half-year numbers','The cross-listed lender beat earnings estimates, lifting sentiment across East African banking counters.','3h ago'],
       ['Guide','How fractional shares let you start with UGX 500','You do not need to buy a whole share. Here is how owning a slice of a big company actually works.','5h ago'],
       ['Bonds','Treasury auction oversubscribed as retail demand jumps','Bank of Uganda recorded strong non-competitive bids, a sign retail appetite for fixed income is growing.','8h ago'],
       ['SAFCOM','Safaricom leads Nairobi bourse turnover','M-Pesa growth continues to drive investor interest in the regional market.','1d ago'],
       ['NVDA','Chipmakers extend global rally on AI demand','Semiconductor names led US indices as data-centre orders beat forecasts again.','1d ago'],
       ['Guide','Reading a stock chart in 60 seconds','Trend, volume and timeframes - the three things worth checking before you buy anything.','2d ago']
      ].forEach(function(n){ if(nt[n[1]]) return; nt[n[1]]=1; A.NEWS.push({tag:n[0],title:n[1],teaser:n[2],time:n[3]}); });
      A.STOCKS.forEach(function(x){ if(!x.about) x.about=x.name+' trades in the '+(x.region||'global')+' market and is available on Ascendin as a fractional share.'; });
      document.head.insertAdjacentHTML('beforeend','<style>.tickertrack{animation-duration:140s}</style>');
    }catch(e){}
  })();
})();
