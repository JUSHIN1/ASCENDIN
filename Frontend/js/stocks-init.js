(function(){
  var A = window.Ascendin;
  if (!A || !A.STOCKS) return;
  A.STOCKS.forEach(function(s){
    if (typeof s.base === 'number'){
      if (typeof s.price !== 'number') s.price = s.base;
      if (typeof s.dayOpen !== 'number') s.dayOpen = s.base;
    }
    if (typeof s.chg !== 'number') s.chg = (Math.random()*4 - 2);
    if (!s.L) s.L = (s.id || '?').charAt(0);
    if (!s.color) s.color = '#0ea5e9';
  });
})();