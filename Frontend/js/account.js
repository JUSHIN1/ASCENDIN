/* =========================================================
   Ascendin - Account screen: wallet, investments, statement
   ========================================================= */
(function(){
  var A = window.Ascendin;
  A.Account = {};

  /* ---------- Account tab ---------- */
  A.Account.render = function(){
    if (!A.state) return;
    A.$('acc-balance').textContent = A.ugx(A.state.balance);
    A.$('acc-invested').textContent = A.ugx(A.investedValue());
    A.$('acc-month').textContent = '+UGX 0';
    if (A.state.phone){
      A.$('acc-phone').textContent = A.Auth.display(A.state.phone);
      var net = A.state.network;
      A.$('acc-badge').className = 'badge ' + (net==='MTN'?'mtn':'airtel');
      A.$('acc-badge').textContent = net==='MTN' ? 'M' : 'A';
    }
  };

  /* ---------- My Investments ---------- */
  A.Account.renderInvestments = function(){
    var h = '';
    var keys = Object.keys(A.state.holdings).filter(function(k){ return A.state.holdings[k].qty > 0; });
    if (keys.length){
      h += '<div class="muted small sec-label">Stocks</div><div class="card" style="padding:4px 16px">';
      for (var i=0;i<keys.length;i++){
        var s = A.getStock(keys[i]);
        if (!s) continue;
        var hd = A.state.holdings[keys[i]];
        var val = hd.qty * A.priceUGX(s);
        var pl = val - hd.cost;
        var up = pl >= 0;
        h += '<div class="asset" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">' + '<div class="logo" style="background:'+s.color+'; color:'+(s.tc||'#fff')+'">'+A.logoHTML(s)+'</div>' + '<div style="flex:1"><div class="bold">'+s.name+'</div><div class="muted small">'+hd.qty.toFixed(4)+' units</div></div>' + '<div style="text-align:right"><div class="bold">'+A.ugx(val)+'</div><span class="chg '+(up?'up':'down')+'">'+(up?'+':'-')+A.ugx(Math.abs(pl))+'</span> <span class="link small" onclick="event.stopPropagation();Ascendin.go(&quot;p2pSell&quot;,{symbol:&quot;'+s.id+'&quot;})">Sell</span></div></div>';
      }
      h += '</div>';
    }
    var bkeys = Object.keys(A.state.bondHold);
    if (bkeys.length){
      h += '<div class="muted small sec-label">Bonds and fixed products</div><div class="card" style="padding:4px 16px">';
      for (var j=0;j<bkeys.length;j++){
        var b = null;
        for (var x=0;x<A.BONDS.length;x++) if (A.BONDS[x].id===bkeys[j]) b = A.BONDS[x];
        if (!b) continue;
        h += '<div class="asset" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')">' + '<div class="logo" style="background:#1f4d7a">'+A.icon('doc',20)+'</div>' + '<div style="flex:1"><div class="bold">'+b.name+'</div><div class="muted small">'+(b.months? b.months+' months':'Flexible')+' at '+b.rate.toFixed(1)+'%</div></div>' + '<div style="text-align:right; font-weight:700">'+A.ugx(A.state.bondHold[bkeys[j]].amount)+'</div></div>';
      }
      h += '</div>';
    }
    A.$('inv-list').innerHTML = h || '<div class="card center muted">No investments yet. Buy your first stock or bond to see it here.</div>';
  };

  /* ---------- Statement ---------- */
  A.Account.renderStatement = function(){
    var h = '';
    if (!A.state.tx.length) h = '<div class="card center muted">No transactions yet.</div>';
    for (var i=0;i<A.state.tx.length;i++){
      var t = A.state.tx[i];
      var pos = t.amt >= 0;
      h += '<div class="card" style="padding:12px 16px"><div class="statline" style="padding:0"><span class="bold">'+t.type+'</span><span class="'+(pos?'up':'down')+'" style="font-weight:800">'+(pos?'+':'-')+A.ugx(Math.abs(t.amt))+'</span></div><div class="muted small" style="margin-top:4px">'+t.note+' - '+t.time+'</div></div>';
    }
    A.$('stmt-list').innerHTML = h;
  };
})();