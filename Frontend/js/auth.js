/* Ascendin authentication: Sign Up / Sign In pages + reliable handoff to Home. */
(function(){
  var A=window.Ascendin;
  function $(id){ return document.getElementById(id); }
  function hash(s){var h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0;}return 'h'+(h>>>0);}
  function strong(pw){ return pw.length>=8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw); }
  function ageOf(dob){ var d=new Date(dob); if(isNaN(d))return -1; var t=new Date(); var a=t.getFullYear()-d.getFullYear(); var m=t.getMonth()-d.getMonth(); if(m<0||(m===0&&t.getDate()<d.getDate()))a--; return a; }
  function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  var proceed=A.AuthSubmit;
  var mode=(localStorage.getItem('asc_cred_index')!==null)?'login':'signup';

  var TC=[
   ['1. Definitions','"Ascendin", "the Platform", "we/us/our" refer to the Ascendin application and operator. "You/User" refers to any registered individual. "Account" means your Ascendin wallet and investment profile. "Mobile Money" means MTN Mobile Money and Airtel Money in Uganda.'],
   ['2. Platform Status','Ascendin is presently a demonstration platform. Prices, balances, yields and counterparties shown are simulated for illustration and do not constitute real securities, real client money or a regulated investment business unless we notify you otherwise in writing.'],
   ['3. Eligibility & Age','You must be at least 18 years old and legally capable of entering binding contracts to open an Account. By registering you warrant you are 18 or older. We may request proof of age and may close any Account held by a minor.'],
   ['4. Account Registration','You must provide a valid Ugandan mobile money number, a valid email address and a password meeting our strength rules. Keep all information accurate. One person may hold one Account. We may refuse or reverse registration where information is false or duplicated.'],
   ['5. Credentials & Security','You are responsible for keeping your password and mobile money PIN confidential. Passwords are stored on your device as a one-way hash, never in plain text. Notify us immediately of suspected unauthorised use.'],
   ['6. Wallet, Deposits & Withdrawals','Your wallet is linked to your mobile money number. Deposits are initiated by mobile money prompt or USDT transfer to a designated reserve address. Withdrawals go to your registered number or wallet address. Telco and network fees may apply and are disclosed before confirmation.'],
   ['7. Stocks & Fractional Shares','Stocks are offered as fractional units for illustration. Simulated prices move continuously and are not exchange quotes. Trades execute at the displayed simulated price.'],
   ['8. Bonds & Fixed Income','Bond products display an indicative annual rate, tenor and minimum. The calculator projects interest for convenience only and is not a guarantee of return.'],
   ['9. Peer-to-Peer Trading','P2P lets you offer holdings to other Users via one-time codes. Units are held in escrow until the buyer redeems. You are responsible for the price you set and for sharing codes only with intended buyers.'],
   ['10. Crypto (USDT) Transfers','USDT deposits and withdrawals run on selected networks (TRC20/BEP20). Credits occur after network confirmation and reserve verification. Sending on an unsupported network or to a wrong address may cause irreversible loss.'],
   ['11. Fees & Charges','Mobile money deposits are free. Withdrawal fees, where applicable, are shown before confirmation. We may introduce or change fees with prior notice; continued use constitutes acceptance.'],
   ['12. Promotions & Boosts','Launch boosts and promotional yields are discretionary, time-limited and may be varied or withdrawn at our sole discretion.'],
   ['13. Risk Warning','All investing carries risk, including loss of capital. Simulated or projected returns are not promises. Past performance does not indicate future results.'],
   ['14. No Investment Advice','Nothing on the Platform constitutes investment, legal, tax or accounting advice, nor an offer to buy or sell any real security.'],
   ['15. Privacy & Data Protection','We collect only what is needed: mobile number, email, date of birth, device-stored credential hash and transaction history. We handle personal data in line with the Uganda Data Protection and Privacy Act, 2019. We do not sell your data.'],
   ['16. AML & CFT','You must not use the Platform for money laundering, terrorism financing, fraud or any unlawful purpose. We may perform KYC checks and report suspicious activity to competent authorities.'],
   ['17. Prohibited Conduct','You must not misrepresent identity, use another person\'s number or email, manipulate feeds, reverse-engineer or disrupt the Platform, or create multiple Accounts by automated means.'],
   ['18. Intellectual Property','The Ascendin name, logo, interface and code are our property. You receive a limited, personal, non-transferable licence to use the app.'],
   ['19. Availability','We strive for reliability but do not warrant uninterrupted service. We may suspend access for maintenance, security or legal reasons.'],
   ['20. Limitation of Liability','To the maximum extent permitted by law, we are not liable for indirect or consequential losses, nor losses from simulated values, telco outages or your breach of these Terms.'],
   ['21. Indemnity','You agree to indemnify us against claims and losses arising from your misuse of the Platform or breach of these Terms.'],
   ['22. Suspension & Termination','We may suspend or terminate an Account for breach, fraud, legal requirement or inactivity. You may close your Account after withdrawing your balance.'],
   ['23. Changes to Terms','We may update these Terms; material changes will be highlighted in the app. Continued use means acceptance.'],
   ['24. Governing Law','These Terms are governed by the laws of Uganda. Disputes fall to the courts of competent jurisdiction in Kampala.'],
   ['25. Severability','If any clause is unenforceable, the remainder continues in force.'],
   ['26. Contact','Questions about these Terms or your Account can be raised through the in-app Help Center.']
  ];
  function tcHTML(){ var h=''; for(var i=0;i<TC.length;i++){ h+='<div style="margin-bottom:12px"><div style="font-size:13px;font-weight:800;margin-bottom:4px">'+TC[i][0]+'</div><div style="font-size:12.5px;line-height:1.6;color:var(--muted)">'+TC[i][1]+'</div></div>'; } return h; }
  A.openTC=function(){ A.openSheet('<div style="text-align:left"><div style="font-size:18px;font-weight:800;margin-bottom:8px">Terms & Conditions</div><div style="max-height:62vh;overflow:auto;padding-right:4px">'+tcHTML()+'</div><button class="btn outline" style="margin-top:12px;width:100%" onclick="Ascendin.closeAll()">CLOSE</button></div>'); };

  function head(title,sub){
    return '<div style="text-align:center;margin-bottom:18px">'+
      '<div style="font-size:34px;line-height:1;margin-bottom:10px;color:#d9b497;font-weight:800">A</div>'+
      '<div style="font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:22px;letter-spacing:2px">ASCENDIN</div>'+
      '<div style="font-size:10px;letter-spacing:1.6px;color:var(--muted);margin-top:2px">INVEST TODAY. GROW TOMORROW.</div>'+
      '<div style="font-size:19px;font-weight:700;margin-top:18px">'+title+'</div>'+
      '<div style="font-size:12.5px;color:var(--muted);line-height:1.5;margin-top:6px">'+sub+'</div></div>';
  }
  function field(label,input){ return '<div style="margin-bottom:10px"><div style="font-size:11.5px;color:var(--muted);margin-bottom:4px">'+label+'</div>'+input+'</div>'; }
  function pwToggle(id){ return '<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--muted);cursor:pointer" onclick="Ascendin.AuthUI.togglePw(\''+id+'\')">SHOW</span>'; }

  function signupScreen(){
    return '<div style="max-width:430px;margin:0 auto;padding:26px 20px 40px">'+
      head('Create your account','Join Ascendin with your mobile number, email and a strong password. You will go straight to your dashboard.')+
      field('Mobile number (MTN / Airtel)','<div class="field"><span class="pre">+256</span><input id="au-phone" type="tel" inputmode="numeric" placeholder="7XXXXXXXX"></div>')+
      field('Email address','<div class="field"><input id="au-email" type="email" placeholder="you@example.com"></div>')+
      field('Password','<div class="field" style="position:relative"><input id="au-pw" type="password" placeholder="8+ chars, upper, lower, number, symbol">'+pwToggle('au-pw')+'</div>')+
      field('Confirm password','<div class="field" style="position:relative"><input id="au-pw2" type="password" placeholder="Re-enter password">'+pwToggle('au-pw2')+'</div>')+
      field('Date of birth (18+ only)','<div class="field"><input id="au-dob" type="date"></div>')+
      '<label style="display:flex;gap:8px;align-items:flex-start;margin:6px 0 4px;font-size:12.5px;text-align:left"><input type="checkbox" id="au-tc" style="margin-top:2px"><span>I am 18+ and I have read and agree to the <span class="link" onclick="Ascendin.openTC()">Terms & Conditions</span></span></label>'+
      '<input type="hidden" id="auth-phone" value="">'+
      '<div class="small down" id="auth-err2" style="min-height:16px;margin-top:4px"></div>'+
      '<button class="btn green" style="width:100%;margin-top:8px" onclick="Ascendin.AuthUI.submit()">CREATE ACCOUNT</button>'+
      '<div style="text-align:center;font-size:12.5px;color:var(--muted);margin-top:16px">Already have an account? <span class="link" onclick="Ascendin.AuthUI.show(\'login\')">Sign in</span></div>'+
    '</div>';
  }
  function signinScreen(){
    return '<div style="max-width:430px;margin:0 auto;padding:26px 20px 40px">'+
      head('Welcome back','Sign in with your mobile number and password to reach your wallet, stocks and bonds.')+
      field('Mobile number','<div class="field"><span class="pre">+256</span><input id="au-phone" type="tel" inputmode="numeric" placeholder="7XXXXXXXX"></div>')+
      field('Password','<div class="field" style="position:relative"><input id="au-pw" type="password" placeholder="Your password">'+pwToggle('au-pw')+'</div>')+
      '<input type="hidden" id="auth-phone" value="">'+
      '<div class="small down" id="auth-err2" style="min-height:16px;margin-top:4px"></div>'+
      '<button class="btn green" style="width:100%;margin-top:8px" onclick="Ascendin.AuthUI.submit()">SIGN IN</button>'+
      '<div style="text-align:center;font-size:12.5px;color:var(--muted);margin-top:16px">New to Ascendin? <span class="link" onclick="Ascendin.AuthUI.show(\'signup\')">Create an account</span></div>'+
    '</div>';
  }
  function mount(force){
    var wrap=document.querySelector('#view-auth .auth-wrap');
    if(!wrap) return;
    if(!force && $('au-phone')) return;
    wrap.innerHTML=(mode==='signup'?signupScreen():signinScreen());
  }

  /* The handoff: original submit first; if Home is not live in 500ms,
     reload into the app's own boot path which restores the session. */
  function handoff(phone){
    var hp=$('auth-phone'); if(hp) hp.value=phone;
    localStorage.setItem('ascendin-session', phone);
    try{ proceed(); }catch(e){ console.error('proceed:',e); }
    setTimeout(function(){
      var home=$('view-home');
      var ok = A.state && A.state.phone===phone && home && home.classList.contains('active');
      if(!ok){ location.reload(); }
    }, 500);
  }

  A.AuthUI={
    show:function(m){ mode=m; mount(true); },
    togglePw:function(id){ var e=$(id); if(!e) return; e.type=(e.type==='password'?'text':'password'); },
    submit:function(){
      var err=$('auth-err2');
      var phone=($('au-phone').value||'').replace(/\D/g,'');
      var pw=($('au-pw').value||'');
      if(phone.length<9){ err.textContent='Enter a valid Ugandan mobile number.'; return; }
      if($('au-email')){
        var email=($('au-email').value||'').trim().toLowerCase();
        var pw2=($('au-pw2').value||'');
        var dob=($('au-dob').value||'');
        if(!validEmail(email)){ err.textContent='Enter a valid email address.'; return; }
        if(!strong(pw)){ err.textContent='Password too weak: need 8+ chars with upper, lower, number and symbol.'; return; }
        if(pw!==pw2){ err.textContent='Passwords do not match.'; return; }
        var ag=ageOf(dob); if(ag<18){ err.textContent='You must be 18 years or older to open an account.'; return; }
        if(ag>120){ err.textContent='Enter a valid date of birth.'; return; }
        var tcBox=$('au-tc'); if(!tcBox||!tcBox.checked){ err.textContent='You must read and accept the Terms & Conditions.'; return; }
        var idx={}; try{ idx=JSON.parse(localStorage.getItem('asc_cred_index')||'{}'); }catch(e){}
        if(idx[phone]){ err.textContent='This number already has an account. Sign in instead.'; return; }
        if(idx['e:'+email]){ err.textContent='This email is already registered.'; return; }
        idx[phone]=true; idx['e:'+email]=phone;
        localStorage.setItem('asc_cred_index',JSON.stringify(idx));
        localStorage.setItem('asc_cred_'+phone,JSON.stringify({pw:hash(pw),email:email,dob:dob,tc:true,ts:Date.now()}));
        localStorage.setItem('asc_tc_v1','1');
        if(!localStorage.getItem('ascendin-acct-'+phone)){
          localStorage.setItem('ascendin-acct-'+phone, JSON.stringify({phone:phone,balance:0,holdings:{},bondHold:{},transactions:[],alerts:[],createdAt:Date.now()}));
        }
        handoff(phone);
      } else {
        var saved=null; try{ saved=JSON.parse(localStorage.getItem('asc_cred_'+phone)||'null'); }catch(e){}
        if(!saved){ err.textContent='No account found for this number. Create one first.'; return; }
        if(hash(pw)!==saved.pw){ err.textContent='Incorrect password. Try again.'; return; }
        handoff(phone);
      }
    }
  };
  A.AuthSubmit=function(){ A.AuthUI.submit(); };

  /* bonds scrolling tape */
  function tapeHTML(){ var h=''; for(var r=0;r<2;r++){ for(var i=0;i<A.BONDS.length;i++){ var b=A.BONDS[i]; h+='<div class="bt-chip" onclick="Ascendin.Bonds.openBond(\''+b.id+'\')"><span class="bt-name">'+b.name+'</span><span class="bt-rate">'+b.rate.toFixed(1)+'%</span></div>'; } } return h; }
  function ensureTape(){ var vb=A.$('view-bonds'); if(!vb) return; if(!vb.querySelector('.bond-tapewrap')){ var w=document.createElement('div'); w.className='tickerwrap bond-tapewrap'; w.innerHTML='<div class="tickertrack" id="bond-ticker"></div>'; var bg=A.$('bonds-bg'); if(bg&&bg.nextSibling) vb.insertBefore(w,bg.nextSibling); else vb.insertBefore(w,vb.firstChild); } var t=A.$('bond-ticker'); if(t) t.innerHTML=tapeHTML(); }
  if(A.Bonds){ var bR=A.Bonds.render; A.Bonds.render=function(){ bR.apply(A.Bonds,arguments); ensureTape(); }; }

  mount(false); setTimeout(function(){mount(false);},60); setTimeout(function(){mount(false);},400); setTimeout(function(){mount(false);},900);
})();
