/* Stocks list, live moving chart, buy and sell flows. */
(function(){
  var A = window.Ascendin;  /* ===== GLOBAL LISTINGS - self-contained, no init needed ===== */
  (function(){
    var add = [
      { id:'SAFCOM', name:'Safaricom PLC', sector:'Telecom', market:'AFR', L:'S', color:'#f97316', base:2500, cur:'UGX', price:2500, dayOpen:2500, chg:0, about:'Safaricom - telecom, Kenya.' },
      { id:'COOP', name:'Co-op Bank Kenya', sector:'Banking', market:'AFR', L:'C', color:'#0ea5e9', base:900, cur:'UGX', price:900, dayOpen:900, chg:0, about:'Co-op Bank - banking, Kenya.' },
      { id:'EABL', name:'East African Breweries', sector:'Consumer', market:'AFR', L:'E', color:'#16a34a', base:15000, cur:'UGX', price:15000, dayOpen:15000, chg:0, about:'EABL - consumer, Kenya.' },
      { id:'KPLC', name:'Kenya Power', sector:'Utilities', market:'AFR', L:'K', color:'#dc2626', base:700, cur:'UGX', price:700, dayOpen:700, chg:0, about:'Kenya Power - utilities, Kenya.' },
      { id:'BAMB', name:'Bamburi Cement', sector:'Industrial', market:'AFR', L:'B', color:'#7c3aed', base:4200, cur:'UGX', price:4200, dayOpen:4200, chg:0, about:'Bamburi - industrial, Kenya.' },
      { id:'DANGCEM', name:'Dangote Cement', sector:'Industrial', market:'AFR', L:'D', color:'#0891b2', base:45000, cur:'UGX', price:45000, dayOpen:45000, chg:0, about:'Dangote - industrial, Nigeria.' },
      { id:'GTCO', name:'GT Holdings', sector:'Banking', market:'AFR', L:'G', color:'#f97316', base:3800, cur:'UGX', price:3800, dayOpen:3800, chg:0, about:'GT Holdings - banking, Nigeria.' },
      { id:'ZENITH', name:'Zenith Bank', sector:'Banking', market:'AFR', L:'Z', color:'#0ea5e9', base:2600, cur:'UGX', price:2600, dayOpen:2600, chg:0, about:'Zenith - banking, Nigeria.' },
      { id:'MTNN', name:'MTN Nigeria', sector:'Telecom', market:'AFR', L:'M', color:'#16a34a', base:21000, cur:'UGX', price:21000, dayOpen:21000, chg:0, about:'MTN Nigeria - telecom, Nigeria.' },
      { id:'SEPLAT', name:'Seplat Energy', sector:'Energy', market:'AFR', L:'S', color:'#dc2626', base:19000, cur:'UGX', price:19000, dayOpen:19000, chg:0, about:'Seplat - energy, Nigeria.' },
      { id:'ACCESS', name:'Access Holdings', sector:'Banking', market:'AFR', L:'A', color:'#7c3aed', base:1200, cur:'UGX', price:1200, dayOpen:1200, chg:0, about:'Access - banking, Nigeria.' },
      { id:'NNF', name:'Nestle Nigeria', sector:'Consumer', market:'AFR', L:'N', color:'#0891b2', base:25000, cur:'UGX', price:25000, dayOpen:25000, chg:0, about:'Nestle Nigeria - consumer, Nigeria.' },
      { id:'NPN', name:'Naspers', sector:'Internet', market:'AFR', L:'N', color:'#f97316', base:320000, cur:'UGX', price:320000, dayOpen:320000, chg:0, about:'Naspers - internet, South Africa.' },
      { id:'AGL', name:'Anglo American', sector:'Mining', market:'AFR', L:'A', color:'#0ea5e9', base:28000, cur:'UGX', price:28000, dayOpen:28000, chg:0, about:'Anglo American - mining, South Africa.' },
      { id:'SHP', name:'Shoprite', sector:'Retail', market:'AFR', L:'S', color:'#16a34a', base:17000, cur:'UGX', price:17000, dayOpen:17000, chg:0, about:'Shoprite - retail, South Africa.' },
      { id:'FSR', name:'FirstRand', sector:'Banking', market:'AFR', L:'F', color:'#dc2626', base:5200, cur:'UGX', price:5200, dayOpen:5200, chg:0, about:'FirstRand - banking, South Africa.' },
      { id:'SOL', name:'Sasol', sector:'Chemicals', market:'AFR', L:'S', color:'#7c3aed', base:14000, cur:'UGX', price:14000, dayOpen:14000, chg:0, about:'Sasol - chemicals, South Africa.' },
      { id:'REM', name:'Remgro', sector:'Holdings', market:'AFR', L:'R', color:'#0891b2', base:9000, cur:'UGX', price:9000, dayOpen:9000, chg:0, about:'Remgro - holdings, South Africa.' },
      { id:'IMP', name:'Impala Platinum', sector:'Mining', market:'AFR', L:'I', color:'#f97316', base:11000, cur:'UGX', price:11000, dayOpen:11000, chg:0, about:'Impala - mining, South Africa.' },
      { id:'NED', name:'Nedbank Group', sector:'Banking', market:'AFR', L:'N', color:'#0ea5e9', base:16000, cur:'UGX', price:16000, dayOpen:16000, chg:0, about:'Nedbank - banking, South Africa.' },
      { id:'COMI', name:'Commercial Intl Bank', sector:'Banking', market:'AFR', L:'C', color:'#16a34a', base:1900, cur:'UGX', price:1900, dayOpen:1900, chg:0, about:'CIB - banking, Egypt.' },
      { id:'TMG', name:'Talaat Moustafa Group', sector:'Real Estate', market:'AFR', L:'T', color:'#dc2626', base:1500, cur:'UGX', price:1500, dayOpen:1500, chg:0, about:'TMG - real estate, Egypt.' },
      { id:'EAST', name:'Eastern Co', sector:'Consumer', market:'AFR', L:'E', color:'#7c3aed', base:1700, cur:'UGX', price:1700, dayOpen:1700, chg:0, about:'Eastern Co - consumer, Egypt.' },
      { id:'GCB', name:'GCB Bank', sector:'Banking', market:'AFR', L:'G', color:'#0891b2', base:4200, cur:'UGX', price:4200, dayOpen:4200, chg:0, about:'GCB - banking, Ghana.' },
      { id:'CRDB', name:'CRDB Bank', sector:'Banking', market:'AFR', L:'C', color:'#f97316', base:2100, cur:'UGX', price:2100, dayOpen:2100, chg:0, about:'CRDB - banking, Tanzania.' },
      { id:'VDT', name:'Vodacom Tanzania', sector:'Telecom', market:'AFR', L:'V', color:'#0ea5e9', base:1300, cur:'UGX', price:1300, dayOpen:1300, chg:0, about:'Vodacom - telecom, Tanzania.' },
      { id:'BKR', name:'Bank of Kigali', sector:'Banking', market:'AFR', L:'B', color:'#16a34a', base:900, cur:'UGX', price:900, dayOpen:900, chg:0, about:'Bank of Kigali - banking, Rwanda.' },
      { id:'FNBB', name:'FNB Botswana', sector:'Banking', market:'AFR', L:'F', color:'#dc2626', base:3000, cur:'UGX', price:3000, dayOpen:3000, chg:0, about:'FNB - banking, Botswana.' },
      { id:'MCB', name:'MCB Group', sector:'Banking', market:'AFR', L:'M', color:'#7c3aed', base:8000, cur:'UGX', price:8000, dayOpen:8000, chg:0, about:'MCB - banking, Mauritius.' },
      { id:'ATW', name:'Attijariwafa Bank', sector:'Banking', market:'AFR', L:'A', color:'#0891b2', base:42000, cur:'UGX', price:42000, dayOpen:42000, chg:0, about:'Attijariwafa - banking, Morocco.' },
      { id:'IAM', name:'Maroc Telecom', sector:'Telecom', market:'AFR', L:'I', color:'#f97316', base:10000, cur:'UGX', price:10000, dayOpen:10000, chg:0, about:'Maroc Telecom - telecom, Morocco.' },
      { id:'JPM', name:'JPMorgan Chase', sector:'Banking', market:'WRD', L:'J', color:'#16a34a', base:245, cur:'USD', price:245, dayOpen:245, chg:0, about:'JPMorgan - banking, USA.' },
      { id:'V', name:'Visa', sector:'Payments', market:'WRD', L:'V', color:'#dc2626', base:310, cur:'USD', price:310, dayOpen:310, chg:0, about:'Visa - payments, USA.' },
      { id:'MA', name:'Mastercard', sector:'Payments', market:'WRD', L:'M', color:'#7c3aed', base:520, cur:'USD', price:520, dayOpen:520, chg:0, about:'Mastercard - payments, USA.' },
      { id:'JNJ', name:'Johnson and Johnson', sector:'Health', market:'WRD', L:'J', color:'#0891b2', base:155, cur:'USD', price:155, dayOpen:155, chg:0, about:'JNJ - health, USA.' },
      { id:'WMT', name:'Walmart', sector:'Retail', market:'WRD', L:'W', color:'#f97316', base:95, cur:'USD', price:95, dayOpen:95, chg:0, about:'Walmart - retail, USA.' },
      { id:'PG', name:'Procter and Gamble', sector:'Consumer', market:'WRD', L:'P', color:'#0ea5e9', base:170, cur:'USD', price:170, dayOpen:170, chg:0, about:'P&G - consumer, USA.' },
      { id:'DIS', name:'Disney', sector:'Media', market:'WRD', L:'D', color:'#16a34a', base:112, cur:'USD', price:112, dayOpen:112, chg:0, about:'Disney - media, USA.' },
      { id:'NFLX', name:'Netflix', sector:'Media', market:'WRD', L:'N', color:'#dc2626', base:905, cur:'USD', price:905, dayOpen:905, chg:0, about:'Netflix - media, USA.' },
      { id:'AMD', name:'AMD', sector:'Semiconductors', market:'WRD', L:'A', color:'#7c3aed', base:122, cur:'USD', price:122, dayOpen:122, chg:0, about:'AMD - semiconductors, USA.' },
      { id:'INTC', name:'Intel', sector:'Semiconductors', market:'WRD', L:'I', color:'#0891b2', base:21, cur:'USD', price:21, dayOpen:21, chg:0, about:'Intel - semiconductors, USA.' },
      { id:'ORCL', name:'Oracle', sector:'Software', market:'WRD', L:'O', color:'#f97316', base:185, cur:'USD', price:185, dayOpen:185, chg:0, about:'Oracle - software, USA.' },
      { id:'CRM', name:'Salesforce', sector:'Software', market:'WRD', L:'C', color:'#0ea5e9', base:275, cur:'USD', price:275, dayOpen:275, chg:0, about:'Salesforce - software, USA.' },
      { id:'ADBE', name:'Adobe', sector:'Software', market:'WRD', L:'A', color:'#16a34a', base:340, cur:'USD', price:340, dayOpen:340, chg:0, about:'Adobe - software, USA.' },
      { id:'UBER', name:'Uber', sector:'Mobility', market:'WRD', L:'U', color:'#dc2626', base:78, cur:'USD', price:78, dayOpen:78, chg:0, about:'Uber - mobility, USA.' },
      { id:'ABNB', name:'Airbnb', sector:'Travel', market:'WRD', L:'A', color:'#7c3aed', base:132, cur:'USD', price:132, dayOpen:132, chg:0, about:'Airbnb - travel, USA.' },
      { id:'PYPL', name:'PayPal', sector:'Payments', market:'WRD', L:'P', color:'#0891b2', base:85, cur:'USD', price:85, dayOpen:85, chg:0, about:'PayPal - payments, USA.' },
      { id:'PLTR', name:'Palantir', sector:'Software', market:'WRD', L:'P', color:'#f97316', base:68, cur:'USD', price:68, dayOpen:68, chg:0, about:'Palantir - software, USA.' },
      { id:'SOFI', name:'SoFi', sector:'Finance', market:'WRD', L:'S', color:'#0ea5e9', base:14, cur:'USD', price:14, dayOpen:14, chg:0, about:'SoFi - finance, USA.' },
      { id:'BA', name:'Boeing', sector:'Industrial', market:'WRD', L:'B', color:'#16a34a', base:178, cur:'USD', price:178, dayOpen:178, chg:0, about:'Boeing - industrial, USA.' },
      { id:'KO', name:'Coca-Cola', sector:'Consumer', market:'WRD', L:'C', color:'#dc2626', base:63, cur:'USD', price:63, dayOpen:63, chg:0, about:'Coca-Cola - consumer, USA.' },
      { id:'HSBA', name:'HSBC Holdings', sector:'Banking', market:'WRD', L:'H', color:'#7c3aed', base:12, cur:'USD', price:12, dayOpen:12, chg:0, about:'HSBC - banking, UK.' },
      { id:'BP', name:'BP', sector:'Energy', market:'WRD', L:'B', color:'#0891b2', base:5.8, cur:'USD', price:5.8, dayOpen:5.8, chg:0, about:'BP - energy, UK.' },
      { id:'SHEL', name:'Shell', sector:'Energy', market:'WRD', L:'S', color:'#f97316', base:34, cur:'USD', price:34, dayOpen:34, chg:0, about:'Shell - energy, UK.' },
      { id:'AZN', name:'AstraZeneca', sector:'Health', market:'WRD', L:'A', color:'#0ea5e9', base:68, cur:'USD', price:68, dayOpen:68, chg:0, about:'AstraZeneca - health, UK.' },
      { id:'ULVR', name:'Unilever', sector:'Consumer', market:'WRD', L:'U', color:'#16a34a', base:47, cur:'USD', price:47, dayOpen:47, chg:0, about:'Unilever - consumer, UK.' },
      { id:'SAP', name:'SAP', sector:'Software', market:'WRD', L:'S', color:'#dc2626', base:285, cur:'USD', price:285, dayOpen:285, chg:0, about:'SAP - software, Germany.' },
      { id:'SIE', name:'Siemens', sector:'Industrial', market:'WRD', L:'S', color:'#7c3aed', base:210, cur:'USD', price:210, dayOpen:210, chg:0, about:'Siemens - industrial, Germany.' },
      { id:'VOW3', name:'Volkswagen', sector:'Autos', market:'WRD', L:'V', color:'#0891b2', base:92, cur:'USD', price:92, dayOpen:92, chg:0, about:'Volkswagen - autos, Germany.' },
      { id:'BMW', name:'BMW', sector:'Autos', market:'WRD', L:'B', color:'#f97316', base:78, cur:'USD', price:78, dayOpen:78, chg:0, about:'BMW - autos, Germany.' },
      { id:'DAI', name:'Daimler Truck', sector:'Autos', market:'WRD', L:'D', color:'#0ea5e9', base:165, cur:'USD', price:165, dayOpen:165, chg:0, about:'Daimler - autos, Germany.' },
      { id:'MC', name:'LVMH', sector:'Luxury', market:'WRD', L:'L', color:'#16a34a', base:480, cur:'USD', price:480, dayOpen:480, chg:0, about:'LVMH - luxury, France.' },
      { id:'OR', name:'Loreal', sector:'Luxury', market:'WRD', L:'L', color:'#dc2626', base:385, cur:'USD', price:385, dayOpen:385, chg:0, about:'Loreal - luxury, France.' },
      { id:'BNP', name:'BNP Paribas', sector:'Banking', market:'WRD', L:'B', color:'#7c3aed', base:62, cur:'USD', price:62, dayOpen:62, chg:0, about:'BNP - banking, France.' },
      { id:'SAN', name:'Santander', sector:'Banking', market:'WRD', L:'S', color:'#0891b2', base:4.8, cur:'USD', price:4.8, dayOpen:4.8, chg:0, about:'Santander - banking, Spain.' },
      { id:'IBE', name:'Iberdrola', sector:'Utilities', market:'WRD', L:'I', color:'#f97316', base:12, cur:'USD', price:12, dayOpen:12, chg:0, about:'Iberdrola - utilities, Spain.' },
      { id:'NESN', name:'Nestle', sector:'Consumer', market:'WRD', L:'N', color:'#0ea5e9', base:88, cur:'USD', price:88, dayOpen:88, chg:0, about:'Nestle - consumer, Switzerland.' },
      { id:'ROG', name:'Roche', sector:'Health', market:'WRD', L:'R', color:'#16a34a', base:245, cur:'USD', price:245, dayOpen:245, chg:0, about:'Roche - health, Switzerland.' },
      { id:'UBS', name:'UBS', sector:'Banking', market:'WRD', L:'U', color:'#dc2626', base:32, cur:'USD', price:32, dayOpen:32, chg:0, about:'UBS - banking, Switzerland.' },
      { id:'ASML', name:'ASML', sector:'Semiconductors', market:'WRD', L:'A', color:'#7c3aed', base:1050, cur:'USD', price:1050, dayOpen:1050, chg:0, about:'ASML - semiconductors, Netherlands.' },
      { id:'PHL', name:'Philips', sector:'Health', market:'WRD', L:'P', color:'#0891b2', base:320, cur:'USD', price:320, dayOpen:320, chg:0, about:'Philips - health, Netherlands.' },
      { id:'NOVO-B', name:'Novo Nordisk', sector:'Health', market:'WRD', L:'N', color:'#f97316', base:145, cur:'USD', price:145, dayOpen:145, chg:0, about:'Novo Nordisk - health, Denmark.' },
      { id:'7203', name:'Toyota Motor', sector:'Autos', market:'WRD', L:'T', color:'#0ea5e9', base:28, cur:'USD', price:28, dayOpen:28, chg:0, about:'Toyota - autos, Japan.' },
      { id:'6758', name:'Sony Group', sector:'Tech', market:'WRD', L:'S', color:'#16a34a', base:92, cur:'USD', price:92, dayOpen:92, chg:0, about:'Sony - tech, Japan.' },
      { id:'9984', name:'SoftBank Group', sector:'Tech', market:'WRD', L:'S', color:'#dc2626', base:78, cur:'USD', price:78, dayOpen:78, chg:0, about:'SoftBank - tech, Japan.' },
      { id:'8306', name:'MUFG', sector:'Banking', market:'WRD', L:'M', color:'#7c3aed', base:12, cur:'USD', price:12, dayOpen:12, chg:0, about:'MUFG - banking, Japan.' },
      { id:'6861', name:'Keyence', sector:'Industrial', market:'WRD', L:'K', color:'#0891b2', base:480, cur:'USD', price:480, dayOpen:480, chg:0, about:'Keyence - industrial, Japan.' },
      { id:'0700', name:'Tencent', sector:'Internet', market:'WRD', L:'T', color:'#f97316', base:52, cur:'USD', price:52, dayOpen:52, chg:0, about:'Tencent - internet, China.' },
      { id:'9988', name:'Alibaba', sector:'Internet', market:'WRD', L:'A', color:'#0ea5e9', base:118, cur:'USD', price:118, dayOpen:118, chg:0, about:'Alibaba - internet, China.' },
      { id:'3690', name:'Meituan', sector:'Internet', market:'WRD', L:'M', color:'#16a34a', base:18, cur:'USD', price:18, dayOpen:18, chg:0, about:'Meituan - internet, China.' },
      { id:'1810', name:'Xiaomi', sector:'Tech', market:'WRD', L:'X', color:'#dc2626', base:4.2, cur:'USD', price:4.2, dayOpen:4.2, chg:0, about:'Xiaomi - tech, China.' },
      { id:'RELIANCE', name:'Reliance Industries', sector:'Energy', market:'WRD', L:'R', color:'#7c3aed', base:34, cur:'USD', price:34, dayOpen:34, chg:0, about:'Reliance - energy, India.' },
      { id:'TCS', name:'TCS', sector:'Software', market:'WRD', L:'T', color:'#0891b2', base:41, cur:'USD', price:41, dayOpen:41, chg:0, about:'TCS - software, India.' },
      { id:'HDFCBANK', name:'HDFC Bank', sector:'Banking', market:'WRD', L:'H', color:'#f97316', base:19, cur:'USD', price:19, dayOpen:19, chg:0, about:'HDFC - banking, India.' },
      { id:'INFY', name:'Infosys', sector:'Software', market:'WRD', L:'I', color:'#0ea5e9', base:18, cur:'USD', price:18, dayOpen:18, chg:0, about:'Infosys - software, India.' },
      { id:'005930', name:'Samsung Electronics', sector:'Tech', market:'WRD', L:'S', color:'#16a34a', base:58, cur:'USD', price:58, dayOpen:58, chg:0, about:'Samsung - tech, South Korea.' },
      { id:'000660', name:'SK Hynix', sector:'Semiconductors', market:'WRD', L:'S', color:'#dc2626', base:130, cur:'USD', price:130, dayOpen:130, chg:0, about:'SK Hynix - semiconductors, South Korea.' },
      { id:'D01', name:'DBS Group', sector:'Banking', market:'WRD', L:'D', color:'#7c3aed', base:32, cur:'USD', price:32, dayOpen:32, chg:0, about:'DBS - banking, Singapore.' },
      { id:'O39', name:'OCBC', sector:'Banking', market:'WRD', L:'O', color:'#0891b2', base:11, cur:'USD', price:11, dayOpen:11, chg:0, about:'OCBC - banking, Singapore.' },
      { id:'PTT', name:'PTT PCL', sector:'Energy', market:'WRD', L:'P', color:'#f97316', base:0.85, cur:'USD', price:0.85, dayOpen:0.85, chg:0, about:'PTT - energy, Thailand.' },
      { id:'BBCA', name:'Bank Central Asia', sector:'Banking', market:'WRD', L:'B', color:'#0ea5e9', base:0.58, cur:'USD', price:0.58, dayOpen:0.58, chg:0, about:'BCA - banking, Indonesia.' },
      { id:'1155', name:'Maybank', sector:'Banking', market:'WRD', L:'M', color:'#16a34a', base:2.1, cur:'USD', price:2.1, dayOpen:2.1, chg:0, about:'Maybank - banking, Malaysia.' },
      { id:'VCB', name:'Vietcombank', sector:'Banking', market:'WRD', L:'V', color:'#dc2626', base:3.4, cur:'USD', price:3.4, dayOpen:3.4, chg:0, about:'Vietcombank - banking, Vietnam.' },
      { id:'2222', name:'Saudi Aramco', sector:'Energy', market:'WRD', L:'S', color:'#7c3aed', base:7.9, cur:'USD', price:7.9, dayOpen:7.9, chg:0, about:'Aramco - energy, Saudi Arabia.' },
      { id:'1120', name:'Al Rajhi Bank', sector:'Banking', market:'WRD', L:'A', color:'#0891b2', base:26, cur:'USD', price:26, dayOpen:26, chg:0, about:'Al Rajhi - banking, Saudi Arabia.' },
      { id:'EMAAR', name:'Emaar Properties', sector:'Real Estate', market:'WRD', L:'E', color:'#f97316', base:2.0, cur:'USD', price:2.0, dayOpen:2.0, chg:0, about:'Emaar - real estate, UAE.' },
      { id:'QNB', name:'Qatar National Bank', sector:'Banking', market:'WRD', L:'Q', color:'#0ea5e9', base:5.4, cur:'USD', price:5.4, dayOpen:5.4, chg:0, about:'QNB - banking, Qatar.' },
      { id:'SHOP', name:'Shopify', sector:'Tech', market:'WRD', L:'S', color:'#16a34a', base:95, cur:'USD', price:95, dayOpen:95, chg:0, about:'Shopify - tech, Canada.' },
      { id:'RY', name:'Royal Bank of Canada', sector:'Banking', market:'WRD', L:'R', color:'#dc2626', base:118, cur:'USD', price:118, dayOpen:118, chg:0, about:'RBC - banking, Canada.' },
      { id:'CNQ', name:'Canadian Natural Res', sector:'Energy', market:'WRD', L:'C', color:'#7c3aed', base:62, cur:'USD', price:62, dayOpen:62, chg:0, about:'CNQ - energy, Canada.' },
      { id:'VALE', name:'Vale', sector:'Mining', market:'WRD', L:'V', color:'#0891b2', base:12, cur:'USD', price:12, dayOpen:12, chg:0, about:'Vale - mining, Brazil.' },
      { id:'PETR', name:'Petrobras', sector:'Energy', market:'WRD', L:'P', color:'#f97316', base:3.6, cur:'USD', price:3.6, dayOpen:3.6, chg:0, about:'Petrobras - energy, Brazil.' },
      { id:'ITUB', name:'Itau Unibanco', sector:'Banking', market:'WRD', L:'I', color:'#0ea5e9', base:5.8, cur:'USD', price:5.8, dayOpen:5.8, chg:0, about:'Itau - banking, Brazil.' },
      { id:'AMX', name:'America Movil', sector:'Telecom', market:'WRD', L:'A', color:'#16a34a', base:8.9, cur:'USD', price:8.9, dayOpen:8.9, chg:0, about:'America Movil - telecom, Mexico.' },
      { id:'WALMEX', name:'Walmex', sector:'Retail', market:'WRD', L:'W', color:'#dc2626', base:3.2, cur:'USD', price:3.2, dayOpen:3.2, chg:0, about:'Walmex - retail, Mexico.' },
      { id:'BHP', name:'BHP Group', sector:'Mining', market:'WRD', L:'B', color:'#7c3aed', base:42, cur:'USD', price:42, dayOpen:42, chg:0, about:'BHP - mining, Australia.' },
      { id:'CBA', name:'Commonwealth Bank', sector:'Banking', market:'WRD', L:'C', color:'#0891b2', base:105, cur:'USD', price:105, dayOpen:105, chg:0, about:'CommBank - banking, Australia.' },
      { id:'CSL', name:'CSL', sector:'Health', market:'WRD', L:'C', color:'#f97316', base:62, cur:'USD', price:62, dayOpen:62, chg:0, about:'CSL - health, Australia.' },
      { id:'WES', name:'Wesfarmers', sector:'Retail', market:'WRD', L:'W', color:'#0ea5e9', base:48, cur:'USD', price:48, dayOpen:48, chg:0, about:'Wesfarmers - retail, Australia.' }
    ];
    var have = {};
    A.STOCKS.forEach(function(x){ have[x.id] = true; });
    add.forEach(function(s){ if (!have[s.id]) A.STOCKS.push(s); });
  })();
  A.Stocks = { curStock:null, curTF:'1D', stockTab:'All', seriesData:{}, liveTimer:null };

  A.Stocks.renderStockTabs = function(){
    var tabs = ['All','USE','Africa','New','US','World','ETFs'];
    var h = '';
    for (var i=0;i<tabs.length;i++){
      var active = A.Stocks.stockTab===tabs[i] ? ' active' : '';
      var label = tabs[i]==='USE' ? 'USE listed' : tabs[i]==='New' ? 'New listings' : tabs[i];
      h += '<div class="tab'+active+'" onclick="Ascendin.Stocks.setStockTab(\''+tabs[i]+'\')">'+label+'</div>';
    }
    A.$('stock-tabs').innerHTML = h;
  };
  A.Stocks.setStockTab = function(t){ A.Stocks.stockTab = t; A.Stocks.renderStockTabs(); A.Stocks.renderStocks(); };

  A.Stocks.renderStocks = function(){
    var q = (A.$('stock-search').value||'').toLowerCase();
    var h = '';
    for (var i=0;i<A.STOCKS.length;i++){
      var s = A.STOCKS[i];
      if (A.Stocks.stockTab==='USE' && s.market!=='USE') continue;
      if (A.Stocks.stockTab==='New' && s.market!=='NEW') continue;
      if (A.Stocks.stockTab==='US' && s.market!=='US') continue;
      if (A.Stocks.stockTab==='ETFs' && s.market!=='ETF') continue;
      if (A.Stocks.stockTab==='Africa' && s.market!=='AFR' && s.market!=='USE') continue;
      if (A.Stocks.stockTab==='World' && s.market!=='WRD') continue;
      if (q && s.name.toLowerCase().indexOf(q)<0 && s.id.toLowerCase().indexOf(q)<0) continue;
      h += '<div class="asset" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">'+
        '<div class="logo" style="background:'+s.color+'; color:'+(s.tc||'#fff')+'">'+A.logoHTML(s)+'</div>'+
        '<div style="flex:1"><div class="bold">'+s.name+'</div><div class="muted small">'+s.id+' - '+s.sector+'</div></div>'+
        '<div style="text-align:right"><div class="bold">'+(s.cur==='USD'?'$'+s.price.toFixed(2):'UGX '+A.fmt(s.price))+'</div>'+A.chgHTML(s.chg)+'</div></div>';
    }
        A.$('stock-list').innerHTML = h || '<div class="muted center" style="padding:30px">No stocks match your search.</div>';
        A.Stocks.renderHeatTicker();
  };
  
    function priceLabel(s, v){ return s.cur==='USD' ? '$'+v.toFixed(2) : 'UGX '+A.fmt(v); }
  A.Stocks.alerts = function(){ return A.state.alerts || (A.state.alerts = []); };
  A.Stocks.updateBell = function(){
    var el = A.$('sd-bell');
    if (!el || !A.Stocks.curStock) return;
    var has = A.Stocks.alerts().some(function(x){ return x.stock === A.Stocks.curStock.id; });
    el.classList.toggle('has-alert', has);
  };
  A.Stocks.openAlerts = function(){
    var s = A.Stocks.curStock;
    var list = A.Stocks.alerts().filter(function(x){ return x.stock === s.id; });
    var rows = '';
    for (var i=0;i<list.length;i++){
      rows += '<div class="statline"><span class="muted">When price ' + (list[i].dirAbove ? 'rises above' : 'falls below') + '</span><span class="bold">' + priceLabel(s, list[i].target) + '</span><span class="link small" style="margin-left:10px" onclick="Ascendin.Stocks.removeAlert(\'' + list[i].id + '\')">Remove</span></div>';
    }
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Price alerts - ' + s.name + '</div>' +
      '<div class="statline"><span class="muted">Current price</span><span class="bold">' + priceLabel(s, s.price) + '</span></div>' +
      (rows || '<div class="muted small" style="padding:8px 0">No alerts yet for this stock.</div>') +
      '<div class="muted small" style="margin-top:10px">Alert me when the price crosses</div>' +
      '<div class="field"><span class="pre">' + (s.cur==='USD' ? '$' : 'UGX') + '</span><input id="alert-target" type="number" inputmode="decimal" placeholder="0"></div>' +
      '<button class="btn blue" style="margin-top:12px" onclick="Ascendin.Stocks.addAlert()">SET ALERT</button>'
    );
  };
  A.Stocks.addAlert = function(){
    var s = A.Stocks.curStock;
    var t = parseFloat(A.$('alert-target').value) || 0;
    if (t <= 0){ A.toast('Enter a target price'); return; }
    A.Stocks.alerts().push({ id: 'al-' + Date.now(), stock: s.id, target: t, dirAbove: t > s.price });
    A.save(); A.closeAll(); A.Stocks.updateBell();
    A.toast('Alert set: ' + s.id + ' at ' + priceLabel(s, t));
  };
  A.Stocks.removeAlert = function(id){
    A.state.alerts = A.Stocks.alerts().filter(function(x){ return x.id !== id; });
    A.save(); A.Stocks.openAlerts(); A.Stocks.updateBell();
  };
  A.Stocks.checkAlerts = function(s, oldPrice){
    var arr = A.Stocks.alerts();
    var left = [];
    for (var i=0;i<arr.length;i++){
      var x = arr[i];
      if (x.stock !== s.id){ left.push(x); continue; }
      var crossed = (oldPrice < x.target && s.price >= x.target) || (oldPrice > x.target && s.price <= x.target);
      if (crossed){
        A.toast('Alert: ' + s.id + ' crossed ' + priceLabel(s, x.target));
        A.notify('Price alert triggered: ' + s.name + ' crossed ' + priceLabel(s, x.target));
      } else left.push(x);
    }
    if (left.length !== arr.length){ A.state.alerts = left; A.save(); A.Stocks.updateBell(); }
  };

  function genSeries(s, tf){
    var rnd = A.mulberry(A.hash(s.id + tf));
    var n = 90;
    var end = s.price, start = end/(1+s.chg/100);
    if (tf !== '1D'){ start = end*(1-(s.chg*3+rnd()*30-10)/100); }
    var vol = end*0.006*(tf==='1D'?1:2.2);
    var pts = [];
    for (var i=0;i<n;i++){
      var base = start+(end-start)*(i/(n-1));
      var noise = (rnd()-0.5)*2*vol*Math.sin(i*0.35+rnd()*6);
      pts.push(base+noise);
    }
    pts[n-1] = end;
    return pts;
  }

  A.Stocks.openStock = function(id){
    A.Stocks.curStock = A.getStock(id);
    var s = A.Stocks.curStock;
    if (s.dayOpen === undefined) s.dayOpen = s.price;
    A.Stocks.curTF = '1D';
    A.Stocks.seriesData = {};
    var tfs = ['1D','1W','1M','1Y','All'];
    for (var i=0;i<tfs.length;i++) A.Stocks.seriesData[tfs[i]] = genSeries(s, tfs[i]);
        A.Stocks.loadSeries(s, '1D');
    A.$('sd-title').textContent = s.id;
    A.$('sd-logo').style.background = s.color;
    A.$('sd-logo').style.color = s.tc || '#fff';
        A.$('sd-logo').innerHTML = A.logoHTML(s);
    A.$('sd-name').textContent = s.name;
    A.$('sd-ticker').textContent = s.id + ' - ' + s.sector;
      updateHeader();
    A.Stocks.updateBell();
    A.$('sd-about').textContent = s.about;
    A.Stocks.renderTF();
    A.Stocks.drawChart();
    A.go('stock-detail');
  };

  function updateHeader(){
    var s = A.Stocks.curStock;
    A.$('sd-price').textContent = s.cur==='USD' ? '$'+s.price.toFixed(2) : 'UGX '+A.fmt(s.price);
    var up = s.chg >= 0;
    var delta = s.price * s.chg / 100;
    A.$('sd-chg').innerHTML =
      '<span class="chg '+(up?'up':'down')+'" style="background:rgba(128,128,128,.15); padding:4px 8px; border-radius:6px">'+A.icon(up?'up':'down',14)+Math.abs(s.chg).toFixed(2)+'%</span>'+
      '<span class="'+(up?'up':'down')+'" style="font-weight:700">'+(up?'+':'-')+(s.cur==='USD'?'$'+Math.abs(delta).toFixed(2):'UGX '+A.fmt(Math.abs(delta)))+'</span><span class="muted">Today</span>';
  }

  A.Stocks.renderTF = function(){
    var tfs = ['1D','1W','1M','1Y','All'];
    var h = '';
    for (var i=0;i<tfs.length;i++){
      h += '<div class="tf '+(A.Stocks.curTF===tfs[i]?'active':'')+'" onclick="Ascendin.Stocks.setTF(\''+tfs[i]+'\')">'+tfs[i]+'</div>';
    }
    A.$('tf-pills').innerHTML = h;
  };
   A.Stocks.setTF = function(t){ A.Stocks.curTF = t; A.Stocks.renderTF(); A.Stocks.drawChart(); A.Stocks.loadSeries(A.Stocks.curStock, t); };

  A.Stocks.drawChart = function(){
    var cv = A.$('chart'); var ctx = cv.getContext('2d');
    var W = cv.width = cv.offsetWidth*2, H = cv.height = 440;
    ctx.clearRect(0,0,W,H);
    var pts = A.Stocks.seriesData[A.Stocks.curTF] || [];
    if (!pts.length) return;
    var mn = Math.min.apply(null,pts), mx = Math.max.apply(null,pts);
    var pad = (mx-mn)*0.12||1; mn-=pad; mx+=pad;
    var left = 10, right = W-150, top = 20, bot = H-60;
    function X(i){ return left+(right-left)*(i/(pts.length-1)); }
    function Y(v){ return top+(bot-top)*(1-(v-mn)/(mx-mn)); }
    var muted = getComputedStyle(document.documentElement).getPropertyValue('--muted');
    ctx.strokeStyle = 'rgba(128,128,128,.25)'; ctx.lineWidth=1; ctx.fillStyle = muted; ctx.font='22px sans-serif'; ctx.textAlign='left';
    for (var g=0; g<4; g++){
      var val = mx-(mx-mn)*(g/3); var y = Y(val);
      ctx.beginPath(); ctx.moveTo(left,y); ctx.lineTo(right,y); ctx.stroke();
      ctx.fillText(val>=1000?A.fmt(val):val.toFixed(2), right+16, y+8);
    }
    var down = pts[pts.length-1] < pts[0];
    ctx.strokeStyle = down ? '#E5544B' : '#3FCB6E'; ctx.lineWidth=4; ctx.lineJoin='round';
    ctx.beginPath();
    for (var p=0;p<pts.length;p++){ if(p===0) ctx.moveTo(X(p),Y(pts[p])); else ctx.lineTo(X(p),Y(pts[p])); }
    ctx.stroke();
    var labels = {'1D':['8:02 AM','Now'],'1W':['7 days ago','Now'],'1M':['30 days ago','Now'],'1Y':['1 year ago','Now'],'All':['Listed','Now']};
    ctx.fillStyle = muted; ctx.textAlign='left'; ctx.fillText(labels[A.Stocks.curTF][0], left, H-16);
    ctx.textAlign='right'; ctx.fillText(labels[A.Stocks.curTF][1], right, H-16);
  };

  /* ---------- live price engine ---------- */
  A.Stocks.startLive = function(){
    if (A.Stocks.liveTimer) return;
    A.Stocks.liveTimer = setInterval(function(){
      for (var i=0;i<A.STOCKS.length;i++){
        var s = A.STOCKS[i];
        if (s.dayOpen === undefined) s.dayOpen = s.price;
        var old = s.price;
        var drift = (Math.random()-0.5) * s.price * 0.004;
        s.price = Math.max(0.01, s.price + drift);
        s.chg = (s.price - s.dayOpen) / s.dayOpen * 100;
        A.Stocks.checkAlerts(s, old);
      }
      var cur = A.Stocks.curStock;
      if (cur){
        var arr = A.Stocks.seriesData['1D'];
        if (arr){ arr.push(cur.price); if (arr.length > 140) arr.shift(); }
        if (A.$('view-stock-detail').classList.contains('active')){
          updateHeader();
          if (A.Stocks.curTF === '1D') A.Stocks.drawChart();
        }
      }
      if (A.$('view-stocks').classList.contains('active')) A.Stocks.renderStocks();
            A.Stocks.renderHeatTicker();
    }, 2000);
  };
  A.Stocks.stopLive = function(){
    if (A.Stocks.liveTimer){ clearInterval(A.Stocks.liveTimer); A.Stocks.liveTimer = null; }
  };
     A.Stocks.renderHeatTicker = function(){
    var h = '';
    for (var r=0;r<2;r++){
      for (var i=0;i<A.STOCKS.length;i++){
        var s = A.STOCKS[i];
        var up = s.chg >= 0;
        var a = Math.min(1, 0.30 + Math.abs(s.chg) * 0.12);
        var bg = up ? 'rgba(38,132,84,'+a.toFixed(2)+')' : 'rgba(150,60,56,'+a.toFixed(2)+')';
        h += '<div class="hm-float" style="background:'+bg+'" onclick="Ascendin.Stocks.openStock(\''+s.id+'\')">'+
          '<span class="hf-sym">'+s.id+'</span>'+
          '<span class="hf-chg">'+(up?'+':'-')+Math.abs(s.chg).toFixed(2)+'%</span></div>';
      }
    }
    var t1 = A.$('heat-ticker-home'); if (t1) t1.innerHTML = h;
    var t2 = A.$('heat-ticker-stocks'); if (t2) t2.innerHTML = h;
  };

  A.Stocks.loadSeries = function(s, tf){
    if (s.cur !== 'USD') return;
    fetch('/api/market/stocks/' + s.id + '/history?tf=' + tf).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
      if (j && j.series && j.series.length > 1){
        A.Stocks.seriesData[tf] = j.series;
        if (A.Stocks.curStock && A.Stocks.curStock.id === s.id && A.Stocks.curTF === tf) A.Stocks.drawChart();
      }
    }).catch(function(){});
  };
  A.Stocks.refreshMarket = function(){
    fetch('/api/market/stocks').then(function(r){ return r.ok ? r.json() : null; }).then(function(list){
      if (!list) return;
      for (var i=0;i<list.length;i++){
        var q = list[i]; var s = A.getStock(q.id);
        if (s && q.price){ s.price = q.price; s.chg = q.chg; s.dayOpen = s.price / (1 + s.chg/100); s.live = !!q.live; }
      }
      A.Stocks.renderStocks();
      A.Stocks.renderHeatTicker();
      if (A.Stocks.curStock) updateHeader();
    }).catch(function(){});
  };

    A.Stocks.renderHeatmap = function(){
    var h = '';
    for (var i=0;i<A.STOCKS.length;i++){
      var s = A.STOCKS[i];
      var up = s.chg >= 0;
      var alpha = Math.min(0.85, 0.18 + Math.abs(s.chg) * 0.10);
      var bg = up ? 'rgba(63,203,110,' + alpha.toFixed(2) + ')' : 'rgba(229,84,75,' + alpha.toFixed(2) + ')';
      h += '<div class="hm-tile" style="background:' + bg + '" onclick="Ascendin.Stocks.openStock(\'' + s.id + '\')">' +
        '<div class="hm-sym">' + s.id + '</div>' +
        '<div class="hm-chg">' + (up ? '+' : '-') + Math.abs(s.chg).toFixed(2) + '%</div></div>';
    }
    A.$('heatmap').innerHTML = h;
  };

  /* ---------- buy ---------- */
  A.Stocks.openBuy = function(){
    var s = A.Stocks.curStock;
    A.openSheet(
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px"><div style="font-size:18px; font-weight:800">Buy '+s.name+'</div><button class="iconbtn" onclick="Ascendin.closeAll()">'+A.icon('x',18)+'</button></div>'+
      '<div class="statline"><span class="muted">Current price</span><span class="bold">'+(s.cur==='USD'?'$'+s.price.toFixed(2):'UGX '+A.fmt(s.price))+'</span></div>'+
      '<div class="statline"><span class="muted">Wallet balance</span><span class="bold">'+A.ugx(A.state.balance)+'</span></div>'+
      '<div class="muted small" style="margin-top:10px">Amount to invest (UGX)</div>'+
      '<div class="field"><span class="pre">UGX</span><input id="buy-amt" type="number" inputmode="numeric" placeholder="100000" oninput="Ascendin.Stocks.updateBuy()"></div>'+
      '<div class="statline"><span class="muted">You receive</span><span class="bold" id="buy-qty">0 units</span></div>'+
      '<div class="muted small" style="margin-top:10px">How long will you leave it in the trade?</div>'+
      '<input type="range" id="buy-months" min="1" max="24" value="1" class="term-slider" oninput="Ascendin.Stocks.updateBuy()">'+
      '<div class="term-labels"><span>1 mo</span><span id="buy-months-label">1 month</span><span>24 mo</span></div>'+
      '<div class="statline"><span class="muted">Commission</span><span class="up bold">Free</span></div>'+
      '<div class="boost-box"><div class="boost-top"><span class="boost-tag">LAUNCH BOOST</span><span class="muted small" id="buy-boost-timer"></span></div><div class="boost-line">Invest <b id="buy-boost-amt">UGX 0</b> - guaranteed <b id="buy-boost-pct">0%</b> over your period: <b class="up" id="buy-boost-win">+UGX 0</b></div></div>'+
      '<div class="muted small" style="margin:8px 0 14px">Fractional buying is on: own a piece of '+s.name+' from UGX 500.</div>'+
      '<button class="btn blue" onclick="Ascendin.Stocks.confirmBuy()">CONFIRM BUY</button>'
    );
  };
  A.Stocks.updateBuy = function(){
    var a = parseFloat(A.$('buy-amt').value)||0;
    var q = a/A.priceUGX(A.Stocks.curStock);
    A.$('buy-qty').textContent = q.toFixed(4)+' units (approx '+A.ugx(a)+')';
    var bp = A.Boost.pctFor(a);
    var mo = parseInt(A.$('buy-months').value,10)||1;
    var ml = A.$('buy-months-label'); if (ml) ml.textContent = mo + (mo===1?' month':' months');
    var sl = A.$('buy-months'); if (sl) sl.style.background = 'linear-gradient(90deg, var(--blue) '+(((mo-1)/23)*100)+'%, rgba(255,255,255,.08) '+(((mo-1)/23)*100)+'%)';
    var ba = A.$('buy-boost-amt'); if (ba){ ba.textContent = A.ugx(a); A.$('buy-boost-pct').textContent = bp+'% / mo'; A.$('buy-boost-win').textContent = '+'+A.ugx(a*bp/100*mo); A.$('buy-boost-timer').textContent = A.Boost.timerText(); }
  };
  A.Stocks.confirmBuy = function(){
    var a = parseFloat(A.$('buy-amt').value)||0;
    if (a<500){ A.toast('Minimum buy is UGX 500'); return; }
    if (a>A.state.balance){ A.toast('Insufficient balance. Deposit first.'); return; }
    var s = A.Stocks.curStock;
    var q = a/A.priceUGX(s);
    var h = A.state.holdings[s.id] || {qty:0, cost:0};
    h.qty += q; h.cost += a;
    A.state.holdings[s.id] = h;
    A.state.balance -= a;
    A.addTx('Buy '+s.id, -a, q.toFixed(4)+' units');
    A.Boost.add(a, parseInt(A.$('buy-months').value,10)||1);
    A.notify('You bought '+q.toFixed(4)+' units of '+s.name);
    A.save(); A.closeAll();
    A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px; font-weight:800; margin:8px 0">Order complete</div><div class="center" style="color:#aaa; font-size:14px">You now own '+h.qty.toFixed(4)+' units of '+s.name+'. New balance '+A.ugx(A.state.balance)+'</div><button class="btn blue" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'investments\')">VIEW MY INVESTMENTS</button>');
  };

  /* ---------- sell + actions ---------- */
  A.Stocks.openMoreActions = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    var has = h && h.qty > 0;
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:14px">'+s.name+' actions</div>'+
      '<div class="menu">'+
      '<div class="item" onclick="Ascendin.closeAll(); Ascendin.Stocks.openSell()">'+A.icon('swap')+'Sell on market'+(has?' ('+h.qty.toFixed(4)+' held)':' (none held)')+'</div>'+
      '<div class="item" onclick="Ascendin.closeAll(); Ascendin.openLearn(\'stocks\')">'+A.icon('help')+'How this stock works</div>'+
      '</div>'
    );
  };
  A.Stocks.openSell = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    if (!h || h.qty<=0){ A.toast('You do not hold any '+s.id+' yet. Buy some first.'); return; }
    A.openSheet(
      '<div style="font-size:18px; font-weight:800; margin-bottom:10px">Sell '+s.name+'</div>'+
      '<div class="statline"><span class="muted">You hold</span><span class="bold">'+h.qty.toFixed(4)+' units</span></div>'+
      '<div class="muted small" style="margin-top:8px">Units to sell</div>'+
      '<div class="field"><span class="pre">QTY</span><input id="sell-qty" type="number" inputmode="decimal" placeholder="0.01" oninput="Ascendin.Stocks.updateSell()"></div>'+
      '<div class="statline"><span class="muted">You receive</span><span class="bold" id="sell-get">UGX 0</span></div>'+
      '<button class="btn green" style="margin-top:12px" onclick="Ascendin.Stocks.confirmSell()">CONFIRM SELL</button>'
    );
  };
  A.Stocks.updateSell = function(){
    var q = parseFloat(A.$('sell-qty').value)||0;
    A.$('sell-get').textContent = A.ugx(q*A.priceUGX(A.Stocks.curStock));
  };
  A.Stocks.confirmSell = function(){
    var s = A.Stocks.curStock;
    var h = A.state.holdings[s.id];
    var q = parseFloat(A.$('sell-qty').value)||0;
    if (q<=0 || q>h.qty){ A.toast('Enter a valid quantity up to '+h.qty.toFixed(4)); return; }
    var val = q*A.priceUGX(s);
    h.qty -= q; h.cost = Math.max(0, h.cost - val*0.9);
    A.state.balance += val;
    A.addTx('Sell '+s.id, val, q.toFixed(4)+' units');
    A.save(); A.closeAll();
    A.toast('Sold. '+A.ugx(val)+' added to your wallet');
    A.Account.render();
  };
})();