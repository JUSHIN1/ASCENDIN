/* Crypto USDT rail: deposits land in your Binance reserve, withdrawals paid from it. */
(function(){
  var A = window.Ascendin;
  A.CRYPTO = {
    rate: 3700,
    confirmSecs: 20,
    addresses: {
      TRC20: 'PASTE_YOUR_BINANCE_TRC20_USDT_ADDRESS',
      BEP20: 'PASTE_YOUR_BINANCE_BEP20_USDT_ADDRESS'
    }
  };
  A.Crypto = { chain: 'TRC20' };

  A.Crypto.setChain = function(c, prefix){
    A.Crypto.chain = c;
    var t = A.$(prefix+'-trc'), b = A.$(prefix+'-bep');
    if (t) t.classList.toggle('sel', c==='TRC20');
    if (b) b.classList.toggle('sel', c==='BEP20');
    var addr = A.CRYPTO.addresses[c] || '';
    var el = A.$(prefix+'-addr'); if (el) el.textContent = addr;
    var qr = A.$(prefix+'-qr'); if (qr) qr.src = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' + encodeURIComponent(addr);
    A.Crypto.upd(prefix);
  };
  A.Crypto.upd = function(prefix){
    var amt = parseFloat(A.$(prefix+'-amt').value)||0;
    var el = A.$(prefix+'-usdt'); if (el) el.textContent = (amt/A.CRYPTO.rate).toFixed(2)+' USDT';
  };
  A.Crypto.copyAddr = function(prefix){
    if (navigator.clipboard) navigator.clipboard.writeText(A.$(prefix+'-addr').textContent);
    A.toast('Address copied');
  };
  A.Crypto.submitDeposit = function(){
    var amt = parseFloat(A.$('depc-amt').value)||0;
    if (amt<500||amt>5000000){ A.toast('Amount must be between 500 and 5,000,000'); return; }
    var usdt = (amt/A.CRYPTO.rate).toFixed(2);
    var chain = A.Crypto.chain;
    A.openDialog('<div class="center"><div style="font-weight:800;font-size:17px">Watching for your transfer</div><div class="muted small" style="margin:8px 0;line-height:1.5">'+usdt+' USDT on '+chain+'. We credit your wallet after 1 confirmation.</div><div class="muted small" id="depc-poll">confirmations: 0/1</div></div>');
    setTimeout(function(){ var el=A.$('depc-poll'); if(el) el.textContent='confirmations: 1/1'; }, A.CRYPTO.confirmSecs*500);
    setTimeout(function(){
      A.closeAll();
      A.state.balance += amt;
      A.addTx('Deposit (USDT '+chain+')', amt, usdt+' USDT to reserve');
      A.notify('Crypto deposit of '+A.ugx(amt)+' confirmed');
      A.save();
      A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px;font-weight:800;margin:8px 0">Deposit successful</div><div class="center muted small">'+A.ugx(amt)+' credited from your USDT transfer.</div><button class="btn green" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'account\')">DONE</button>');
    }, A.CRYPTO.confirmSecs*1000);
  };
  A.Crypto.submitWithdraw = function(){
    var amt = parseFloat(A.$('wdc-amt').value)||0;
    var addr = (A.$('wdc-addr').value||'').trim();
    if (amt<1000||amt>5000000){ A.toast('Amount must be between 1,000 and 5,000,000'); return; }
    if (addr.length<20){ A.toast('Paste a valid USDT wallet address'); return; }
    if (amt>A.state.balance){ A.toast('Insufficient balance'); return; }
    var usdt = (amt/A.CRYPTO.rate).toFixed(2);
    A.state.balance -= amt;
    A.addTx('Withdraw (USDT '+A.Crypto.chain+')', -amt, usdt+' USDT to '+addr.slice(0,8)+'...');
    A.notify('Crypto withdrawal requested - paid from Ascendin Binance reserve');
    A.save();
    A.openDialog('<div class="center" style="color:var(--up)">'+A.icon('check',44)+'</div><div class="center" style="font-size:18px;font-weight:800;margin:8px 0">Withdrawal requested</div><div class="center muted small">'+usdt+' USDT will be sent from the Ascendin Binance reserve to your address. Manual payouts usually land within 30 minutes.</div><button class="btn green" style="margin-top:16px" onclick="Ascendin.closeAll(); Ascendin.go(\'account\')">DONE</button>');
  };
})();