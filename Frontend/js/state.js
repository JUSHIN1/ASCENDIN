/* State + auth: accounts are created with a Ugandan MTN/Airtel number only. */
(function(){
  var A = window.Ascendin;
  A.state = null;

  A.Auth = {
    normalize: function(raw){
      var d = (raw || '').replace(/\D/g, '');
      if (d.length === 9 && d.charAt(0) === '7') return '256' + d;
      if (d.length === 10 && d.charAt(0) === '0') return '256' + d.slice(1);
      if (d.length === 12 && d.indexOf('256') === 0) return d;
      return null;
    },
    networkOf: function(phone){
      var p = '0' + phone.slice(3);
      var pre = p.slice(0, 3);
      if (['077','078','076'].indexOf(pre) >= 0) return 'MTN';
      if (['070','075','074'].indexOf(pre) >= 0) return 'Airtel';
      return null;
    },
    display: function(phone){
      return '+' + phone.slice(0,3) + ' ' + phone.slice(3,6) + ' ' + phone.slice(6,9) + ' ' + phone.slice(9);
    },
    session: function(){ try { return localStorage.getItem('ascendin-session'); } catch(e){ return null; } },
    loadLocal: function(phone){
      try { var s = localStorage.getItem('ascendin-acct-' + phone); if (s) return JSON.parse(s); } catch(e){}
      return null;
    },
    enter: function(phone){
      var acc = A.Auth.loadLocal(phone) || {
        phone: phone,
        network: A.Auth.networkOf(phone),
        balance: 0,
        holdings: {},
        bondHold: {},
        tx: [],
        notifs: ['Welcome to Ascendin. Deposit with mobile money to start investing.'],
        theme: 'dark'
      };
      A.state = acc;
      try { localStorage.setItem('ascendin-session', phone); } catch(e){}
      A.Sync.ACC_KEY = phone;
      return acc;
    },
    logout: function(){
      try { localStorage.removeItem('ascendin-session'); } catch(e){}
      location.reload();
    }
  };

  A.save = function(){
    if (!A.state) return;
    try { localStorage.setItem('ascendin-acct-' + A.state.phone, JSON.stringify(A.state)); } catch(e){}
    if (A.onSave) A.onSave();
  };
  A.addTx = function(type, amt, note){ A.state.tx.unshift({type:type, amt:amt, note:note, time:A.timeStr()}); };
  A.notify = function(msg){ A.state.notifs.unshift(msg); };

  A.investedValue = function(){
    var t = 0;
    for (var k in A.state.holdings) t += A.state.holdings[k].qty * A.priceUGX(A.getStock(k));
    for (var b in A.state.bondHold) t += A.state.bondHold[b].amount;
    return t;
  };

  A.toggleTheme = function(){
    A.state.theme = A.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', A.state.theme);
    A.$('theme-switch').classList.toggle('on', A.state.theme === 'dark');
    A.save();
    if (A.Stocks.curStock) A.Stocks.drawChart();
  };
})();