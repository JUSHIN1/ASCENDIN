/* Withdraw - locked to the account's own number, fee by network. */
(function(){
  var A = window.Ascendin;
  A.Withdraw = {};

  A.Withdraw.chrome = function(){
    var net = A.state.network;
    A.$('wd-badge').className = 'badge ' + (net==='MTN'?'mtn':'airtel');
    A.$('wd-badge').textContent = net==='MTN' ? 'M' : 'A';
    A.$('wd-phone').textContent = A.Auth.display(A.state.phone);
    A.Withdraw.updWFee();
  };

  A.Withdraw.updWFee = function(){
    var a = parseFloat(A.$('wd-amount').value)||0;
    var fee = a * (A.state.network==='MTN' ? 0.015 : 0.010);
    A.$('wd-fee').innerHTML = a
      ? '<span class="muted">Fee: </span><span class="bold">'+A.ugx(fee)+'</span> <span class="muted">- you receive: </span><span class="bold">'+A.ugx(a-fee)+'</span>'
      : '';
  };

  A.Withdraw.startWithdraw = function(){
    var a = parseFloat(A.$('wd-amount').value)||0;
    A.$('wd-err').textContent = '';
    var fee = a * (A.state.network==='MTN' ? 0.015 : 0.010);
    if (a<1000 || a>5000000){ A.$('wd-err').textContent = 'Amount must be between 1,000 and 5,000,000'; return; }
    if (a>A.state.balance){ A.$('wd-err').textContent = 'Insufficient balance. You have '+A.ugx(A.state.balance)+'.'; return; }
    var btn = A.$('wd-btn'); btn.disabled = true; btn.textContent = 'PROCESSING...';
    setTimeout(function(){
      btn.disabled = false; btn.textContent = 'WITHDRAW';
      A.state.balance -= a;
      A.addTx('Withdraw ('+A.state.network+')', -a, 'To '+A.Auth.display(A.state.phone)+' (fee '+A.ugx(fee)+')');
      A.notify('Withdrawal of '+A.ugx(a)+' sent to '+A.Auth.display(A.state.phone));
      A.save();
      A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px; font-weight:800; margin:8px 0">Withdrawal sent</div><div class="center" style="color:#aaa; font-size:14px">'+A.ugx(a-fee)+' is on its way to '+A.Auth.display(A.state.phone)+' via '+(A.state.network==='MTN'?'MTN MoMo':'Airtel Money')+'. Fee '+A.ugx(fee)+'. New balance '+A.ugx(A.state.balance)+'</div><button class="btn green" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'account\')">DONE</button>');
    }, 1200);
  };
})();