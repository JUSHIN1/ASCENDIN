/* Additive UI layer v2 - defensive. Never edits core files. */
(function(){
  var A = window.Ascendin;

  function bondFallback(){
    var el = A.$('bond-list'); if (!el || !A.BONDS || !A.BONDS.length) return;
    var h = '';
    for (var i=0;i<A.BONDS.length;i++){
      var b = A.BONDS[i];
      h += '<div class="bond-card" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')">'+
        '<div class="bc-top"><span class="bc-type">'+b.type+'</span><span class="bc-risk">'+b.risk+' risk</span></div>'+
        '<div class="bc-name">'+b.name+'</div>'+
        '<div class="bc-issuer">'+b.issuer+'</div>'+
        '<div class="bc-rate-row"><span class="bc-rate">'+b.rate.toFixed(1)+'<em>% / yr</em></span><span class="bc-tenor">1-24 months</span></div>'+
        '<div class="bc-bar"><i style="width:'+Math.max(8,Math.round(b.rate/25))+'%"></i></div>'+
        '<div class="bc-min">from '+A.ugx(b.min)+'</div></div>';
    }
    el.innerHTML = h;
  }

  function fillHero(){
    var bestM=0,bestMin=0,inv=0,inc=0,e;
    for(var i=0;i<A.BONDS.length;i++){ var m=A.BONDS[i].min*A.BONDS[i].rate/100/12; if(m>bestM){bestM=m;bestMin=A.BONDS[i].min;} }
    if (A.state && A.state.bondHold) for (var k in A.state.bondHold){ var bd=null; for(var x=0;x<A.BONDS.length;x++) if(A.BONDS[x].id===k) bd=A.BONDS[x]; if(bd){ inv+=A.state.bondHold[k].amount; inc+=A.state.bondHold[k].amount*bd.rate/100; } }
    if((e=A.$('bond-top'))) e.textContent=A.ugx(bestM)+' / mo';
    if((e=A.$('bond-top-sub'))) e.textContent='from a '+A.ugx(bestMin)+' investment';
    if((e=A.$('bond-mine'))) e.textContent=A.ugx(inv);
    if((e=A.$('bond-mine-year'))) e.textContent='projects '+A.ugx(inc)+' per year';
  }

  function onBoot(){
    var old=document.querySelector('.bond-hero');
    if(old){ old.outerHTML='<div class="bond-hero-card"><span id="bond-toprate" style="display:none"></span><div class="bhc-row"><div><div class="muted small">Earn up to</div><div class="big" id="bond-top">UGX 0</div><div class="muted small" id="bond-top-sub">per month</div></div><div class="bhc-right"><div class="muted small">Your fixed income</div><div class="bold" id="bond-mine">UGX 0</div><div class="muted small" id="bond-mine-year">projects UGX 0 per year</div></div></div></div>'; }
    var vb=A.$('view-bonds');
    if(vb&&!A.$('bonds-bg')){ vb.insertAdjacentHTML('afterbegin','<div class="home-bg" id="bonds-bg"><video id="bonds-video" autoplay muted loop playsinline preload="metadata"></video><div class="home-bg-fade"></div></div>'); }
    var nl=A.$('news-list');
    if(nl&&nl.parentNode.className!=='news-auto'){ var w=document.createElement('div'); w.className='news-auto'; nl.parentNode.insertBefore(w,nl); w.appendChild(nl); }
    var unlock=function(){
      ['home-video','bonds-video'].forEach(function(id){ var v=A.$(id); if(v&&v.paused){ v.play().catch(function(){}); } });
      document.removeEventListener('pointerdown',unlock); document.removeEventListener('keydown',unlock);
    };
    document.addEventListener('pointerdown',unlock); document.addEventListener('keydown',unlock);
  }

  var bR=A.Bonds.render;
  A.Bonds.render=function(){
    try{ bR.apply(A.Bonds,arguments); }catch(e){ bondFallback(); }
    var bl=A.$('bond-list');
    if(!bl || bl.children.length===0){ bondFallback(); }
    fillHero();
    A.Bonds.initVideoX();
  };

  var hR=A.Home.render;
  A.Home.render=function(){ try{ hR.apply(A.Home,arguments); }catch(e){} };
  A.Bonds.initVideoX=function(){
    var v=A.$('bonds-video'),wrap=A.$('bonds-bg');
    if(!v||!wrap||!A.Home.videoList) return;
    var list=A.Home.videoList(); if(!list.length) return;
    list=list.slice(3).concat(list.slice(0,3));
    if(v.dataset.ready==='1'){ if(v.paused&&v.play)v.play().catch(function(){}); return; }
    v.dataset.ready='1'; v.dataset.list=JSON.stringify(list); v.dataset.idx='0'; v.loop=true;
    v.onerror=function(){ wrap.style.display='none'; };
    v.src=list[0];
    if(v.play)v.play().catch(function(){ wrap.style.display='none'; });
    setInterval(function(){
      if(document.hidden) return;
      var s=A.$('view-bonds'); if(!s||!s.classList.contains('active')) return;
      var L=[]; try{L=JSON.parse(v.dataset.list||'[]');}catch(e){}
      if(!L.length) return;
      var i=(parseInt(v.dataset.idx||'0',10)+1)%L.length; v.dataset.idx=String(i);
      v.currentTime=0; v.src=L[i]; if(v.play)v.play().catch(function(){});
    },15000);
  };

  function sweep(){
    try{ if(A.state){ A.Stocks.renderStockTabs(); A.Stocks.renderStocks(); A.Bonds.render(); A.Home.render(); } }catch(e){}
  }
  setTimeout(sweep,0); setTimeout(sweep,500); setTimeout(sweep,1500);

  onBoot();
})();

