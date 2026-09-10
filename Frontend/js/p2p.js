/* P2P trading: sell holdings to another Ascendin user with a one-time code. */
(function(){
  var A = window.Ascendin;
  A.P2P = { sellSymbol:null, lookupOrder:null };

  function orders(){ return A.state.p2p || (A.state.p2p = []); }

  A.P2P.genCode = function(){
    var chars='ABCDEFGHJKMNPQRSTUVWXYZ23456789', s='';
    for (var i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
    return 'ASC-'+s;
  };

  A.P2P.renderHub = function(){
    var list = orders();
    var h = '';
    if (!list.length){
      h = '<div class="card center muted" style="padding:22px">No P2P activity yet. Sell a holding from My Investments to create your first code.</div>';
    } else {
      h = '<div class="card" style="padding:4px 16px">';
      for (var i=0;i<list.length;i++){
        var o = list[i];
        h += '<div class="statline"><span><span class="bold">'+o.code+'</span> <span class="muted small">'+(o.role==='seller'?'Selling':'Bought')+' '+o.units.toFixed(3)+' '+o.symbol+' - '+A.ugx(o.total)+'</span></span><span class="'+(o.status==='completed'?'up':'muted')+'" style="font-weight:700">'+(o.status==='completed'?'Completed':'Open')+'</span></div>';
      }
      h += '</div>';
    }
    A.$('p2p-orders').innerHTML = h;
    A.P2P.refresh();
  };

  A.P2P.openSell = function(symbol){
    if (!symbol || !A.getStock(symbol)){ A.go('investments'); return; }
    A.P2P.sellSymbol = symbol;
    var s = A.getStock(symbol);
    var owned = (A.state.holdings[symbol]||{}).qty || 0;
    A.$('p2ps-name').textContent = 'Sell ' + s.name;
    A.$('p2ps-owned').textContent = 'You own ' + owned.toFixed(4) + ' units';
    A.$('p2ps-market').textContent = 'Current market price: ' + (s.cur==='USD' ? '$'+s.price.toFixed(2) : A.ugx(s.price));
    A.$('p2ps-price').value = Math.round(A.priceUGX(s));
    A.$('p2ps-units').value = '';
    A.$('p2ps-result').style.display = 'none';
    A.P2P.updSell();
  };

  A.P2P.updSell = function(){
    var u = parseFloat(A.$('p2ps-units').value)||0;
    var p = parseFloat(A.$('p2ps-price').value)||0;
    A.$('p2ps-total').textContent = A.ugx(u*p);
  };

  A.P2P.createOrder = function(){
    var symbol = A.P2P.sellSymbol;
    var s = A.getStock(symbol);
    var owned = (A.state.holdings[symbol]||{}).qty || 0;
    var u = parseFloat(A.$('p2ps-units').value)||0;
    var p = parseFloat(A.$('p2ps-price').value)||0;
    if (u<=0 || u>owned){ A.toast('Enter a valid quantity you actually own.'); return; }
    if (p<=0){ A.toast('Enter a valid price per unit.'); return; }
    var code = A.P2P.genCode();
    A.state.holdings[symbol].qty -= u;
    orders().unshift({ code:code, role:'seller', symbol:symbol, units:u, total:u*p, status:'open' });
    A.save();
    fetch('/api/p2p', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code:code, symbol:symbol, units:u, pricePerUnit:p, total:u*p, sellerPhone:A.state.phone }) }).catch(function(){});
    A.$('p2ps-result').style.display = 'block';
    A.$('p2ps-code').textContent = code;
    A.$('p2ps-code-sub').textContent = u.toFixed(3)+' '+symbol+' for '+A.ugx(u*p);
    A.toast('Order created - units held in escrow');
  };

  A.P2P.copyCode = function(){
    if (navigator.clipboard) navigator.clipboard.writeText(A.$('p2ps-code').textContent);
    A.toast('Code copied');
  };

  A.P2P.lookup = function(){
    var code = (A.$('p2pr-code').value||'').trim().toUpperCase();
    if (!code) return;
    fetch('/api/p2p/'+code).then(function(r){ return r.ok ? r.json() : null; }).then(function(o){
      if (!o){ A.toast('No open order found for that code.'); return; }
      if (o.status !== 'open'){ A.toast('This order is already completed.'); return; }
      A.P2P.lookupOrder = o;
      A.$('p2pr-preview').style.display = 'block';
      A.$('p2pr-units').textContent = o.units.toFixed(4)+' units of '+o.symbol;
      A.$('p2pr-price').textContent = A.ugx(o.pricePerUnit);
      A.$('p2pr-total').textContent = A.ugx(o.total);
    }).catch(function(){ A.toast('Backend not reachable - cannot redeem right now.'); });
  };

  A.P2P.redeem = function(){
    var o = A.P2P.lookupOrder;
    if (!o) return;
    if (o.total > A.state.balance){ A.toast('Not enough balance to complete this trade.'); return; }
    A.state.balance -= o.total;
    var h = A.state.holdings[o.symbol] || {qty:0, cost:0};
    h.qty += o.units; h.cost += o.total;
    A.state.holdings[o.symbol] = h;
    A.addTx('P2P buy '+o.symbol, -o.total, o.code);
    orders().unshift({ code:o.code, role:'buyer', symbol:o.symbol, units:o.units, total:o.total, status:'completed' });
    A.save();
    fetch('/api/p2p/'+o.code+'/complete', { method:'POST' }).catch(function(){});
    A.$('p2pr-preview').style.display = 'none';
    A.$('p2pr-code').value = '';
    A.P2P.lookupOrder = null;
    A.toast('Trade complete - units added to your portfolio');
    A.go('investments');
  };

  A.P2P.refresh = function(){
    var pending = orders().filter(function(o){ return o.role==='seller' && o.status==='open'; });
    for (var i=0;i<pending.length;i++){
      (function(o){
        fetch('/api/p2p/'+o.code).then(function(r){ return r.ok ? r.json() : null; }).then(function(remote){
          if (remote && remote.status==='completed'){
            o.status='completed';
            A.state.balance += o.total;
            A.addTx('P2P sell '+o.symbol, o.total, o.code);
            A.save();
            A.toast('Your order '+o.code+' was redeemed - '+A.ugx(o.total)+' received');
            A.P2P.renderHub();
          }
        }).catch(function(){});
      })(pending[i]);
    }
  };
})();