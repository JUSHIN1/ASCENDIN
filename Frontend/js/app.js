/* Bootstrap, navigation, auth handlers. */
(function(){
  var A = window.Ascendin;
  var NAVMAP = {
    home:'home', stocks:'stocks', 'stock-detail':'stocks',
    bonds:'bonds', 'bond-detail':'bonds',
    account:'account', deposit:'account', withdraw:'account',
    investments:'account', statement:'account','deposit-crypto':'account', 'withdraw-crypto':'account', auth:'auth'
  };

    A.go = function(v, params){
    A.routeParams = params || {};
    var views = document.querySelectorAll('.view');
    for (var i=0;i<views.length;i++) views[i].classList.remove('active');
    A.$('view-'+v).classList.add('active');
    A.$('bottom-nav').style.display = (v === 'auth') ? 'none' : 'flex';
    var tabs = ['home','stocks','bonds','account'];
    for (var j=0;j<tabs.length;j++) A.$('nav-'+tabs[j]).classList.toggle('active', tabs[j] === NAVMAP[v]);
    if (v==='home'){ A.Home.render(); A.Home.initVideo(); } else { var hv = A.$('home-video'); if (hv) hv.pause(); }
    if (v==='account') A.Account.render();
    if (v==='investments') A.Account.renderInvestments();
    if (v==='statement') A.Account.renderStatement();
    if (v==='deposit') A.Deposit.chrome();
    if (v==='withdraw') A.Withdraw.chrome();
        if (v==='p2pHub') A.P2P.renderHub();
    if (v==='p2pSell') A.P2P.openSell(A.routeParams.symbol);
    if (v==='stocks' || v==='stock-detail') A.Stocks.startLive(); else A.Stocks.stopLive();
    window.scrollTo(0,0);
  };

  A.renderAll = function(){
    A.Stocks.renderStockTabs();
    A.Stocks.renderStocks();
    A.Bonds.render();
    A.Home.render();
    A.Account.render();
  };

  /* ---------- login / create account ---------- */
  A.AuthPreview = function(){
    var phone = A.Auth.normalize(A.$('auth-phone').value);
    var net = phone ? A.Auth.networkOf(phone) : null;
    var badge = A.$('auth-net'), label = A.$('auth-net-label'), err = A.$('auth-err');
    err.textContent = '';
    if (!phone){ badge.style.display='none'; label.textContent=''; return; }
    if (!net){
      badge.style.display='none';
      label.textContent='';
      if (A.$('auth-phone').value.replace(/\D/g,'').length >= 9) err.textContent = 'Not a valid Ugandan mobile number. Use MTN (077/078/076) or Airtel (070/075/074).';
      return;
    }
    badge.style.display='flex';
    badge.className = 'badge ' + (net==='MTN'?'mtn':'airtel');
    badge.textContent = net==='MTN' ? 'M' : 'A';
    label.textContent = net + ' number detected';
  };

  A.AuthSubmit = function(){
    var phone = A.Auth.normalize(A.$('auth-phone').value);
    var net = phone ? A.Auth.networkOf(phone) : null;
    if (!phone || !net){
      A.$('auth-err').textContent = 'Enter a valid Ugandan MTN or Airtel number, e.g. 772 123 456.';
      return;
    }
    var existed = !!A.Auth.loadLocal(phone);
    A.Auth.enter(phone);
    boot();
    A.toast(existed ? 'Welcome back, ' + A.Auth.display(phone) : 'Account created for ' + A.Auth.display(phone) + ' (' + net + '). Deposit to start.');
  };

  function initChrome(){
    A.$('auth-logo').innerHTML = A.logo(56);
    A.$('brand-home').innerHTML = A.logo(26) + 'ASCENDIN';
    A.$('nav-brand').innerHTML = A.logo(22) + 'ASCENDIN';
    A.$('search-ic').innerHTML = A.icon('search',18);
    A.$('sd-back').innerHTML = A.icon('back',20);
    A.$('bd-back').innerHTML = A.icon('back',20);
    A.$('dep-back').innerHTML = A.icon('back',20);
    A.$('wd-back').innerHTML = A.icon('back',20);
    A.$('inv-back').innerHTML = A.icon('back',20);
    A.$('st-back').innerHTML = A.icon('back',20);
    A.$('sd-dots').innerHTML = A.icon('dots',20);
        A.$('sd-bell').innerHTML = A.icon('bell',20);
    A.$('sd-bell').innerHTML = A.icon('bell',20);
    A.$('ic-bell').innerHTML = A.icon('bell');
    A.$('ic-user').innerHTML = A.icon('user');
    A.$('ic-chart').innerHTML = A.icon('chart');
    A.$('ic-receipt').innerHTML = A.icon('receipt');
    A.$('ic-gift').innerHTML = A.icon('gift');
    A.$('ic-sun').innerHTML = A.icon('sun');
    A.$('ic-help').innerHTML = A.icon('help');
    A.$('ic-dl').innerHTML = A.icon('dl');
    A.$('ic-mega').innerHTML = A.icon('mega');
        A.$('ic-share').innerHTML = A.icon('swap');
    A.$('p2p-back').innerHTML = A.icon('back',20);
    A.$('p2p-refresh').innerHTML = A.icon('swap',18);
    A.$('p2ps-back').innerHTML = A.icon('back',20);
    A.$('p2pr-back').innerHTML = A.icon('back',20);
    A.$('depc-back').innerHTML = A.icon('back',20);
    A.$('wdc-back').innerHTML = A.icon('back',20);
    var navBtns = document.querySelectorAll('#bottom-nav button .nic');
    navBtns[0].innerHTML = A.icon('home',22);
    navBtns[1].innerHTML = A.icon('chart',22);
    navBtns[2].innerHTML = A.icon('doc',22);
    navBtns[3].innerHTML = A.icon('user',22);
    A.Home.initChrome();
  }

  function boot(){
    document.documentElement.setAttribute('data-theme', A.state.theme || 'dark');
    A.$('theme-switch').classList.toggle('on', (A.state.theme || 'dark') === 'dark');
    initChrome();
    A.renderAll();
    A.go('home');
    A.Sync.init();
    A.Boost.check();
        A.Stocks.refreshMarket();
    setInterval(function(){ A.Stocks.refreshMarket(); }, 60000);
  }

  /* start: logged in or auth screen */
  var sess = A.Auth.session();
  if (sess && A.Auth.loadLocal(sess)){
    A.Auth.enter(sess);
    boot();
  } else {
    A.$('auth-logo').innerHTML = A.logo(56);
    A.go('auth');
  }
})();
/* pause home video when leaving home (appended) */
(function(){
  var A = window.Ascendin;
  var origGo = A.go;
  A.go = function(v){ if (v !== 'home'){ var hv = document.getElementById('home-video'); if (hv) hv.pause(); } return origGo.apply(this, arguments); };
})();
