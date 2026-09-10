(function(){
  var A = window.Ascendin;
  if (!A || !A.STOCKS) return;
  
  var newStocks = [
    { id:'SAFCOM', name:'Safaricom PLC', sector:'Telecom', market:'AFR', L:'S', color:'#f97316', base:2500, cur:'UGX', about:'Safaricom is a Kenyan telecom company, tradable on Ascendin as a fractional share.' },
    { id:'DANGCEM', name:'Dangote Cement', sector:'Industrial', market:'AFR', L:'D', color:'#0891b6', base:45000, cur:'UGX', about:'Dangote Cement is a Nigerian industrial company, tradable on Ascendin as a fractional share.' },
    { id:'NPN', name:'Naspers', sector:'Internet', market:'AFR', L:'N', color:'#7c3aed', base:320000, cur:'UGX', about:'Naspers is an internet company listed in South Africa, tradable on Ascendin as a fractional share.' },
    { id:'MTNN', name:'MTN Nigeria', sector:'Telecom', market:'AFR', L:'M', color:'#dc2626', base:21000, cur:'UGX', about:'MTN Nigeria is a telecom company listed in Nigeria, tradable on Ascendin as a fractional share.' },
    { id:'EABL', name:'East African Breweries', sector:'Consumer', market:'AFR', L:'E', color:'#16a34a', base:15000, cur:'UGX', about:'East African Breweries is a consumer company listed in Kenya, tradable on Ascendin as a fractional share.' }
  ];
  
  var existing = {};
  A.STOCKS.forEach(function(s){ existing[s.id] = true; });
  
  newStocks.forEach(function(s){
    if (!existing[s.id]) {
      A.STOCKS.push(s);
      existing[s.id] = true;
    }
  });
})();