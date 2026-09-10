/* Cloud sync against the backend account storage (same origin). */
(function(){
  var A = window.Ascendin;
  A.Sync = { API_BASE:'', API_OK:false, ACC_KEY:'' };
  var syncTimer = null;

  A.onSave = function(){
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(A.Sync.push, 800);
  };

  A.Sync.push = function(){
    if (!A.Sync.API_OK || !A.Sync.ACC_KEY || !A.state) return;
    fetch(A.Sync.API_BASE + '/api/accounts', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        phone: A.Sync.ACC_KEY,
        data: { balance:A.state.balance, holdings:A.state.holdings, bondHold:A.state.bondHold, tx:A.state.tx }
      })
    }).catch(function(){});
  };

  A.Sync.pull = function(cb){
    if (!A.Sync.API_OK || !A.Sync.ACC_KEY){ if (cb) cb(); return; }
    fetch(A.Sync.API_BASE + '/api/accounts/' + A.Sync.ACC_KEY).then(function(r){ return r.ok ? r.json() : null; }).then(function(acc){
      if (acc && acc.data){
        if (typeof acc.data.balance === 'number') A.state.balance = acc.data.balance;
        if (acc.data.holdings) A.state.holdings = acc.data.holdings;
        if (acc.data.bondHold) A.state.bondHold = acc.data.bondHold;
        if (acc.data.tx) A.state.tx = acc.data.tx;
        try { localStorage.setItem('ascendin-acct-' + A.state.phone, JSON.stringify(A.state)); } catch(e){}
        A.renderAll();
      }
      if (cb) cb();
    }).catch(function(){ if (cb) cb(); });
  };

  A.Sync.init = function(){
    fetch(A.Sync.API_BASE + '/api/health').then(function(r){ return r.json(); }).then(function(){
      A.Sync.API_OK = true;
      A.$('sync-note').textContent = 'Cloud sync: on - account stored on Ascendin backend';
      return fetch(A.Sync.API_BASE + '/api/accounts/' + A.Sync.ACC_KEY).then(function(r){ return r.ok ? r.json() : null; });
    }).then(function(acc){
      if (acc && acc.data && A.state){
        if (typeof acc.data.balance === 'number') A.state.balance = acc.data.balance;
        if (acc.data.holdings) A.state.holdings = acc.data.holdings;
        if (acc.data.bondHold) A.state.bondHold = acc.data.bondHold;
        if (acc.data.tx) A.state.tx = acc.data.tx;
        try { localStorage.setItem('ascendin-acct-' + A.state.phone, JSON.stringify(A.state)); } catch(e){}
        A.renderAll();
      }
    }).catch(function(){
      var el = A.$('sync-note');
      if (el) el.textContent = 'Cloud sync: off - local mode (backend not reachable)';
    });
  };
})();