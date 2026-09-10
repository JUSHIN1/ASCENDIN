/* Bonds - blue accent, no gold. */
(function(){
  var A = window.Ascendin;  /* ===== EXTRA BONDS - self-contained, deduped ===== */
  (function(){
    var add = [
      { id:'ug-tb-182', name:'Bank of Uganda 182-Day Bill', issuer:'Bank of Uganda', type:'Treasury Bill', rate:13.5, months:6, min:20000, risk:'Low', about:'Six-month central bank bill, sold at a discount and paid at face value.' },
      { id:'ug-tb-364', name:'Bank of Uganda 364-Day Bill', issuer:'Bank of Uganda', type:'Treasury Bill', rate:14.5, months:12, min:20000, risk:'Low', about:'One-year treasury bill, the most liquid short-term instrument in Uganda.' },
      { id:'ug-gb-3y', name:'Uganda 3-Year Treasury Bond', issuer:'Government of Uganda', type:'Government Bond', rate:16.8, months:36, min:50000, risk:'Low', about:'Medium-term sovereign bond matching school-fee and project timelines.' },
      { id:'ug-gb-5y', name:'Uganda 5-Year Treasury Bond', issuer:'Government of Uganda', type:'Government Bond', rate:17.5, months:60, min:50000, risk:'Low', about:'Five-year government bond paying semi-annual coupons.' },
      { id:'ug-gb-10y', name:'Uganda 10-Year Treasury Bond', issuer:'Government of Uganda', type:'Government Bond', rate:18.2, months:120, min:100000, risk:'Low', about:'Long-dated sovereign bond locking in today\'s rates for a decade.' },
      { id:'ug-gb-15y', name:'Uganda 15-Year Infrastructure Bond', issuer:'Government of Uganda', type:'Government Bond', rate:18.9, months:180, min:100000, risk:'Medium', about:'Funds national roads and energy; pays a premium for its long tenure.' },
      { id:'cby-bond', name:'Centenary Bank Income Bond', issuer:'Centenary Bank', type:'Corporate Bond', rate:19.5, months:48, min:100000, risk:'Medium', about:'Corporate bond from Uganda\'s largest microfinance-born bank.' },
      { id:'sbu-bond', name:'Stanbic Business Growth Bond', issuer:'Stanbic Bank Uganda', type:'Corporate Bond', rate:20.0, months:36, min:100000, risk:'Medium', about:'Funds SME lending across Uganda; competitive corporate coupon.' },
      { id:'dfcu-bond', name:'dfcu SME Lending Bond', issuer:'dfcu Bank', type:'Corporate Bond', rate:19.2, months:42, min:100000, risk:'Medium', about:'Funds small-business lending; semi-annual coupons.' },
      { id:'umeme-bond', name:'Umeme Grid Upgrade Bond', issuer:'Umeme Ltd', type:'Corporate Bond', rate:21.0, months:60, min:200000, risk:'Medium', about:'Finances distribution grid upgrades; highest coupon in the book.' },
      { id:'mtnu-bond', name:'MTN Uganda Network Bond', issuer:'MTN Uganda', type:'Corporate Bond', rate:20.4, months:48, min:200000, risk:'Medium', about:'Funds 4G/5G rollout; backed by telecom cash flows.' },
      { id:'kla-water', name:'Kampala Water & Drainage Bond', issuer:'Kampala Capital City Authority', type:'Municipal Bond', rate:17.8, months:60, min:100000, risk:'Low-Medium', about:'City water and drainage works; municipal backing.' },
      { id:'entebbe-muni', name:'Entebbe Municipal Development Bond', issuer:'Entebbe Municipal Council', type:'Municipal Bond', rate:17.2, months:48, min:50000, risk:'Low-Medium', about:'Funds market and road upgrades in Entebbe.' },
      { id:'ke-gb-7y', name:'Kenya 7-Year Infrastructure Bond', issuer:'Government of Kenya', type:'Government Bond', rate:16.5, months:84, min:100000, risk:'Medium', about:'Kenyan sovereign infrastructure bond.' },
      { id:'rw-gb-5y', name:'Rwanda 5-Year Development Bond', issuer:'Government of Rwanda', type:'Government Bond', rate:15.8, months:60, min:100000, risk:'Medium', about:'Rwandan development bond with strong fiscal track record.' },
      { id:'tz-gb-6y', name:'Tanzania 6-Year Treasury Bond', issuer:'Government of Tanzania', type:'Government Bond', rate:16.2, months:72, min:100000, risk:'Medium', about:'Tanzanian sovereign bond for public projects.' },
      { id:'gh-gb-4y', name:'Ghana 4-Year Recovery Bond', issuer:'Government of Ghana', type:'Government Bond', rate:22.0, months:48, min:100000, risk:'High', about:'High-yield Ghanaian sovereign recovery bond; higher risk.' },
      { id:'zm-gb-5y', name:'Zambia 5-Year Sovereign Bond', issuer:'Government of Zambia', type:'Government Bond', rate:21.5, months:60, min:100000, risk:'High', about:'Zambian sovereign bond post-restructuring; higher risk.' },
      { id:'ng-gb-5y', name:'Nigeria 5-Year FGN Bond', issuer:'Federal Government of Nigeria', type:'Government Bond', rate:19.8, months:60, min:100000, risk:'Medium', about:'Nigerian federal government bond.' },
      { id:'za-gb-10y', name:'South Africa 10-Year R2030 Bond', issuer:'Government of South Africa', type:'Government Bond', rate:12.4, months:120, min:100000, risk:'Low', about:'Benchmark South African sovereign bond (R2030).' },
      { id:'ma-gb-7y', name:'Morocco 7-Year Infrastructure Bond', issuer:'Government of Morocco', type:'Government Bond', rate:13.9, months:84, min:100000, risk:'Low', about:'Moroccan infrastructure sovereign bond.' },
      { id:'eg-gb-6y', name:'Egypt 6-Year Treasury Bond', issuer:'Government of Egypt', type:'Government Bond', rate:18.6, months:72, min:100000, risk:'Medium', about:'Egyptian treasury bond with attractive carry.' },
      { id:'safcom-bond', name:'Safaricom Kenya Corporate Bond', issuer:'Safaricom PLC', type:'Corporate Bond', rate:17.9, months:60, min:100000, risk:'Medium', about:'East Africa\'s largest telco; strong cash flows.' },
      { id:'dangote-bond', name:'Dangote Industries Bond', issuer:'Dangote Group', type:'Corporate Bond', rate:19.6, months:60, min:200000, risk:'Medium', about:'Pan-African industrial giant; cement and refining.' },
      { id:'equity-bond', name:'Equity Group Subordinated Bond', issuer:'Equity Group Holdings', type:'Corporate Bond', rate:18.4, months:72, min:100000, risk:'Medium', about:'Subordinated bank bond from a leading East African lender.' },
      { id:'afdb-green', name:'African Development Bank Green Bond', issuer:'African Development Bank', type:'Green Bond', rate:14.8, months:84, min:100000, risk:'Low', about:'Multilateral green bond funding climate projects across Africa.' },
      { id:'ifc-sme', name:'IFC SME Finance Bond', issuer:'International Finance Corp', type:'Green Bond', rate:14.2, months:60, min:100000, risk:'Low', about:'World Bank Group arm funding small businesses; very low risk.' },
      { id:'us-tb-2y', name:'US Treasury 2-Year Note', issuer:'US Department of Treasury', type:'Government Bond', rate:4.6, months:24, min:50000, risk:'Low', about:'USD-denominated US sovereign note; global safe haven.' },
      { id:'us-tb-10y', name:'US Treasury 10-Year Note', issuer:'US Department of Treasury', type:'Government Bond', rate:4.9, months:120, min:50000, risk:'Low', about:'The global benchmark risk-free rate.' },
      { id:'gold-sukuk', name:'Global Sukuk Income Certificate', issuer:'Ascendin Sukuk SPV', type:'Sukuk', rate:15.5, months:60, min:100000, risk:'Low-Medium', about:'Sharia-compliant income certificate backed by tangible assets.' }
    ];
    var have = {};
    A.BONDS.forEach(function(x){ have[x.id] = true; });
    add.forEach(function(b){ if (!have[b.id]) A.BONDS.push(b); });
  })();
  A.Bonds = { curBond:null };

    A.Bonds.render = function(){
    var maxRate = 0, invested = 0, income = 0;
    for (var m=0;m<A.BONDS.length;m++){ if (A.BONDS[m].rate > maxRate) maxRate = A.BONDS[m].rate; }
    for (var k in A.state.bondHold){
      var bd = null;
      for (var x=0;x<A.BONDS.length;x++) if (A.BONDS[x].id===k) bd = A.BONDS[x];
      if (bd){ invested += A.state.bondHold[k].amount; income += A.state.bondHold[k].amount * bd.rate / 100; }
    }
    A.$('bond-toprate').textContent = maxRate.toFixed(1) + '%';
    A.$('bond-mine').textContent = A.ugx(invested);
    A.$('bond-mine-year').textContent = 'projects ' + A.ugx(income) + ' per year';
    var h = '';
    for (var i=0;i<A.BONDS.length;i++){
      var b = A.BONDS[i];
      h += '<div class="bond-card" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')">'+
        '<div class="bc-top"><span class="bc-type">'+b.type+'</span><span class="bc-risk">'+b.risk+' risk</span></div>'+
        '<div class="bc-name">'+b.name+'</div>'+
        '<div class="bc-issuer">'+b.issuer+'</div>'+
        '<div class="bc-rate-row"><span class="bc-rate">'+b.rate.toFixed(1)+'<em>% / yr</em></span><span class="bc-tenor">1-24 months</span></div>'+
        '<div class="bc-bar"><i style="width:'+Math.round(b.rate/maxRate*100)+'%"></i></div>'+
        '<div class="bc-min">from '+A.ugx(b.min)+'</div>'+
      '</div>';
    }
    A.$('bond-list').innerHTML = h;
  };

  A.Bonds.openBond = function(id){
    for (var i=0;i<A.BONDS.length;i++) if (A.BONDS[i].id===id) A.Bonds.curBond = A.BONDS[i];
    var b = A.Bonds.curBond;
    A.$('bd-type').textContent = b.type;
    A.$('bd-head').innerHTML = '<div style="font-size:20px; font-weight:800; line-height:1.25; margin-bottom:4px">'+b.name+'</div><div class="muted small" style="margin-bottom:14px">'+b.issuer+'</div>';
        A.$('bd-stats').innerHTML =
      '<div class="statbox"><div class="muted small">Interest rate</div><div class="bold" style="font-size:16px; margin-top:3px">'+b.rate.toFixed(1)+'% / yr</div></div>'+
      '<div class="statbox"><div class="muted small">Minimum</div><div class="bold" style="font-size:16px; margin-top:3px">'+A.ugx(b.min)+'</div></div>'+
      '<div class="statbox"><div class="muted small">Risk level</div><div class="bold" style="font-size:16px; margin-top:3px">'+b.risk+'</div></div>';
    A.$('bd-months').value = 12;
    var held = (A.state.bondHold[b.id]||{}).amount || 0;
    A.$('bd-held').style.display = held>0 ? 'block' : 'none';
    A.$('bd-held').innerHTML = '<div class="muted small" style="color:var(--muted)">You have invested</div><div class="bold" style="font-size:17px; margin-top:2px">'+A.ugx(held)+'</div>';
    A.$('bd-desc').textContent = b.about;
    A.$('bd-amount').value = '';
    A.$('bd-calc').innerHTML = '';
    A.go('bond-detail');
  };

   A.Bonds.calcBond = function(){
    var a = parseFloat(A.$('bd-amount').value)||0;
    var m = parseInt(A.$('bd-months').value,10)||12;
    var b = A.Bonds.curBond;
    A.$('bd-months-label').textContent = m + (m===1?' month':' months');
    var pct = ((m-1)/23)*100;
    A.$('bd-months').style.background = 'linear-gradient(90deg, var(--blue) '+pct+'%, rgba(255,255,255,.08) '+pct+'%)';
    if (!a){ A.$('bd-calc').innerHTML=''; return; }
    var monthly = a * b.rate / 100 / 12;
    var total = a + monthly * m;
    A.$('bd-calc').innerHTML =
      '<div class="statline"><span class="muted">Interest per month</span><span class="bold up">+'+A.ugx(monthly)+'</span></div>'+
      '<div class="statline"><span class="muted">At maturity ('+m+' mo)</span><span class="bold" style="color:var(--up)">'+A.ugx(total)+'</span></div>';
  };

  A.Bonds.openBondBuy = function(){
    var b = A.Bonds.curBond;
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Invest in '+b.name+'</div>'+
      '<div class="statline"><span class="muted">Yield</span><span class="up bold">'+b.rate.toFixed(1)+'% / year</span></div>'+
      '<div class="statline"><span class="muted">Wallet balance</span><span class="bold">'+A.ugx(A.state.balance)+'</span></div>'+
      '<div class="boost-box"><div class="boost-top"><span class="boost-tag">LAUNCH BOOST</span><span class="muted small" id="bond-boost-timer"></span></div><div class="boost-line">Invest <b id="bond-boost-amt">UGX 0</b> - guaranteed <b id="bond-boost-pct">0%</b> over your period: <b class="up" id="bond-boost-win">+UGX 0</b></div></div>'+
      '<div class="muted small" style="margin-top:8px">Amount (minimum '+A.ugx(b.min)+')</div>'+
      '<div class="field"><span class="pre">UGX</span><input id="bond-amt" type="number" inputmode="numeric" placeholder="'+b.min+'" oninput="Ascendin.Bonds.updBoost()"></div>'+
      '<button class="btn green" style="margin-top:12px" onclick="Ascendin.Bonds.confirmBond()">CONFIRM INVESTMENT</button>'
    );
  };
  A.Bonds.confirmBond = function(){
    var b = A.Bonds.curBond;
    var a = parseFloat(A.$('bond-amt').value)||0;
    if (a<b.min){ A.toast('Minimum for this product is '+A.ugx(b.min)); return; }
    if (a>A.state.balance){ A.toast('Insufficient balance. Deposit first.'); return; }
    var h = A.state.bondHold[b.id] || {amount:0};
    h.amount += a; A.state.bondHold[b.id] = h;
    A.state.balance -= a;
    A.addTx('Bond '+b.id, -a, b.name);
    A.Boost.add(a, parseInt(A.$('bd-months').value,10)||1);
    A.notify('You invested '+A.ugx(a)+' in '+b.name);
    A.save(); A.closeAll();
    A.toast('Done. '+b.name+' added to My Investments');
  };

  A.Bonds.updBoost = function(){
    var a = parseFloat(A.$('bond-amt').value)||0;
    var bp = A.Boost.pctFor(a);
    var t = A.$('bond-boost-amt'); if (!t) return;
    t.textContent = A.ugx(a);
    A.$('bond-boost-pct').textContent = bp+'%';
    var bm = parseInt(A.$('bd-months').value,10)||1;
    A.$('bond-boost-pct').textContent = bp+'% / mo';
    A.$('bond-boost-win').textContent = '+'+A.ugx(a*bp/100*bm);
    A.$('bond-boost-timer').textContent = A.Boost.timerText();
  };
})();