/* Deposit - Flutterwave mobile money when configured, simulated PIN fallback otherwise. */
(function(){
  var A = window.Ascendin;
  A.Deposit = {};

  A.Deposit.chrome = function(){
    var net = A.state.network;
    A.$('dep-head').textContent = 'Deposit using ' + (net==='MTN'?'MTN MoMo':'Airtel Money');
    A.$('dep-badge').className = 'badge ' + (net==='MTN'?'mtn':'airtel');
    A.$('dep-badge').textContent = net==='MTN'?'M':'A';
    A.$('dep-phone').textContent = A.Auth.display(A.state.phone);
  };

  function digits(){ return (A.state.phone||'').replace(/\D/g,''); }

  A.Deposit.startDeposit = function(){
    var a = parseFloat(A.$('dep-amount').value)||0;
    A.$('dep-err').textContent='';
    if(a<500||a>5000000){ A.$('dep-err').textContent='Amount must be between 500 and 5,000,000'; return; }
    var btn=A.$('dep-btn'); btn.disabled=true; btn.textContent='PROCESSING...';
    fetch('/api/deposits/fw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:digits(),amount:a,network:A.state.network})})
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(res){
        btn.disabled=false; btn.textContent='DEPOSIT';
        if(res&&res.ref){ A.Deposit.track(res.ref,a,res.link); } else { A.Deposit.simulate(a); }
      })
      .catch(function(){ btn.disabled=false; btn.textContent='DEPOSIT'; A.Deposit.simulate(a); });
  };

  A.Deposit.track = function(ref,amount,link){
    if(link) window.open(link,'_blank');
    A.openDialog('<div class="center"><div style="font-weight:800;font-size:17px">Approve the payment</div><div class="muted small" style="margin:8px 0 4px;line-height:1.5">Confirm the '+A.ugx(amount)+' '+A.state.network+' prompt '+(link?'in the Flutterwave tab that opened':'on your phone')+'. Watching for confirmation...</div><div class="muted small" id="dep-poll">status: pending</div></div>');
    var tries=0;
    var t=setInterval(function(){
      tries++;
      fetch('/api/deposits/fw/status/'+ref).then(function(r){return r.ok?r.json():null;}).then(function(st){
        var el=A.$('dep-poll'); if(el) el.textContent='status: '+((st&&st.status)||'pending');
        if(st&&st.status==='success'){ clearInterval(t); A.closeAll(); A.Sync.pull(function(){ A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px;font-weight:800;margin:8px 0">Deposit successful</div><div class="center muted small">'+A.ugx(amount)+' received from '+A.Auth.display(A.state.phone)+'.</div><button class="btn green" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'account\')">DONE</button>'); }); }
        else if(st&&st.status==='failed'){ clearInterval(t); A.closeAll(); A.toast('Payment failed or cancelled.'); }
        else if(tries>40){ clearInterval(t); A.closeAll(); A.toast('Still pending - we will credit you when the telco confirms.'); }
      }).catch(function(){});
    },3000);
  };

  A.Deposit.simulate = function(a){
    A.openDialog(
      '<div style="font-weight:800;line-height:1.5;font-size:16px">Enter PIN to confirm payment of UGX '+A.fmt(a)+' to ASCENDIN INVESTMENTS LTD 884521 with Customer charges 0.0</div>'+
      '<input id="pin-input" type="password" inputmode="numeric" maxlength="4" style="width:100%;background:transparent;border:none;border-bottom:2px solid #fff;color:#fff;font-size:20px;padding:10px 2px;outline:none;margin:18px 0 8px">'+
      '<div class="row2" style="margin-top:10px"><button class="btn" style="background:transparent;color:#fff" onclick="Ascendin.closeAll()">Cancel</button><button class="btn" style="background:transparent;color:#fff" onclick="Ascendin.Deposit.finishSim('+a+')">Send</button></div>'
    );
    setTimeout(function(){ var p=A.$('pin-input'); if(p)p.focus(); },100);
  };
  A.Deposit.finishSim = function(a){
    var pin=A.$('pin-input').value;
    if(pin.length<4){ A.toast('Enter your 4 digit mobile money PIN'); return; }
    A.closeAll();
    A.state.balance+=a;
    A.addTx('Deposit ('+A.state.network+')',a,A.Auth.display(A.state.phone));
    A.notify('Deposit of '+A.ugx(a)+' received via '+(A.state.network==='MTN'?'MTN MoMo':'Airtel Money'));
    A.save();
    A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px;font-weight:800;margin:8px 0">Deposit successful</div><div class="center muted small">'+A.ugx(a)+' received from '+A.Auth.display(A.state.phone)+'. New balance '+A.ugx(A.state.balance)+'</div><button class="btn green" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'account\')">DONE</button>');
  };
})();