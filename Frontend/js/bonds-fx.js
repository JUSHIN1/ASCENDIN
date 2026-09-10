/* Bonds visuals: background video (slightly visible) + scrolling tape at top. */
(function(){
  var A=window.Ascendin;

  /* --- background video --- */
  function ensureBg(){
    var vb=A.$('view-bonds'); if(!vb) return;
    if(!A.$('bonds-bg')){
      vb.insertAdjacentHTML('afterbegin','<div class="home-bg" id="bonds-bg"><video id="bonds-video" autoplay muted loop playsinline preload="metadata"></video><div class="home-bg-fade"></div></div>');
    }
  }
  function initVideo(){
    var v=A.$('bonds-video'), wrap=A.$('bonds-bg');
    if(!v||!wrap||!A.Home||!A.Home.videoList) return;
    var list=A.Home.videoList(); if(!list||!list.length) return;
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
  }

  /* --- scrolling tape --- */
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

  ensureBg(); initVideo(); ensureTape();
  if(A.Bonds){ var bR=A.Bonds.render; A.Bonds.render=function(){ bR.apply(A.Bonds,arguments); ensureTape(); }; }
  var g=A.go; A.go=function(v){ if(v==='bonds'){ ensureBg(); initVideo(); ensureTape(); } return g.apply(this,arguments); };
})();
