/* Bonds - blue accent, no gold. */
(function(){
  var A = window.Ascendin;
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