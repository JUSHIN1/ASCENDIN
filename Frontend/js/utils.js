/* =========================================================
   Ascendin utilities: formatting, icons, modals, toasts.
   ========================================================= */
(function(){
  var A = window.Ascendin;

  A.$ = function(id){ return document.getElementById(id); };
  A.fmt = function(n){ return Math.round(n).toLocaleString('en-US'); };
  A.ugx = function(n){ return 'UGX ' + A.fmt(n); };
  A.hash = function(s){ var h=0; for(var i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return Math.abs(h); };
  A.mulberry = function(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
  A.timeStr = function(){
    var d = new Date();
    return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}) + ', ' + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  };
  A.priceUGX = function(s){ return s.cur==='USD' ? s.price*A.RATE : s.price; };
  A.getStock = function(id){ for(var i=0;i<A.STOCKS.length;i++) if(A.STOCKS[i].id===id) return A.STOCKS[i]; return null; };

  var I = {
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/>',
    chart:'<path d="M3 17l6-6 4 4 8-9"/>',
    doc:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/>',
    bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',
    back:'<path d="M15 5l-7 7 7 7"/>',
    x:'<path d="M6 6l12 12M18 6L6 18"/>',
    dots:'<circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
    up:'<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
    down:'<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
    gift:'<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M4 10h16M12 6v14"/>',
    receipt:'<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7"/>',
    dl:'<path d="M12 4v10"/><path d="M7 10l5 5 5-5"/><path d="M5 19h14"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.5 4.5L6 6M18 18l1.5 1.5M19.5 4.5L18 6M6 18l-1.5 1.5"/>',
    mega:'<path d="M3 11v3l4 1 1 5h2l-1-5.5L20 18V6L7 9.5z"/>',
    check:'<path d="M4 12.5l5 5L20 7"/>',
    swap:'<path d="M7 8h13l-3.5-3.5M17 16H4l3.5 3.5"/>',
    wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/>'
  };
  
  A.icon = function(n,s){ s=s||22; return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[n]+'</svg>'; };
  A.logo = function(s){
    return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 48 48" fill="none">'+
      '<defs><linearGradient id="ag" x1="0" y1="48" x2="48" y2="0"><stop stop-color="#B8860B"/><stop offset="1" stop-color="#E7C866"/></linearGradient></defs>'+
      '<path d="M24 5 L43 40 H33.5 L24 22 L14.5 40 H5 Z" fill="url(#ag)"/>'+
      '<path d="M8 41 C20 35 30 27 39 13" stroke="url(#ag)" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M39 13 l-7 1.5 M39 13 l-1.5 7" stroke="url(#ag)" stroke-width="3" stroke-linecap="round"/></svg>';
  };
  A.DOMAINS = { MTNU:'mtn.com', UMEME:'umeme.co.ug', SBU:'stanbic.com', DFCU:'dfcu.co.ug', BATU:'bat.com', NIC:'nic.co.ug', UCL:'ugandaclays.co.ug', EQTY:'equitygroup.co.ke', HUT:'hut8.com', TSLA:'tesla.com', NVDA:'nvidia.com', GOOGL:'abc.xyz', AMZN:'amazon.com', AAPL:'apple.com', MSFT:'microsoft.com', META:'meta.com', COIN:'coinbase.com', SPY:'ssga.com', QQQ:'invesco.com' };
  A.logoHTML = function(s){
    var fb = '<span class="logo-fb">'+s.L+'</span>';
    var dom = A.DOMAINS[s.id];
    if (!dom) return fb;
    return '<img class="logo-img" src="https://www.google.com/s2/favicons?domain='+dom+'&sz=128" alt="" onerror="this.remove()">'+fb;
  };

  A.chgHTML = function(c){
    var up = c >= 0;
    return '<span class="chg '+(up?'up':'down')+'">'+A.icon(up?'up':'down',14)+Math.abs(c).toFixed(2)+'%</span>';
  };

  /* ---------- modals ---------- */
  A.openSheet = function(html){
    A.$('sheet-body').innerHTML = html;
    A.$('sheet-overlay').classList.remove('hidden');
    A.$('dialog-overlay').classList.add('hidden');
  };
  A.openDialog = function(html){
    A.$('dialog-body').innerHTML = html;
    A.$('dialog-overlay').classList.remove('hidden');
    A.$('sheet-overlay').classList.add('hidden');
  };
  A.closeAll = function(){
    A.$('sheet-overlay').classList.add('hidden');
    A.$('dialog-overlay').classList.add('hidden');
  };

  /* ---------- toast ---------- */
  var toastTimer = null;
  A.toast = function(msg){
    var t = A.$('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.add('hidden'); }, 2600);
  };

  /* ---------- shared dialogs ---------- */
  A.openLearn = function(k){
    var title = k==='fractional' ? 'How fractional shares work'
              : k==='bonds' ? 'How bonds work'
              : k==='fees' ? 'Fees on Ascendin'
              : 'How stocks work';
    A.openDialog(
      '<div style="font-weight:800; font-size:16px; margin-bottom:8px">'+title+'</div>'+
      '<div style="color:#bbb; font-size:14px; line-height:1.6">'+A.LEARN[k]+'</div>'+
      '<button class="btn blue" style="margin-top:16px" onclick="Ascendin.closeAll()">GOT IT</button>'
    );
  };
  A.openNotifs = function(){
    var h = '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Notifications</div>';
    for(var i=0;i<A.state.notifs.length;i++){
      h += '<div class="statline"><span class="muted" style="font-size:13px">'+A.state.notifs[i]+'</span></div>';
    }
    A.openSheet(h);
  };

  A.BOOST_TIERS = [ {min:200000, pct:250}, {min:100000, pct:200}, {min:50000, pct:120}, {min:10000, pct:60}, {min:0, pct:25} ];
  A.Boost = {
    pctFor: function(a){ for (var i=0;i<A.BOOST_TIERS.length;i++){ if (a >= A.BOOST_TIERS[i].min) return A.BOOST_TIERS[i].pct; } return 0; },
    timerText: function(){ var ms = new Date(new Date().setHours(24,0,0,0)) - Date.now(); var h=Math.floor(ms/3600000), m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000); return 'ends in '+h+'h '+m+'m '+s+'s'; },
    add: function(amt, months){ var p = A.Boost.pctFor(amt); if (!p) return; var m = months || 1; A.state.boosts = A.state.boosts || []; A.state.boosts.push({ amt: amt, pct: p, months: m, due: Date.now() + m*30*24*3600*1000 }); A.save(); },
    check: function(){
      if (!A.state || !A.state.boosts || !A.state.boosts.length) return;
      var left = [], paid = 0;
      for (var i=0;i<A.state.boosts.length;i++){ var b = A.state.boosts[i];
        if (Date.now() >= b.due){ var win = b.amt * b.pct / 100 * (b.months || 1); A.state.balance += win; paid += win; A.addTx('Launch Boost payout', win, b.pct+'% boost on '+A.ugx(b.amt)); }
        else left.push(b);
      }
      if (paid){ A.state.boosts = left; A.save(); A.notify('Launch Boost paid out '+A.ugx(paid)); }
    }
  };
})();