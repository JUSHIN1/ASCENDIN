/* Additive UI layer: bonds gold hero + bonds background video. */
(function(){
  var A = window.Ascendin;
  function onBoot(){
    var old=document.querySelector('.bond-hero');
    if(old){ old.outerHTML='<div class="bond-hero-card"><span id="bond-toprate" style="display:none"></span><div class="bhc-row"><div><div class="muted small">Earn up to</div><div class="big" id="bond-top">UGX 0</div><div class="muted small" id="bond-top-sub">per month</div></div><div class="bhc-right"><div class="muted small">Your fixed income</div><div class="bold" id="bond-mine">UGX 0</div><div class="muted small" id="bond-mine-year">projects UGX 0 per year</div></div></div></div>'; }
    var vb=A.$('view-bonds');
    if(vb&&!A.$('bonds-bg')){ vb.insertAdjacentHTML('afterbegin','<div class="home-bg" id="bonds-bg"><video id="bonds-video" autoplay muted loop playsinline preload="metadata"></video><div class="home-bg-fade"></div></div>'); }
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
  var bR=A.Bonds.render;
  A.Bonds.render=function(){
    try{ bR.apply(A.Bonds,arguments); }catch(e){}
    fillHero();
    A.Bonds.initVideoX();
  };
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
  onBoot();
})();
