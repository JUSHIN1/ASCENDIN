/* =========================================================
   Ascendin data layer - all catalogues in one place.
   ========================================================= */
(function(){
  window.Ascendin = window.Ascendin || {};

  Ascendin.RATE = 3700; // USD to UGX

  Ascendin.STOCKS = [
    {id:'MTNU', name:'MTN Uganda', sector:'Telecom', market:'USE', cur:'UGX', price:195, chg:0.8, color:'#ffcc08', L:'M', tc:'#111', about:'MTN Uganda is the country\'s largest telecom operator, providing mobile voice, data and mobile money services across Uganda. It listed on the Uganda Securities Exchange in 2021 as part of a local ownership requirement.'},
    {id:'UMEME', name:'Umeme Ltd', sector:'Utilities', market:'USE', cur:'UGX', price:267, chg:1.4, color:'#f97316', L:'U', about:'Umeme is Uganda\'s main electricity distribution company, delivering power to homes and businesses under a concession with the national grid operator.'},
    {id:'SBU', name:'Stanbic Bank Uganda', sector:'Banking', market:'USE', cur:'UGX', price:42, chg:0.5, color:'#0057a3', L:'S', about:'Stanbic Bank Uganda is one of the country\'s largest commercial banks, part of the pan-African Standard Bank Group, offering retail and corporate banking.'},
    {id:'DFCU', name:'dfcu Bank', sector:'Banking', market:'USE', cur:'UGX', price:210, chg:-0.6, color:'#0ea5e9', L:'D', about:'dfcu Bank is a Ugandan commercial bank known for its lending to small and medium enterprises alongside standard retail banking services.'},
    {id:'BATU', name:'British American Tobacco Uganda', sector:'Consumer Goods', market:'USE', cur:'UGX', price:8200, chg:0.2, color:'#c0392b', L:'B', about:'British American Tobacco Uganda grows, processes and sells tobacco products, and is one of the longest-listed companies on the Uganda Securities Exchange.'},
    {id:'NIC', name:'National Insurance Corporation', sector:'Insurance', market:'USE', cur:'UGX', price:20, chg:1.0, color:'#16a34a', L:'N', about:'National Insurance Corporation is a Ugandan insurer offering life, health and general insurance products to individuals and businesses.'},
    {id:'UCL', name:'Uganda Clays', sector:'Industrial', market:'USE', cur:'UGX', price:20, chg:-0.5, color:'#b45309', L:'C', about:'Uganda Clays manufactures burnt clay building products such as roofing tiles and bricks, supplying the East African construction industry.'},
    {id:'EQTY', name:'Equity Group Holdings', sector:'Banking, cross-listed', market:'USE', cur:'UGX', price:1650, chg:0.9, color:'#dc2626', L:'E', about:'Equity Group is a Kenyan financial services group cross-listed on the Uganda Securities Exchange, serving millions of retail customers across East Africa.'},
    {id:'PLRX', name:'Pearl Motors', sector:'Mobility, new listing', market:'NEW', cur:'UGX', price:640, chg:4.2, color:'#7c3aed', L:'P', about:'Pearl Motors assembles electric motorcycles for the East African market. This is a fictional company created for this app to show how a new listing works.'},
    {id:'KLAT', name:'Kampala AgriTech', sector:'Agriculture, new listing', market:'NEW', cur:'UGX', price:118, chg:2.8, color:'#22c55e', L:'K', about:'Kampala AgriTech builds software and cold-storage tools for smallholder farmers. This is a fictional company created for this app to show how a new listing works.'},
    {id:'NBSE', name:'Nile Solar Energy', sector:'Renewable Energy, new listing', market:'NEW', cur:'UGX', price:355, chg:3.1, color:'#f59e0b', L:'S', about:'Nile Solar Energy develops solar mini-grids for off-grid communities. This is a fictional company created for this app to show how a new listing works.'},
    {id:'RVLC', name:'Rift Valley Logistics', sector:'Logistics, new listing', market:'NEW', cur:'UGX', price:92, chg:-1.2, color:'#0891b2', L:'R', about:'Rift Valley Logistics runs a regional trucking and freight network. This is a fictional company created for this app to show how a new listing works.'},
    {id:'HUT', name:'Hut 8 Corp', sector:'Bitcoin Mining & AI Infrastructure, US', market:'US', cur:'USD', price:76.98, chg:-0.77, color:'#111111', L:'H', tc:'#A3C132', about:'Hut 8 Corp is a North American digital infrastructure company listed on the Nasdaq under the ticker HUT. It began as one of the continent\'s largest Bitcoin miners and now also builds and operates high-performance computing data centers for AI workloads, including a Louisiana AI campus lease worth about $7 billion.'},
    {id:'TSLA', name:'Tesla', sector:'Auto, US', market:'US', cur:'USD', price:355.82, chg:-2.85, color:'#E8212D', L:'T', about:'Tesla Inc. designs, develops, manufactures, and sells electric vehicles, energy storage systems and related services.'},
    {id:'NVDA', name:'NVIDIA', sector:'Semiconductors, US', market:'US', cur:'USD', price:217.27, chg:-1.35, color:'#1A1A1A', L:'NV', about:'NVIDIA Corp. is a technology company known for producing consumer and enterprise GPUs and is now a leader in AI computing.'},
    {id:'GOOGL', name:'Alphabet', sector:'Internet, US', market:'US', cur:'USD', price:337.13, chg:-0.92, color:'#FFFFFF', L:'G', tc:'#4285F4', about:'Alphabet Inc. is the parent company of Google, covering search, advertising, Android, YouTube and Google Cloud.'},
    {id:'AMZN', name:'Amazon', sector:'E-commerce, US', market:'US', cur:'USD', price:254.00, chg:-2.35, color:'#FF9900', L:'A', about:'Amazon.com Inc. is a global e-commerce and cloud computing company, operator of AWS.'},
    {id:'AAPL', name:'Apple', sector:'Technology, US', market:'US', cur:'USD', price:325.11, chg:2.46, color:'#111111', L:'A', about:'Apple Inc. designs and sells iPhone, Mac, wearables and a fast-growing services business.'},
    {id:'MSFT', name:'Microsoft', sector:'Software, US', market:'US', cur:'USD', price:428.10, chg:0.80, color:'#00A4EF', L:'M', about:'Microsoft Corp. makes Windows, Office 365, Azure cloud and AI infrastructure.'},
    {id:'META', name:'Meta', sector:'Social, US', market:'US', cur:'USD', price:504.30, chg:1.10, color:'#0668E1', L:'M', about:'Meta Platforms owns Facebook, Instagram, WhatsApp and invests heavily in AI and VR.'},
    {id:'COIN', name:'Coinbase', sector:'Crypto, US', market:'US', cur:'USD', price:177.08, chg:-5.15, color:'#0052FF', L:'C', about:'Coinbase Global operates one of the largest cryptocurrency exchange platforms.'},
    {id:'SPY', name:'S&P 500 ETF', sector:'Index fund', market:'ETF', cur:'USD', price:543.20, chg:-0.62, color:'#B0272E', L:'SP', about:'Tracks the 500 largest US companies. One purchase gives you instant diversification across the whole US market.'},
    {id:'QQQ', name:'Nasdaq 100 ETF', sector:'Index fund', market:'ETF', cur:'USD', price:468.90, chg:-0.80, color:'#00A5E3', L:'Q', about:'Tracks the 100 largest non-financial companies on Nasdaq, heavy in technology.'}
  
    { id:'SAFCOM', name:'Safaricom PLC', sector:'Telecom', market:'AFR', L:'S', color:'#f97316', base:2500, cur:'UGX', about:'Safaricom is a Kenyan telecom company, tradable on Ascendin as a fractional share.' },
    { id:'DANGCEM', name:'Dangote Cement', sector:'Industrial', market:'AFR', L:'D', color:'#0891b6', base:45000, cur:'UGX', about:'Dangote Cement is a Nigerian industrial company, tradable on Ascendin as a fractional share.' },
    { id:'JPM', name:'JPMorgan Chase', sector:'Banking', market:'WRD', L:'J', color:'#16a34a', base:245, cur:'USD', about:'JPMorgan Chase is a US banking company, tradable on Ascendin as a fractional share.' },
    { id:'V', name:'Visa', sector:'Payments', market:'WRD', L:'V', color:'#dc2626', base:310, cur:'USD', about:'Visa is a US payments company, tradable on Ascendin as a fractional share.' },
    { id:'MA', name:'Mastercard', sector:'Payments', market:'WRD', L:'M', color:'#7c3aed', base:520, cur:'USD', about:'Mastercard is a US payments company, tradable on Ascendin as a fractional share.' },];

  Ascendin.BONDS = [
    {id:'gob-2y', name:'Uganda 2-Year Treasury Bond', issuer:'Government of Uganda', type:'Government Bond', rate:16.0, months:24, min:50000, risk:'Low', about:'A 2-year bond issued by the Government of Uganda through Bank of Uganda auctions. Government bonds are generally considered the lowest-risk fixed income option since they are backed by the state.'},
    {id:'gob-91', name:'Uganda 91-Day Treasury Bill', issuer:'Government of Uganda', type:'Treasury Bill', rate:12.5, months:3, min:20000, risk:'Low', about:'A short-term government security that matures in 91 days. Treasury bills are sold at a discount and pay the full face value at maturity, making them a common short-term option for idle cash.'},
    {id:'pearl-infra', name:'Pearl Infrastructure Bond', issuer:'Pearl Infrastructure Ltd, new issuer', type:'Corporate Bond', rate:600, months:36, min:100000, risk:'Medium', about:'A corporate bond funding toll-road and bridge projects. Pearl Infrastructure Ltd is a fictional issuer created for this app. Corporate bonds usually pay more than government bonds to compensate for higher risk.'},
    {id:'nile-green', name:'Nile Energy Green Bond', issuer:'Nile Energy Holdings, new issuer', type:'Corporate Bond', rate:2400, months:30, min:10000, risk:'Medium', about:'A bond funding solar and hydro projects along the Nile basin. Nile Energy Holdings is a fictional issuer created for this app to illustrate a green energy bond.'},
    {id:'kla-muni', name:'Kampala Municipal Bond', issuer:'Kampala Capital City Authority, illustrative', type:'Municipal Bond', rate:780, months:18, min:200000, risk:'Low-Medium', about:'A municipal bond structured to fund city road and drainage works. This listing is illustrative, created to show how a municipal bond product could work on Ascendin.'},
    {id:'asc-mmf', name:'Ascendin Money Market Fund', issuer:'Ascendin, flexible product', type:'Money Market Fund', rate:11.4, months:0, min:5000, risk:'Low', about:'Earns interest daily and lets you withdraw any time. The best place to park idle wallet money instead of leaving it sitting.'}
  ];

  Ascendin.NEWS = [
    {tag:'Guide', title:'Why first-time investors are starting with treasury bonds', teaser:'Fixed returns and government backing make bonds a common first step before buying individual stocks.', time:'2h ago', c:'#f5a623'},
    {tag:'MTNU', title:'MTN Uganda holds steady after early-week dip', teaser:'Trading desks are watching support levels after a choppy start to the week.', time:'4h ago', c:'#ffcc08'},
    {tag:'Guide', title:'Stocks vs bonds: what actually fits your goals', teaser:'A short breakdown of risk, return and time horizon for new Ascendin users.', time:'1d ago', c:'#2AABEE'},
    {tag:'UMEME', title:'Umeme sees higher trading volume this week', teaser:'Activity on the counter has picked up as more retail investors join the exchange.', time:'1d ago', c:'#f97316'},
    {tag:'Ascendin', title:'Four new listings join the exchange this quarter', teaser:'Solar, logistics and agri-tech companies open the market to new kinds of investors.', time:'2d ago', c:'#3E9B1F'}
  ];

  Ascendin.LEADERBOARD = [
    {name:'Immaculate N.', gain:18.4, holding:'MTNU'},
    {name:'Brian K.', gain:14.9, holding:'PLRX'},
    {name:'Patience A.', gain:12.1, holding:'Bonds'},
    {name:'David O.', gain:9.7, holding:'UMEME'},
    {name:'Grace M.', gain:8.3, holding:'NBSE'}
  ];

  Ascendin.ACTIVITY = [
    'Grace M. bought MTNU worth UGX 150,000',
    'Immaculate N. invested UGX 300,000 in the 2-Year Treasury Bond',
    'Ronald T. bought 60 units of KLAT',
    'Brian K. sold 40 units of UMEME at a gain',
    'Patience A. earned UGX 84,000 coupon interest'
  ];

  Ascendin.LEARN = {
    stocks:'A stock is a small piece of ownership in a company. If the company grows and its share price rises, your stock is worth more. Some companies also pay dividends, a share of profits paid to owners. You buy low, sell higher, and earn the difference. Prices move every day based on supply and demand.',
    fractional:'Shares like MTN Uganda or Tesla cost a lot per unit. Fractional buying means Ascendin pools the price so you can own a piece of a share from as little as UGX 500. Your fraction earns the same percentage gains and dividends as a full share.',
    bonds:'A bond is a loan you give to a government or company. They pay you interest (coupon) on a schedule and return your money at maturity. Safer than stocks, with fixed predictable returns.',
    fees:'Deposits are free. Withdrawals carry a small fee that goes to the telco: MTN MoMo 1.5%, Airtel Money 1.0%. Buying and selling stocks on Ascendin is commission-free during launch.'
  };

  Ascendin.PHONES = { MTN:'+256 772 123 456', AIRTEL:'+256 751 633 031' };
})();