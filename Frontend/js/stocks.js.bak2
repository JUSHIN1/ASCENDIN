/* Stocks list, live moving chart, buy and sell flows. */
(function(){
  var A = window.Ascendin;
  A.Stocks = { curStock:null, curTF:'1D', stockTab:'All', seriesData:{}, liveTimer:null };

  A.Stocks.renderStockTabs = function(){
    var tabs = ['All','USE','New','US','ETFs'];
    var h = '';
    for (var i=0;i<tabs.length;i++){
      var active = A.Stocks.stockTab===tabs[i] ? ' active' : '';
      var label = tabs[i]==='USE' ? 'USE listed' : tabs[i]==='New' ? 'New listings' : tabs[i];
      h += '<div class="tab'+active+'" onclick="Ascendin.Stocks.setStockTab(\''+tabs[i]+'\')">'+label+'</div>';
    }
    A.$('stock-tabs').innerHTML = h;
  };
  A.Stocks.setStockTab = function(t){ A.Stocks.stockTab = t; A.Stocks.renderStockTabs(); A.Stocks.renderStocks(); };

  A.Stocks.renderStocks = function(){
    var q = (A.$('stock-search').value||'').toLowerCase();
    var h = '';
    for (var i=0;i<A.STOCKS.length;i++){
      var s = A.STOCKS[i];
      if (A.Stocks.stockTab==='USE' && s.market!=='USE') continue;
      if (A.Stocks.stockTab==='New' && s.market!=='NEW') continue;
      if (A.Stocks.stockTab==='US' && s.market!=='US') continue;
      if (A.Stocks.stockTab==='ETFs' && s.market!=='ETF') continue;
      if (q && s.name.toLowerCase().indexOf(q)<0 && s.id.toLowerCase().indexOf(q)<0) continue;
      h += '<div class="asset" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">'+
        '<div class="logo" style="background:'+s.color+'; color:'+(s.tc||'#fff')+'">'+A.logoHTML(s)+'</div>'+
        '<div style="flex:1"><div class="bold">'+s.name+'</div><div class="muted small">'+s.id+' - '+s.sector+'</div></div>'+
        '<div style="text-align:right"><div class="bold">'+(s.cur==='USD'?'$'+s.price.toFixed(2):'UGX '+A.fmt(s.price))+'</div>'+A.chgHTML(s.chg)+'</div></div>';
    }
        A.$('stock-list').innerHTML = h || '<div class="muted center" style="padding:30px">No stocks match your search.</div>';
        A.Stocks.renderHeatTicker();
  };
  
    function priceLabel(s, v){ return s.cur==='USD' ? '$'+v.toFixed(2) : 'UGX '+A.fmt(v); }
  A.Stocks.alerts = function(){ return A.state.alerts || (A.state.alerts = []); };
  A.Stocks.updateBell = function(){
    var el = A.$('sd-bell');
    if (!el || !A.Stocks.curStock) return;
    var has = A.Stocks.alerts().some(function(x){ return x.stock === A.Stocks.curStock.id; });
    el.classList.toggle('has-alert', has);
  };
  A.Stocks.openAlerts = function(){
    var s = A.Stocks.curStock;
    var list = A.Stocks.alerts().filter(function(x){ return x.stock === s.id; });
    var rows = '';
    for (var i=0;i<list.length;i++){
      rows += '<div class="statline"><span class="muted">When price ' + (list[i].dirAbove ? 'rises above' : 'falls below') + '</span><span class="bold">' + priceLabel(s, list[i].target) + '</span><span class="link small" style="margin-left:10px" onclick="Ascendin.Stocks.removeAlert(\'' + list[i].id + '\')">Remove</span></div>';
    }
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Price alerts - ' + s.name + '</div>' +
      '<div class="statline"><span class="muted">Current price</span><span class="bold">' + priceLabel(s, s.price) + '</span></div>' +
      (rows || '<div class="muted small" style="padding:8px 0">No alerts yet for this stock.</div>') +
      '<div class="muted small" style="margin-top:10px">Alert me when the price crosses</div>' +
      '<div class="field"><span class="pre">' + (s.cur==='USD' ? '$' : 'UGX') + '</span><input id="alert-target" type="number" inputmode="decimal" placeholder="0"></div>' +
      '<button class="btn blue" style="margin-top:12px" onclick="Ascendin.Stocks.addAlert()">SET ALERT</button>'
    );
  };
  A.Stocks.addAlert = function(){
    var s = A.Stocks.curStock;
    var t = parseFloat(A.$('alert-target').value) || 0;
    if (t <= 0){ A.toast('Enter a target price'); return; }
    A.Stocks.alerts().push({ id: 'al-' + Date.now(), stock: s.id, target: t, dirAbove: t > s.price });
    A.save(); A.closeAll(); A.Stocks.updateBell();
    A.toast('Alert set: ' + s.id + ' at ' + priceLabel(s, t));
  };
  A.Stocks.removeAlert = function(id){
    A.state.alerts = A.Stocks.alerts().filter(function(x){ return x.id !== id; });
    A.save(); A.Stocks.openAlerts(); A.Stocks.updateBell();
  };
  A.Stocks.checkAlerts = function(s, oldPrice){
    var arr = A.Stocks.alerts();
    var left = [];
    for (var i=0;i<arr.length;i++){
      var x = arr[i];
      if (x.stock !== s.id){ left.push(x); continue; }
      var crossed = (oldPrice < x.target && s.price >= x.target) || (oldPrice > x.target && s.price <= x.target);
      if (crossed){
        A.toast('Alert: ' + s.id + ' crossed ' + priceLabel(s, x.target));
        A.notify('Price alert triggered: ' + s.name + ' crossed ' + priceLabel(s, x.target));
      } else left.push(x);
    }
    if (left.length !== arr.length){ A.state.alerts = left; A.save(); A.Stocks.updateBell(); }
  };

  function genSeries(s, tf){
    var rnd = A.mulberry(A.hash(s.id + tf));
    var n = 90;
    var end = s.price, start = end/(1+s.chg/100);
    if (tf !== '1D'){ start = end*(1-(s.chg*3+rnd()*30-10)/100); }
    var vol = end*0.006*(tf==='1D'?1:2.2);
    var pts = [];
    for (var i=0;i<n;i++){
      var base = start+(end-start)*(i/(n-1));
      var noise = (rnd()-0.5)*2*vol*Math.sin(i*0.35+rnd()*6);
      pts.push(base+noise);
    }
    pts[n-1] = end;
    return pts;
  }

  A.Stocks.openStock = function(id){
    A.Stocks.curStock = A.getStock(id);
    var s = A.Stocks.curStock;
    if (s.dayOpen === undefined) s.dayOpen = s.price;
    A.Stocks.curTF = '1D';
    A.Stocks.seriesData = {};
    var tfs = ['1D','1W','1M','1Y','All'];
    for (var i=0;i<tfs.length;i++) A.Stocks.seriesData[tfs[i]] = genSeries(s, tfs[i]);
        A.Stocks.loadSeries(s, '1D');
    A.$('sd-title').textContent = s.id;
    A.$('sd-logo').style.background = s.color;
    A.$('sd-logo').style.color = s.tc || '#fff';
        A.$('sd-logo').innerHTML = A.logoHTML(s);
    A.$('sd-name').textContent = s.name;
    A.$('sd-ticker').textContent = s.id + ' - ' + s.sector;
      updateHeader();
    A.Stocks.updateBell();
    A.$('sd-about').textContent = s.about;
    A.Stocks.renderTF();
    A.Stocks.drawChart();
    A.go('stock-detail');
  };

  function updateHeader(){
    var s = A.Stocks.curStock;
    A.$('sd-price').textContent = s.cur==='USD' ? '$'+s.price.toFixed(2) : 'UGX '+A.fmt(s.price);
    var up = s.chg >= 0;
    var delta = s.price * s.chg / 100;
    A.$('sd-chg').innerHTML =
      '<span class="chg '+(up?'up':'down')+'" style="background:rgba(128,128,128,.15); padding:4px 8px; border-radius:6px">'+A.icon(up?'up':'down',14)+Math.abs(s.chg).toFixed(2)+'%</span>'+
      '<span class="'+(up?'up':'down')+'" style="font-weight:700">'+(up?'+':'-')+(s.cur==='USD'?'$'+Math.abs(delta).toFixed(2):'UGX '+A.fmt(Math.abs(delta)))+'</span><span class="muted">Today</span>';
  }

  A.Stocks.renderTF = function(){
    var tfs = ['1D','1W','1M','1Y','All'];
    var h = '';
    for (var i=0;i<tfs.length;i++){
      h += '<div class="tf '+(A.Stocks.curTF===tfs[i]?'active':'')+'" onclick="Ascendin.Stocks.setTF(\''+tfs[i]+'\')">'+tfs[i]+'</div>';
    }
    A.$('tf-pills').innerHTML = h;
  };
   A.Stocks.setTF = function(t){ A.Stocks.curTF = t; A.Stocks.renderTF(); A.Stocks.drawChart(); A.Stocks.loadSeries(A.Stocks.curStock, t); };

  A.Stocks.drawChart = function(){
    var cv = A.$('chart'); var ctx = cv.getContext('2d');
    var W = cv.width = cv.offsetWidth*2, H = cv.height = 440;
    ctx.clearRect(0,0,W,H);
    var pts = A.Stocks.seriesData[A.Stocks.curTF] || [];
    if (!pts.length) return;
    var mn = Math.min.apply(null,pts), mx = Math.max.apply(null,pts);
    var pad = (mx-mn)*0.12||1; mn-=pad; mx+=pad;
    var left = 10, right = W-150, top = 20, bot = H-60;
    function X(i){ return left+(right-left)*(i/(pts.length-1)); }
    function Y(v){ return top+(bot-top)*(1-(v-mn)/(mx-mn)); }
    var muted = getComputedStyle(document.documentElement).getPropertyValue('--muted');
    ctx.strokeStyle = 'rgba(128,128,128,.25)'; ctx.lineWidth=1; ctx.fillStyle = muted; ctx.font='22px sans-serif'; ctx.textAlign='left';
    for (var g=0; g<4; g++){
      var val = mx-(mx-mn)*(g/3); var y = Y(val);
      ctx.beginPath(); ctx.moveTo(left,y); ctx.lineTo(right,y); ctx.stroke();
      ctx.fillText(val>=1000?A.fmt(val):val.toFixed(2), right+16, y+8);
    }
    var down = pts[pts.length-1] < pts[0];
    ctx.strokeStyle = down ? '#E5544B' : '#3FCB6E'; ctx.lineWidth=4; ctx.lineJoin='round';
    ctx.beginPath();
    for (var p=0;p<pts.length;p++){ if(p===0) ctx.moveTo(X(p),Y(pts[p])); else ctx.lineTo(X(p),Y(pts[p])); }
    ctx.stroke();
    var labels = {'1D':['8:02 AM','Now'],'1W':['7 days ago','Now'],'1M':['30 days ago','Now'],'1Y':['1 year ago','Now'],'All':['Listed','Now']};
    ctx.fillStyle = muted; ctx.textAlign='left'; ctx.fillText(labels[A.Stocks.curTF][0], left, H-16);
    ctx.textAlign='right'; ctx.fillText(labels[A.Stocks.curTF][1], right, H-16);
  };

  /* ---------- live price engine ---------- */
  A.Stocks.startLive = function(){
    if (A.Stocks.liveTimer) return;
    A.Stocks.liveTimer = setInterval(function(){
      for (var i=0;i<A.STOCKS.length;i++){
        var s = A.STOCKS[i];
        if (s.dayOpen === undefined) s.dayOpen = s.price;
        var old = s.price;
        var drift = (Math.random()-0.5) * s.price * 0.004;
        s.price = Math.max(0.01, s.price + drift);
        s.chg = (s.price - s.dayOpen) / s.dayOpen * 100;
        A.Stocks.checkAlerts(s, old);
      }
      var cur = A.Stocks.curStock;
      if (cur){
        var arr = A.Stocks.seriesData['1D'];
        if (arr){ arr.push(cur.price); if (arr.length > 140) arr.shift(); }
        if (A.$('view-stock-detail').classList.contains('active')){
          updateHeader();
          if (A.Stocks.curTF === '1D') A.Stocks.drawChart();
        }
      }
      if (A.$('view-stocks').classList.contains('active')) A.Stocks.renderStocks();
            A.Stocks.renderHeatTicker();
    }, 2000);
  };
  A.Stocks.stopLive = function(){
    if (A.Stocks.liveTimer){ clearInterval(A.Stocks.liveTimer); A.Stocks.liveTimer = null; }
  };
     A.Stocks.renderHeatTicker = function(){
    var h = '';
    for (var r=0;r<2;r++){
      for (var i=0;i<A.STOCKS.length;i++){
        var s = A.STOCKS[i];
        var up = s.chg >= 0;
        var a = Math.min(1, 0.30 + Math.abs(s.chg) * 0.12);
        var bg = up ? 'rgba(38,132,84,'+a.toFixed(2)+')' : 'rgba(150,60,56,'+a.toFixed(2)+')';
        h += '<div class="hm-float" style="background:'+bg+'" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">'+
          '<span class="hf-sym">'+s.id+'</span>'+
          '<span class="hf-chg">'+(up?'+':'-')+Math.abs(s.chg).toFixed(2)+'%</span></div>';
      }
    }
    var t1 = A.$('heat-ticker-home'); if (t1) t1.innerHTML = h;
    var t2 = A.$('heat-ticker-stocks'); if (t2) t2.innerHTML = h;
  };

  A.Stocks.loadSeries = function(s, tf){
    if (s.cur !== 'USD') return;
    fetch('/api/market/stocks/' + s.id + '/history?tf=' + tf).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
      if (j && j.series && j.series.length > 1){
        A.Stocks.seriesData[tf] = j.series;
        if (A.Stocks.curStock && A.Stocks.curStock.id === s.id && A.Stocks.curTF === tf) A.Stocks.drawChart();
      }
    }).catch(function(){});
  };
  A.Stocks.refreshMarket = function(){
    fetch('/api/market/stocks').then(function(r){ return r.ok ? r.json() : null; }).then(function(list){
      if (!list) return;
      for (var i=0;i<list.length;i++){
        var q = list[i]; var s = A.getStock(q.id);
        if (s && q.price){ s.price = q.price; s.chg = q.chg; s.dayOpen = s.price / (1 + s.chg/100); s.live = !!q.live; }
      }
      A.Stocks.renderStocks();
      A.Stocks.renderHeatTicker();
      if (A.Stocks.curStock) updateHeader();
    }).catch(function(){});
  };

    A.Stocks.renderHeatmap = function(){
    var h = '';
    for (var i=0;i<A.STOCKS.length;i++){
      var s = A.STOCKS[i];
      var up = s.chg >= 0;
      var alpha = Math.min(0.85, 0.18 + Math.abs(s.chg) * 0.10);
      var bg = up ? 'rgba(63,203,110,' + alpha.toFixed(2) + ')' : 'rgba(229,84,75,' + alpha.toFixed(2) + ')';
      h += '<div class="hm-tile" style="background:' + bg + '" onclick="Ascendin.Stocks.openStock(\'' + s.id + '\')">' +
        '<div class="hm-sym">' + s.id + '</div>' +
        '<div class="hm-chg">' + (up ? '+' : '-') + Math.abs(s.chg).toFixed(2) + '%</div></div>';
    }
    A.$('heatmap').innerHTML = h;
  };

  /* ---------- buy ---------- */
  A.Stocks.openBuy = function(){
    var s = A.Stocks.curStock;
    A.openSheet(
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"><div style="font-size:18px; font-weight:800">Buy '+s.name+'</div><button class="iconbtn" onclick="Ascendin.closeAll()">'+A.icon('x',18)+'</button></div>'+
      '<div class="statline"><span class="muted">Current price</span><span class="bold">'+(s.cur==='USD'?'$'+s.price.toFixed(2):'UGX '+A.fmt(s.price))+'</span></div>'+
      '<div class="statline"><span class="muted">Wallet balance</span><span class="bold">'+A.ugx(A.state.balance)+'</span></div>'+
      '<div class="muted small" style="margin-top:10px">Amount to invest (UGX)</div>'+
      '<div class="field"><span class="pre">UGX</span><input id="buy-amt" type="number" inputmode="numeric" placeholder="100000" oninput="Ascendin.Stocks.updateBuy()"></div>'+
      '<div class="statline"><span class="muted">You receive</span><span class="bold" id="buy-qty">0 units</span></div>'+
      '<div class="muted small" style="margin-top:10px">How long will you leave it in the trade?</div>'+
      '<input type="range" id="buy-months" min="1" max="24" value="1" class="term-slider" oninput="Ascendin.Stocks.updateBuy()">'+
      '<div class="term-labels"><span>1 mo</span><span id="buy-months-label">1 month</span><span>24 mo</span></div>'+
      '<div class="statline"><span class="muted">Commission</span><span class="up bold">Free</span></div>'+
      '<div class="boost-box"><div class="boost-top"><span class="boost-tag">LAUNCH BOOST</span><span class="muted small" id="buy-boost-timer"></span></div><div class="boost-line">Invest <b id="buy-boost-amt">UGX 0</b> - guaranteed <b id="buy-boost-pct">0%</b> over your period: <b class="up" id="buy-boost-win">+UGX 0</b></div></div>'+
      '<div class="muted small" style="margin:8px 0 14px">Fractional buying is on: own a piece of '+s.name+' from UGX 500.</div>'+
      '<button class="btn blue" onclick="Ascendin.Stocks.confirmBuy()">CONFIRM BUY</button>'
    );
  };
  A.Stocks.updateBuy = function(){
    var a = parseFloat(A.$('buy-amt').value)||0;
    var q = a/A.priceUGX(A.Stocks.curStock);
    A.$('buy-qty').textContent = q.toFixed(4)+' units (approx '+A.ugx(a)+')';
    var bp = A.Boost.pctFor(a);
    var mo = parseInt(A.$('buy-months').value,10)||1;
    var ml = A.$('buy-months-label'); if (ml) ml.textContent = mo + (mo===1?' month':' months');
    var sl = A.$('buy-months'); if (sl) sl.style.background = 'linear-gradient(90deg, var(--blue) '+(((mo-1)/23)*100)+'%, rgba(255,255,255,.08) '+(((mo-1)/23)*100)+'%)';
    var ba = A.$('buy-boost-amt'); if (ba){ ba.textContent = A.ugx(a); A.$('buy-boost-pct').textContent = bp+'% / mo'; A.$('buy-boost-win').textContent = '+'+A.ugx(a*bp/100*mo); A.$('buy-boost-timer').textContent = A.Boost.timerText(); }
  };
  A.Stocks.confirmBuy = function(){
    var a = parseFloat(A.$('buy-amt').value)||0;
    if (a<500){ A.toast('Minimum buy is UGX 500'); return; }
    if (a>A.state.balance){ A.toast('Insufficient balance. Deposit first.'); return; }
    var s = A.Stocks.curStock;
    var q = a/A.priceUGX(s);
    var h = A.state.holdings[s.id] || {qty:0, cost:0};
    h.qty += q; h.cost += a;
    A.state.holdings[s.id] = h;
    A.state.balance -= a;
    A.addTx('Buy '+s.id, -a, q.toFixed(4)+' units');
    A.Boost.add(a, parseInt(A.$('buy-months').value,10)||1);
    A.notify('You bought '+q.toFixed(4)+' units of '+s.name);
    A.save(); A.closeAll();
    A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px; font-weight:800; margin:8px 0">Order complete</div><div class="center" style="color:#aaa; font-size:14px">You now own '+h.qty.toFixed(4)+' units of '+s.name+'. New balance '+A.ugx(A.state.balance)+'</div><button class="btn blue" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'investments\')">VIEW MY INVESTMENTS</button>');
  };

  /* ---------- sell + actions ---------- */
  A.Stocks.openMoreActions = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    var has = h && h.qty > 0;
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:14px">'+s.name+' actions</div>'+
      '<div class="menu">'+
      '<div class="item" onclick="Ascendin.closeAll(); Ascendin.Stocks.openSell()">'+A.icon('swap')+'Sell on market'+(has?' ('+h.qty.toFixed(4)+' held)':' (none held)')+'</div>'+
      '<div class="item" onclick="Ascendin.closeAll(); Ascendin.openLearn(\'stocks\')">'+A.icon('help')+'How this stock works</div>'+
      '</div>'
    );
  };
  A.Stocks.openSell = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    if (!h || h.qty<=0){ A.toast('You do not hold any '+s.id+' yet. Buy some first.'); return; }
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Sell '+s.name+'</div>'+
      '<div class="statline"><span class="muted">You hold</span><span class="bold">'+h.qty.toFixed(4)+' units</span></div>'+
      '<div class="muted small" style="margin-top:8px">Units to sell</div>'+
      '<div class="field"><span class="pre">QTY</span><input id="sell-qty" type="number" inputmode="decimal" placeholder="0.01" oninput="Ascendin.Stocks.updateSell()"></div>'+
      '<div class="statline"><span class="muted">You receive</span><span class="bold" id="sell-get">UGX 0</span></div>'+
      '<button class="btn green" style="margin-top:12px" onclick="Ascendin.Stocks.confirmSell()">CONFIRM SELL</button>'
    );
  };
  A.Stocks.updateSell = function(){
    var q = parseFloat(A.$('sell-qty').value)||0;
    A.$('sell-get').textContent = A.ugx(q*A.priceUGX(A.Stocks.curStock));
  };
  A.Stocks.confirmSell = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    var q = parseFloat(A.$('sell-qty').value)||0;
    if (q<=0 || q>h.qty){ A.toast('Enter a valid quantity up to '+h.qty.toFixed(4)); return; }
    var val = q*A.priceUGX(s);
    h.qty -= q; h.cost = Math.max(0, h.cost - val*0.9);
    A.state.balance += val;
    A.addTx('Sell '+s.id, val, q.toFixed(4)+' units');
    A.save(); A.closeAll();
    A.toast('Sold. '+A.ugx(val)+' added to your wallet');
    A.Account.render();
  };
})();