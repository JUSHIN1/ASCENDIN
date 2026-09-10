(function(){
  var A = window.Ascendin;
  /* ===== EXTRA NEWS - self-contained, deduped ===== */
  (function(){
    var add = [
      { tag:'EQTY', title:'Equity Group extends rally on strong half-year numbers', teaser:'The cross-listed lender beat earnings estimates, lifting sentiment across East African banking counters.', time:'2h ago' },
      { tag:'Guide', title:'How fractional shares let you start with UGX 500', teaser:'You do not need to buy a whole share. Here is how owning a slice of a big company works.', time:'3h ago' },
      { tag:'Bonds', title:'Treasury auction oversubscribed as retail demand jumps', teaser:'Bank of Uganda recorded strong non-competitive bids, a sign retail appetite for fixed income is growing.', time:'5h ago' },
      { tag:'SAFCOM', title:'Safaricom leads Nairobi bourse turnover', teaser:'M-Pesa growth continues to drive investor interest in the regional market.', time:'6h ago' },
      { tag:'NVDA', title:'Chipmakers extend global rally on AI demand', teaser:'Semiconductor names led US indices as data-centre orders beat forecasts again.', time:'8h ago' },
      { tag:'Guide', title:'Reading a stock chart in 60 seconds', teaser:'Trend, volume and timeframes - the three things worth checking before you buy.', time:'10h ago' },
      { tag:'MTNU', title:'MTN Uganda volumes climb after new data bundles launch', teaser:'Retail traders are watching the counter closely after management raised subscriber guidance.', time:'12h ago' },
      { tag:'Bonds', title:'Centenary Bank bond gets strong demand at close', teaser:'The 48-month corporate bond priced at the tight end of guidance as institutions piled in.', time:'1d ago' },
      { tag:'TSLA', title:'Tesla deliveries beat Street expectations', teaser:'Q2 deliveries topped 500k units, sending the stock higher in extended hours.', time:'1d ago' },
      { tag:'Guide', title:'What is a treasury bill and why does it matter?', teaser:'Short-term government paper is the foundation of every fixed-income portfolio. Here is the basics.', time:'1d ago' },
      { tag:'NPN', title:'Naspers rallies on Tencent earnings beat', teaser:'The South African internet group gained as its core Chinese holding posted strong ad revenue growth.', time:'2d ago' },
      { tag:'DANGCEM', title:'Dangote Cement expands capacity across West Africa', teaser:'New grinding plants in Cameroon and Ghana are expected to boost revenue by 18% next year.', time:'2d ago' },
      { tag:'Guide', title:'Diversification in five minutes', teaser:'Spreading your money across stocks, bonds and regions is the simplest way to manage risk.', time:'3d ago' },
      { tag:'AAPL', title:'Apple unveils new AI features at developer conference', teaser:'On-device intelligence and a refreshed Siri headline the next iOS update.', time:'3d ago' },
      { tag:'Ascendin', title:'P2P trading volume crosses UGX 1 billion milestone', teaser:'User-to-user share transfers continue to grow as the community expands.', time:'4d ago' }
    ];
    var have = {};
    A.NEWS.forEach(function(x){ have[x.title] = true; });
    add.forEach(function(n){ if (!have[n.title]) A.NEWS.push(n); });
  })();
  A.Home = {};

  A.Home.render = function(){
    A.$('home-chip').innerHTML = A.icon('wallet',13) + '<span>' + A.ugx(A.state.balance) + '</span>';
        var th = '';
    for (var rr=0;rr<2;rr++){
      for (var i=0;i<A.TESTIMONIALS.length;i++){
        var t = A.TESTIMONIALS[i];
        th += '<div class="testi"><div class="testi-q">"'+t.q+'"</div><div class="testi-n">'+t.n+' <span class="muted small">- '+t.c+'</span></div></div>';
      }
    }
    var tt = A.$('testi-track'); if (tt) tt.innerHTML = th;
        var ah = '';
    for (var rr=0;rr<2;rr++){
      for (var a=0;a<A.ACTIVITY.length;a++){
        ah += '<div class="testi"><div class="testi-q" style="font-size:12.5px;color:var(--muted)">'+A.ACTIVITY[a]+'</div></div>';
      }
    }
    var at = A.$('activity-track'); if (at) at.innerHTML = ah;
    var nh = '';
    for (var n=0;n<A.NEWS.length;n++){
      var w = A.NEWS[n];
      nh += '<div class="card"><div style="display:flex; justify-content:space-between"><span class="pill">'+w.tag+'</span><span class="muted small">'+w.time+'</span></div><div style="font-weight:800; margin-top:8px; line-height:1.35">'+w.title+'</div><div class="muted small" style="margin-top:5px; line-height:1.45">'+w.teaser+'</div></div>';
    }
    A.$('news-list').innerHTML = '<div class="news-track">' + nh + nh + '</div>'; var trk=A.$('news-list').firstChild; if(trk){ trk.style.animationDuration=(trk.querySelectorAll('.card').length*4)+'s'; }
        A.Stocks.renderHeatTicker();
    A.Home.loadNews();
  };
  /* ---------- living video background ---------- */
  A.Home.videoList = function(){
    if (window.innerWidth >= 900){
      return 'abcdefghijk'.split('').map(function(c){ return 'assets/hero-'+c+'.mp4'; });
    }
    var m = []; for (var i=1;i<=9;i++) m.push('assets/hero-'+i+'.mp4');
    return m;
  };
  A.Home.videoPos = [];
  A.Home.rotTimer = null;

  A.Home.initVideo = function(){
    var v = A.$('home-video'); var wrap = A.$('home-bg');
    if (!v || !wrap) return;
    var mode = window.innerWidth >= 900 ? 'web' : 'mob';
    if (v.dataset.mode === mode){ if (v.paused && v.play) v.play().catch(function(){}); return; }
    v.dataset.mode = mode;
    var list = A.Home.videoList();
    v.dataset.list = JSON.stringify(list);
    v.dataset.idx = '0';
    v.dataset.fails = '0';
    A.Home.videoPos = list.map(function(){ return 0; });
    wrap.classList.remove('novideo');
    v.style.display = '';
    v.onerror = function(){ A.Home.gotoVideo(parseInt(v.dataset.idx||'0',10)+1, true); };
    v.onended = function(){
      var i = parseInt(v.dataset.idx||'0',10);
      A.Home.videoPos[i] = 0;
      A.Home.gotoVideo(i+1, false);
    };
    A.Home.loadVideo(v, 0);
    if (A.Home.rotTimer) clearInterval(A.Home.rotTimer);
    A.Home.rotTimer = setInterval(function(){
      if (document.hidden) return;
      var cur = A.$('home-video');
      var i = parseInt(cur.dataset.idx||'0',10);
      A.Home.videoPos[i] = cur.currentTime || 0;
      A.Home.gotoVideo(i+1, false);
    }, 15000);
  };

  A.Home.loadVideo = function(v, idx){
    var list = []; try{ list = JSON.parse(v.dataset.list||'[]'); }catch(e){}
    if (!list.length) return;
    var seek = A.Home.videoPos[idx] || 0;
    v.dataset.idx = String(idx);
    v.src = list[idx];
    v.onloadedmetadata = function(){
      if (seek > 0 && seek < (v.duration || 0)) v.currentTime = seek;
      v.onloadedmetadata = null;
    };
    if (v.play) v.play().catch(function(){ A.$('home-bg').classList.add('novideo'); });
  };

  A.Home.gotoVideo = function(nextIdx, failed){
    var v = A.$('home-video'); var wrap = A.$('home-bg');
    var list = []; try{ list = JSON.parse(v.dataset.list||'[]'); }catch(e){}
    if (!list.length) return;
    if (failed){
      var fails = parseInt(v.dataset.fails||'0',10) + 1;
      v.dataset.fails = String(fails);
      if (fails >= list.length){ wrap.classList.add('novideo'); v.style.display = 'none'; return; }
    } else {
      v.dataset.fails = '0';
    }
    var idx = nextIdx % list.length;
    v.classList.add('vout');
    setTimeout(function(){
      v.classList.remove('vout');
      v.classList.remove('vin'); void v.offsetWidth; v.classList.add('vin');
      A.Home.loadVideo(v, idx);
    }, 380);
  };

  A.Home.initChrome = function(){
    A.$('qa-stk').innerHTML = A.icon('chart',18).replace('currentColor','#2AABEE') + 'Buy stock';
    A.$('qa-bnd').innerHTML = A.icon('doc',18).replace('currentColor','#2AABEE') + 'Buy bond';
    A.$('qa-inv').innerHTML = A.icon('wallet',18).replace('currentColor','#4CBB2C') + 'My portfolio';
  };
})();
/* === HOME VIDEO PLAYBACK ENGINE (appended) === */
(function(){
  var A = window.Ascendin;
  A.Home.videoList = function(){
    if (window.innerWidth >= 900){
      return 'abcdefghijk'.split('').map(function(c){ return 'assets/hero-'+c+'.mp4'; });
    }
    var m = []; for (var i=1;i<=9;i++) m.push('assets/hero-'+i+'.mp4');
    return m;
  };
  A.Home.initVideo = function(){
    var v = A.$('home-video'); var wrap = A.$('home-bg');
    if (!v || !wrap) return;
    var mode = window.innerWidth >= 900 ? 'web' : 'mob';
    if (v.dataset.mode === mode){ if (v.paused && v.play) v.play().catch(function(){}); return; }
    v.dataset.mode = mode;
    v.dataset.list = JSON.stringify(A.Home.videoList());
    v.dataset.idx = '0';
    v.dataset.fails = '0';
    v.loop = true;
    wrap.classList.remove('novideo');
    v.style.display = '';
    v.onerror = function(){ A.Home.nextVideo(true); };
    v.src = A.Home.videoList()[0];
    if (v.play) v.play().catch(function(){ wrap.classList.add('novideo'); });
    if (A.Home.rotTimer) clearInterval(A.Home.rotTimer);
    A.Home.rotTimer = setInterval(function(){
      if (document.hidden) return;
      A.Home.nextVideo(false);
    }, 15000);
  };
  A.Home.nextVideo = function(failed){
    var v = A.$('home-video'); var wrap = A.$('home-bg');
    var list = []; try{ list = JSON.parse(v.dataset.list||'[]'); }catch(e){}
    if (!list.length) return;
    var fails = parseInt(v.dataset.fails||'0',10);
    if (failed){
      fails++; v.dataset.fails = String(fails);
      if (fails >= list.length){ wrap.classList.add('novideo'); v.style.display = 'none'; return; }
    } else { v.dataset.fails = '0'; }
    var idx = (parseInt(v.dataset.idx||'0',10)+1) % list.length;
    v.dataset.idx = String(idx);
    v.classList.add('vout');
    setTimeout(function(){
      v.currentTime = 0;
      v.src = list[idx];
      v.classList.remove('vout');
      v.classList.remove('vin'); void v.offsetWidth; v.classList.add('vin');
      if (v.play) v.play().catch(function(){});
    }, 380);
  };
  var origRender = A.Home.render;
  A.Home.render = function(){ var r = origRender.apply(this, arguments); A.Home.initVideo(); return r; };

  A.TESTIMONIALS = [
    {n:'Nakato Mariam', c:'Kampala', q:'Deposited with MTN MoMo and bought my first MTN shares the same minute. The boost payout covered my rent.'},
    {n:'Ssemakula Brian', c:'Entebbe', q:'I moved 150k in, the 200% boost hit my wallet in 30 days exactly as the app showed. No stories.'},
    {n:'Achieng Doreen', c:'Gulu', q:'The bonds calculator showed me my monthly income before I invested a single shilling. I was sold.'},
    {n:'Mugisha Ivan', c:'Mbarara', q:'Sold my UMEME to another user with a code while at work. Money landed before my lunch break.'},
    {n:'Namutebi Grace', c:'Jinja', q:'I watch the market tape every morning with my chai. Ascendin made me feel like a banker.'},
    {n:'Okello Peter', c:'Lira', q:'Withdrew to my Airtel line at night, the fee was tiny and it arrived in minutes. Trust earned.'},
    {n:'Babirye Sarah', c:'Mukono', q:'Started with 10k just to test. The small boost still paid. Now my whole chama invests here.'},
    {n:'Kiggundu Moses', c:'Masaka', q:'P2P code worked for my brother in Kampala while I am in Masaka. This is the future.'},
    {n:'Auma Josephine', c:'Tororo', q:'The income calendar tells me exactly when my coupon lands. I plan school fees around it.'},
    {n:'Ssali Denis', c:'Hoima', q:'Real charts, real prices, and the alerts bell pinged me before TSLA moved. Beautiful.'},
    {n:'Nansubuga Rita', c:'Fort Portal', q:'My portfolio page feels like a bank statement but prettier. I screenshot it every Friday.'},
    {n:'Were Samuel', c:'Mbale', q:'Support answered me in Luganda on WhatsApp. That is when I knew this company is serious.'}
  ];
  A.Home.newsTs = 0;
  A.Home.newsOff = 0;
  if (!A.Home.newsTimer) A.Home.newsTimer = setInterval(function(){ A.Home.newsTs = 0; A.Home.loadNews(); }, 180000);
  A.Home.loadNews = function(){
    var now = Date.now();
    if (now - A.Home.newsTs < 600000) return;
    A.Home.newsTs = now;
    var srcs = [
      'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://finance.yahoo.com/news/rssindex'),
      'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.cnbc.com/id/100003114/device/rss/rss.html'),
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN'
    ];
    function paint(items){
      var nh = '';
      A.Home.newsOff = (A.Home.newsOff || 0) + 1;
      for (var i=0;i<Math.min(items.length,6);i++){
        var it = items[(i + A.Home.newsOff) % items.length];
        var title = (it.title||'').replace(/<[^>]*>/g,'');
        var teaser = (it.teaser || (it.description||'').replace(/<[^>]*>/g,'')).slice(0,110);
        var when = (it.time || it.pubDate || '').slice(0,16);
        nh += '<div class="card news-in"><div style="display:flex; justify-content:space-between"><span class="pill">Market</span><span class="muted small">'+when+'</span></div><div style="font-weight:800; margin-top:8px; line-height:1.35">'+title+'</div><div class="muted small" style="margin-top:5px; line-height:1.45">'+teaser+'</div></div>';
      }
      if (nh) A.$('news-list').innerHTML = nh;
    }
    function trySrc(i){
      if (i >= srcs.length){
        var fb = [];
        for (var n=0;n<A.NEWS.length;n++) fb.push({title:A.NEWS[n].title, teaser:A.NEWS[n].teaser, time:A.NEWS[n].time});
        paint(fb);
        return;
      }
      fetch(srcs[i]).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
        var items = null;
        if (j && j.items) items = j.items.map(function(x){ return {title:x.title, description:x.description, pubDate:x.pubDate}; });
        else if (j && j.Data) items = j.Data.map(function(x){ return {title:x.title, description:x.body, pubDate:new Date(x.published_on*1000).toISOString()}; });
        if (items && items.length) paint(items); else trySrc(i+1);
      }).catch(function(){ trySrc(i+1); });
    }
    trySrc(0);
  };
})();

(function(){
  function wrapNews(){
    var nl=document.getElementById('news-list');
    if(!nl || (nl.parentNode && nl.parentNode.classList && nl.parentNode.classList.contains('news-auto'))) return;
    var w=document.createElement('div'); w.className='news-auto';
    nl.parentNode.insertBefore(w,nl); w.appendChild(nl);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wrapNews); else wrapNews();
})();
