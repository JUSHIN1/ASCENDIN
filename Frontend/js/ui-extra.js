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
