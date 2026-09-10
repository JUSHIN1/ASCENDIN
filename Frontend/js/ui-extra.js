(function(){
  var A=window.Ascendin;
  function onBoot(){
    var old=document.querySelector('.bond-hero');
    if(old){ old.outerHTML='<div class="bond-hero-card"><span id="bond-toprate" style="display:none"></span><div class="bhc-row"><div><div class="muted small">Earn up to</div><div class="big" id="bond-top">UGX 0</div><div class="muted small" id="bond-top-sub">per month</div></div><div class="bhc-right"><div class="muted small">Your fixed income</div><div class="bold" id="bond-mine">UGX 0</div><div class="muted small" id="bond-mine-year">projects UGX 0 per year</div></div></div></div>'; }
    var vb=A.$('view-bonds');
    if(vb&&!A.$('bonds-bg')){ vb.insertAdjacentHTML('afterbegin','<div class="home-bg" id="bonds-bg"><video id="bonds-video" autoplay muted loop playsinline preload="metadata"></video><div class="home-bg-fade"></div></div>'); }
    var nl=A.$('news-list');
    if(nl&&nl.parentNode.className!=='news-auto'){ var w=document.createElement('div'); w.className='news-auto'; nl.parentNode.insertBefore(w,nl); w.appendChild(nl); }
  }
  var bR=A.Bonds.render;
  A.Bonds.render=function(){
    bR.apply(A.Bonds,arguments);
    var bestM=0,bestMin=0,inv=0,inc=0;
    for(var i=0;i<A.BONDS.length;i++){ var m=A.BONDS[i].min*A.BONDS[i].rate/100/12; if(m>bestM){bestM=m;bestMin=A.BONDS[i].min;} }
    for(var k in A.state.bondHold){ var bd=null; for(var x=0;x<A.BONDS.length;x++) if(A.BONDS[x].id===k) bd=A.BONDS[x]; if(bd){ inv+=A.state.bondHold[k].amount; inc+=A.state.bondHold[k].amount*bd.rate/100; } }
    var e; if((e=A.$('bond-top'))) e.textContent=A.ugx(bestM)+' / mo';
    if((e=A.$('bond-top-sub'))) e.textContent='from a '+A.ugx(bestMin)+' investment';
    if((e=A.$('bond-mine'))) e.textContent=A.ugx(inv);
    if((e=A.$('bond-mine-year'))) e.textContent='projects '+A.ugx(inc)+' per year';
    A.Bonds.initVideoX();
  };
  var hR=A.Home.render;
  A.Home.render=function(){
    hR.apply(A.Home,arguments);
    var nl=A.$('news-list');
    if(nl&&!nl.querySelector('.news-track')){ var inner=nl.innerHTML; nl.innerHTML='<div class="news-track">'+inner+inner+'</div>'; var t=nl.firstChild; if(t) t.style.animationDuration=(A.NEWS.length*7)+'s'; }
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
  A.Stocks.renderStockTabs=function(){
    var tabs=['All','USE','Africa','New','US','World','ETFs'],h='';
    for(var i=0;i<tabs.length;i++){
      var act=A.Stocks.stockTab===tabs[i]?' active':'';
      var lab=tabs[i]==='USE'?'USE listed':tabs[i]==='New'?'New listings':tabs[i];
      h+='<div class="tab'+act+'" onclick="Ascendin.Stocks.setStockTab(\''+tabs[i]+'\')">'+lab+'</div>';
    }
    A.$('stock-tabs').innerHTML=h;
  };
  A.Stocks.renderStocks=function(){
    var q=(A.$('stock-search').value||'').toLowerCase(),h='',t=A.Stocks.stockTab;
    for(var i=0;i<A.STOCKS.length;i++){
      var s=A.STOCKS[i];
      if(t==='USE'&&s.market!=='USE')continue;
      if(t==='New'&&s.market!=='NEW')continue;
      if(t==='US'&&s.market!=='US')continue;
      if(t==='ETFs'&&s.market!=='ETF')continue;
      if(t==='Africa'&&s.market!=='AFR'&&s.market!=='USE')continue;
      if(t==='World'&&s.market!=='WRD')continue;
      if(q&&s.name.toLowerCase().indexOf(q)<0&&s.id.toLowerCase().indexOf(q)<0)continue;
      h+='<div class="asset" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">'+
        '<div class="logo" style="background:'+s.color+'; color:'+(s.tc||'#fff')+'">'+(A.logoHTML?A.logoHTML(s):s.L)+'</div>'+
        '<div style="flex:1"><div class="bold">'+s.name+'</div><div class="muted small">'+s.id+' - '+s.sector+'</div></div>'+
        '<div style="text-align:right"><div class="bold">'+(s.cur==='USD'?'$'+s.price.toFixed(2):'UGX '+A.fmt(s.price))+'</div>'+A.chgHTML(s.chg)+'</div></div>';
    }
    A.$('stock-list').innerHTML=h||'<div class="muted center" style="padding:30px">No stocks match your search.</div>';
  };
  onBoot();
})();