/* ===== /* ===== bonds tape + organized auth (signup/login) + professional T&C ===== */
(function(){
  var A=window.Ascendin;

  /* --- scrolling bonds tape --- */
  function tapeHTML(){
    var h='';
    for(var r=0;r<2;r++){ for(var i=0;i<A.BONDS.length;i++){ var b=A.BONDS[i];
      h+='<div class="bt-chip" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')"><span class="bt-name">'+b.name+'</span><span class="bt-rate">'+b.rate.toFixed(1)+'%</span></div>'; } }
    return h;
  }
  function ensureTape(){
    var vb=A.$('view-bonds'); if(!vb) return;
    if(!vb.querySelector('.bond-tapewrap')){
      var w=document.createElement('div'); w.className='tickerwrap bond-tapewrap';
      w.innerHTML='<div class="tickertrack" id="bond-ticker"></div>';
      var bg=A.$('bonds-bg');
      if(bg&&bg.nextSibling) vb.insertBefore(w,bg.nextSibling); else vb.insertBefore(w,vb.firstChild);
    }
    var t=A.$('bond-ticker'); if(t) t.innerHTML=tapeHTML();
  }
  if(A.Bonds){ var bR2=A.Bonds.render; A.Bonds.render=function(){ bR2.apply(A.Bonds,arguments); ensureTape(); }; }

  /* --- professional Terms & Conditions --- */
  var TC=[
   ['1. Definitions & Interpretation','"Ascendin", "the Platform", "we", "us" and "our" refer to the Ascendin application and its operator. "You", "User" and "your" refer to any registered individual. "Account" means your Ascendin wallet and investment profile. "Mobile Money" means MTN Mobile Money and Airtel Money services offered in Uganda. Headings are for convenience only.'],
   ['2. Platform Status','Ascendin is presently a demonstration platform. Prices, balances, yields, leaderboards and counterparties displayed are simulated for illustration and do not constitute real securities, real client money or a regulated investment business unless we notify you otherwise in writing.'],
   ['3. Eligibility & Age','You must be at least 18 years old and legally capable of entering binding contracts to open an Account. By registering you warrant that you are 18 or older. We may request proof of age and may suspend or close any Account held by a minor.'],
   ['4. Account Registration','To register you must provide a valid Ugandan mobile money number, a valid email address and a password meeting our strength rules. You must keep all information accurate and current. One person may hold only one Account. We may refuse or reverse registration where information is false, incomplete or duplicated.'],
   ['5. Credentials & Security','You are responsible for keeping your password and mobile money PIN confidential. Passwords are stored on your device as a one-way hash and are never kept in plain text. You must notify us immediately of any suspected unauthorised use. We are not liable for losses caused by your failure to safeguard credentials.'],
   ['6. Wallet, Deposits & Withdrawals','Your wallet is linked to your mobile money number. Deposits are initiated by mobile money prompt or by USDT transfer to a designated reserve address. Withdrawals are sent to your registered number or wallet address. Telco and network fees may apply and are disclosed before you confirm. Daily limits apply.'],
   ['7. Stocks & Fractional Shares','Stocks are offered as fractional units for illustration. Simulated prices move continuously and are not exchange quotes. Buying and selling execute at the displayed simulated price. Ownership records exist only within your Account on this Platform.'],
   ['8. Bonds & Fixed Income','Bond products display an indicative annual rate, tenor and minimum. The calculator projects interest for convenience only and is not a guarantee of return. Coupon frequency and maturity treatment follow each product description. Capital is committed for the chosen tenor.'],
   ['9. Peer-to-Peer (P2P) Trading','P2P lets you offer holdings to other Users via one-time codes. Units are held in escrow until the buyer redeems the code. You are responsible for the price you set and for sharing codes only with intended buyers. We facilitate matching but do not guarantee counterparty performance.'],
   ['10. Crypto (USDT) Transfers','USDT deposits and withdrawals run on selected networks (TRC20/BEP20). Credits occur after network confirmation and manual reserve verification. Sending on an unsupported network or to a wrong address may result in irreversible loss, for which we are not liable.'],
   ['11. Fees & Charges','Deposits by mobile money are free. Withdrawal fees, where applicable, are shown before confirmation. We may introduce or change fees with prior notice in the app. Continued use after notice constitutes acceptance.'],
   ['12. Promotions & Boosts','Launch boosts and promotional yields are discretionary, time-limited and may be withdrawn or varied at our sole discretion. They do not form part of these Terms unless expressly stated.'],
   ['13. Risk Warning','All investing carries risk, including loss of capital. Simulated or projected returns are not promises. Past performance does not indicate future results. Only commit funds you can afford to leave invested.'],
   ['14. No Investment Advice','Nothing on the Platform constitutes investment, legal, tax or accounting advice, nor a recommendation or offer to buy or sell any real security. You make your own decisions and bear your own outcomes.'],
   ['15. Privacy & Data Protection','We collect only what is needed to operate your Account: mobile number, email, date of birth, device-stored credential hash and transaction history. We handle personal data in line with the Uganda Data Protection and Privacy Act, 2019. We do not sell your personal data. You may request correction or deletion of your data.'],
   ['16. AML & Counter-Financing of Terrorism','You must not use the Platform for money laundering, terrorism financing, fraud or any unlawful purpose. We may perform know-your-customer checks, monitor activity and report suspicious behaviour to competent authorities as required by law.'],
   ['17. Prohibited Conduct','You must not: misrepresent your identity; use another person\'s number or email; manipulate prices or activity feeds; attempt to reverse-engineer, disrupt or overload the Platform; or use automated means to create multiple Accounts. Breach may lead to suspension or termination.'],
   ['18. Intellectual Property','The Ascendin name, logo, interface, content and code are our property or licensed to us. You receive a limited, personal, non-transferable licence to use the app for its intended purpose.'],
   ['19. Availability & Maintenance','We strive for reliability but do not warrant uninterrupted or error-free service. We may suspend access for maintenance, security or legal reasons. Simulated services may be reset or rebuilt without liability.'],
   ['20. Limitation of Liability','To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential losses, nor for losses arising from simulated values, telco outages, network congestion, or your breach of these Terms.'],
   ['21. Indemnity','You agree to indemnify us against claims, losses and expenses arising from your misuse of the Platform or breach of these Terms.'],
   ['22. Suspension & Termination','We may suspend or terminate an Account for breach, fraud, legal requirement, or prolonged inactivity. You may close your Account at any time by withdrawing your balance and requesting closure. Surviving clauses continue after termination.'],
   ['23. Changes to These Terms','We may update these Terms from time to time. Material changes will be highlighted in the app. Continued use after the effective date means you accept the revised Terms.'],
   ['24. Governing Law & Disputes','These Terms are governed by the laws of the Republic of Uganda. Disputes shall first be addressed in good faith; failing resolution, they fall to the courts of competent jurisdiction in Kampala, Uganda.'],
   ['25. Severability & Entire Agreement','If any clause is held unenforceable, the remainder continues in force. These Terms, together with in-app product descriptions, form the entire agreement between you and us.'],
   ['26. Contact','Questions about these Terms or your Account can be raised through the in-app Help Center or the contact details published in the app.']
  ];
  function tcHTML(){
    var h='';
    for(var i=0;i<TC.length;i++){ h+='<div class="tc-sec"><h4>'+TC[i][0]+'</h4><p>'+TC[i][1]+'</p></div>'; }
    return h;
  }
  A.openTC=function(){
    A.openSheet('<div style="text-align:left"><div style="font-size:18px;font-weight:800;margin-bottom:8px">Terms & Conditions</div><div style="max-height:62vh;overflow:auto;padding-right:4px" id="tc-body">'+tcHTML()+'</div><button class="btn outline" style="margin-top:12px" onclick="Ascendin.closeAll()">CLOSE</button></div>');
  };

  /* --- organized auth: two separate pages, auto-home after signup/login --- */
(function(){
  var A=window.Ascendin;
  function hash(s){var h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0;}return 'h'+(h>>>0);}
  function strong(pw){ return pw.length>=8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw); }
  function ageOf(dob){ var d=new Date(dob); if(isNaN(d))return -1; var t=new Date(); var a=t.getFullYear()-d.getFullYear(); var m=t.getMonth()-d.getMonth(); if(m<0||(m===0&&t.getDate()<d.getDate()))a--; return a; }
  function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  var proceed=A.AuthSubmit;
  var hasAccounts=localStorage.getItem('asc_cred_index')!==null;
  var mode=hasAccounts?'login':'signup';

  function signupPage(){
    return '<div class="auth-card" style="text-align:left">'+
      '<div class="center" style="margin-bottom:6px"><div style="font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:26px;letter-spacing:2px">ASCENDIN</div><div class="muted small">INVEST TODAY. GROW TOMORROW.</div></div>'+
      '<div style="font-size:20px;font-weight:700;margin:16px 0 6px">Create your account</div>'+
      '<div class="muted small" style="margin-bottom:14px">Join Ascendin with your mobile number, email and a strong password. You will go straight to your dashboard.</div>'+
      '<div class="muted small">Mobile number (MTN / Airtel)</div>'+
      '<div class="field"><span class="pre">+256</span><input id="au-phone" type="tel" inputmode="numeric" placeholder="7XXXXXXXX"></div>'+
      '<div class="muted small" style="margin-top:8px">Email address</div>'+
      '<div class="field"><input id="au-email" type="email" placeholder="you@example.com"></div>'+
      '<div class="muted small" style="margin-top:8px">Password</div>'+
      '<div class="field"><input id="au-pw" type="password" placeholder="8+ chars, upper, lower, number, symbol"></div>'+
      '<div class="field" style="margin-top:8px"><input id="au-pw2" type="password" placeholder="Confirm password"></div>'+
      '<div class="muted small" style="margin-top:8px">Date of birth (18+ only)</div>'+
      '<div class="field"><input id="au-dob" type="date"></div>'+
      '<label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0;font-size:12.5px;text-align:left"><input type="checkbox" id="au-tc" style="margin-top:2px"><span>I am 18+ and I have read and agree to the <span class="link" id="au-tc-open">Terms & Conditions</span></span></label>'+
      '<input type="hidden" id="auth-phone" value="">'+
      '<div class="small down" id="auth-err2" style="min-height:16px"></div>'+
      '<button class="btn green" style="margin-top:10px;width:100%" id="auth-go">CREATE ACCOUNT & CONTINUE</button>'+
      '<div class="muted small center" style="margin-top:14px">Already have an account? <span class="link" id="auth-switch">Log in</span></div>'+
    '</div>';
  }
  function loginPage(){
    return '<div class="auth-card" style="text-align:left">'+
      '<div class="center" style="margin-bottom:6px"><div style="font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:26px;letter-spacing:2px">ASCENDIN</div><div class="muted small">INVEST TODAY. GROW TOMORROW.</div></div>'+
      '<div style="font-size:20px;font-weight:700;margin:16px 0 6px">Welcome back</div>'+
      '<div class="muted small" style="margin-bottom:14px">Log in with your mobile number and password to reach your wallet, stocks and bonds.</div>'+
      '<div class="muted small">Mobile number</div>'+
      '<div class="field"><span class="pre">+256</span><input id="au-phone" type="tel" inputmode="numeric" placeholder="7XXXXXXXX"></div>'+
      '<div class="muted small" style="margin-top:8px">Password</div>'+
      '<div class="field"><input id="au-pw" type="password" placeholder="Your password"></div>'+
      '<input type="hidden" id="auth-phone" value="">'+
      '<div class="small down" id="auth-err2" style="min-height:16px"></div>'+
      '<button class="btn green" style="margin-top:10px;width:100%" id="auth-go">LOG IN</button>'+
      '<div class="muted small center" style="margin-top:14px">New to Ascendin? <span class="link" id="auth-switch">Create account</span></div>'+
    '</div>';
  }
  function mountAuth(){
    var wrap=document.querySelector('#view-auth .auth-wrap');
    if(!wrap) return;
    wrap.innerHTML=(mode==='login'?loginPage():signupPage());
    var sw=A.$('auth-switch'); if(sw) sw.onclick=function(){ mode=(mode==='login'?'signup':'login'); mountAuth(); };
    var tco=A.$('au-tc-open'); if(tco) tco.onclick=function(ev){ ev.preventDefault(); A.openTC(); };
    A.$('auth-go').onclick=submitAuth;
  }
  function goHome(){ setTimeout(function(){ if(A.state&&A.state.phone) A.go('home'); },60); }
  function submitAuth(){
    var err=A.$('auth-err2');
    var phone=(A.$('au-phone').value||'').replace(/\D/g,'');
    var pw=(A.$('au-pw').value||'');
    if(phone.length<9){ err.textContent='Enter a valid Ugandan mobile number.'; return; }
    if(mode==='signup'){
      var email=(A.$('au-email').value||'').trim().toLowerCase();
      var pw2=(A.$('au-pw2').value||'');
      var dob=(A.$('au-dob').value||'');
      if(!validEmail(email)){ err.textContent='Enter a valid email address.'; return; }
      if(!strong(pw)){ err.textContent='Password too weak: need 8+ chars with upper, lower, number and symbol.'; return; }
      if(pw!==pw2){ err.textContent='Passwords do not match.'; return; }
      var ag=ageOf(dob); if(ag<18){ err.textContent='You must be 18 years or older to open an account.'; return; }
      if(ag>120){ err.textContent='Enter a valid date of birth.'; return; }
      if(!(A.$('au-tc').checked)){ err.textContent='You must read and accept the Terms & Conditions.'; return; }
      var idx={}; try{ idx=JSON.parse(localStorage.getItem('asc_cred_index')||'{}'); }catch(e){}
      if(idx[phone]){ err.textContent='This number already has an account. Log in instead.'; return; }
      if(idx['e:'+email]){ err.textContent='This email is already registered.'; return; }
      idx[phone]=true; idx['e:'+email]=phone;
      localStorage.setItem('asc_cred_index',JSON.stringify(idx));
      localStorage.setItem('asc_cred_'+phone,JSON.stringify({pw:hash(pw),email:email,dob:dob,tc:true,ts:Date.now()}));
      localStorage.setItem('asc_tc_v1','1');
      A.$('auth-phone').value=phone;
      proceed(); goHome();
    } else {
      var saved=null; try{ saved=JSON.parse(localStorage.getItem('asc_cred_'+phone)||'null'); }catch(e){}
      if(!saved){ err.textContent='No account for this number. Create one first.'; return; }
      if(hash(pw)!==saved.pw){ err.textContent='Incorrect password.'; return; }
      A.$('auth-phone').value=phone;
      proceed(); goHome();
    }
  }
  A.AuthSubmit=function(){ submitAuth(); };
  setTimeout(mountAuth,300);
})();

/* ===== bonds dim bg handled in CSS; bonds tape + T&C gate + strong password + age gate ===== */
(function(){
  var A=window.Ascendin;
  /* --- scrolling bonds tape at top of Bonds --- */
  function tapeHTML(){
    var h='';
    for(var r=0;r<2;r++){
      for(var i=0;i<A.BONDS.length;i++){
        var b=A.BONDS[i];
        h+='<div class="bt-chip" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')"><span class="bt-name">'+b.name+'</span><span class="bt-rate">'+b.rate.toFixed(1)+'%</span></div>';
      }
    }
    return h;
  }
  function ensureTape(){
    var vb=A.$('view-bonds'); if(!vb) return;
    if(!vb.querySelector('.bond-tapewrap')){
      var w=document.createElement('div'); w.className='tickerwrap bond-tapewrap';
      w.innerHTML='<div class="tickertrack" id="bond-ticker"></div>';
      var bg=A.$('bonds-bg');
      if(bg&&bg.nextSibling) vb.insertBefore(w,bg.nextSibling); else vb.insertBefore(w,vb.firstChild);
    }
    var t=A.$('bond-ticker'); if(t) t.innerHTML=tapeHTML();
  }
  if(A.Bonds){ var bR2=A.Bonds.render; A.Bonds.render=function(){ bR2.apply(A.Bonds,arguments); ensureTape(); }; }
  /* --- Terms & Conditions accept gate --- */
  var TCK='asc_tc_v1';
  function showTC(){
    if(localStorage.getItem(TCK)==='1') return;
    A.openDialog('<div style="max-height:56vh;overflow:auto;text-align:left;font-size:13px;line-height:1.55">'+
      '<div style="font-size:18px;font-weight:800;margin-bottom:8px">Terms & Conditions</div>'+
      '<p>1. You must be 18 years or older to open an Ascendin account.</p>'+
      '<p>2. Your wallet is linked to your mobile money number; never share your PIN or password.</p>'+
      '<p>3. Investments carry risk; past performance does not guarantee future returns.</p>'+
      '<p>4. Ascendin is a demonstration platform; balances and prices are simulated.</p>'+
      '<p>5. By accepting you confirm the information you provide is true and yours.</p>'+
      '<p class="muted small">Placeholder terms - the owner will refine these.</p></div>'+
      '<label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0;font-size:13px"><input type="checkbox" id="tc-age" style="margin-top:2px"><span>I am 18 years or older and I accept the Terms & Conditions</span></label>'+
      '<button class="btn green" id="tc-accept" disabled>ACCEPT & CONTINUE</button>');
    var cb=document.getElementById('tc-age'), btn=document.getElementById('tc-accept');
    if(cb&&btn){ cb.onchange=function(){ btn.disabled=!cb.checked; }; btn.onclick=function(){ localStorage.setItem(TCK,'1'); A.closeAll(); }; }
  }
  setTimeout(showTC,500);
  /* --- strong password + 18+ age gate on login / create account --- */
  function hash(s){var h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0;}return 'h'+(h>>>0);}
  function strong(pw){ return pw.length>=8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw); }
  function ageOf(dob){ var d=new Date(dob); if(isNaN(d))return -1; var t=new Date(); var a=t.getFullYear()-d.getFullYear(); var m=t.getMonth()-d.getMonth(); if(m<0||(m===0&&t.getDate()<d.getDate()))a--; return a; }
  if(typeof A.AuthSubmit==='function'){
    var origSubmit=A.AuthSubmit;
    A.AuthSubmit=function(){
      var phone=(A.$('auth-phone').value||'').replace(/\D/g,'');
      if(phone.length<9){ return origSubmit(); }
      var key='asc_cred_'+phone, saved=null;
      try{ saved=JSON.parse(localStorage.getItem(key)||'null'); }catch(e){}
      var isNew=!saved;
      A.openDialog('<div style="text-align:left">'+
        '<div style="font-size:18px;font-weight:800;margin-bottom:4px">'+(isNew?'Create a strong password':'Enter your password')+'</div>'+
        '<div class="muted small" style="margin-bottom:10px">'+(isNew?'8+ characters with an uppercase, lowercase, number and symbol.':'Your password is kept on this device as a secure hash.')+'</div>'+
        '<div class="field"><input id="pw1" type="password" placeholder="Password"></div>'+
        (isNew?'<div class="field" style="margin-top:8px"><input id="pw2" type="password" placeholder="Confirm password"></div>'+
               '<div class="muted small" style="margin:10px 0 4px">Date of birth (18+ only)</div>'+
               '<div class="field"><input id="dob" type="date"></div>':'')+
        '<div class="small down" id="pw-err" style="min-height:16px"></div>'+
        '<button class="btn green" style="margin-top:10px" id="pw-go">CONTINUE</button></div>');
      document.getElementById('pw-go').onclick=function(){
        var pw=document.getElementById('pw1').value, err=document.getElementById('pw-err');
        if(isNew){
          var pw2=document.getElementById('pw2').value, dob=document.getElementById('dob').value, ag=ageOf(dob);
          if(!strong(pw)){ err.textContent='Too weak: need 8+ chars, upper, lower, number and symbol.'; return; }
          if(pw!==pw2){ err.textContent='Passwords do not match.'; return; }
          if(ag<18){ err.textContent='You must be 18 years or older to sign up.'; return; }
          if(ag>120){ err.textContent='Enter a valid date of birth.'; return; }
          localStorage.setItem(key, JSON.stringify({pw:hash(pw), dob:dob}));
          A.closeAll(); origSubmit();
        } else {
          if(hash(pw)!==saved.pw){ err.textContent='Wrong password for this number.'; return; }
          A.closeAll(); origSubmit();
        }
      };
    };
  }
})();
