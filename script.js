// DATA MOCKUP NOMINAL ITEM
const itemsData = [
  { id: 'ff_5', name: '5 Diamond', price: 1000, icon: 'fa-gem' },
  { id: 'ff_12', name: '12 Diamond', price: 2000, icon: 'fa-gem' },
  { id: 'ff_50', name: '50 Diamond', price: 8000, icon: 'fa-gem' },
  { id: 'ff_70', name: '70 Diamond', price: 10000, icon: 'fa-gem' },
  { id: 'ff_140', name: '140 Diamond', price: 20000, icon: 'fa-gem' },
  { id: 'ff_355', name: '355 Diamond', price: 50000, icon: 'fa-gem' },
  { id: 'ff_720', name: '720 Diamond', price: 100000, icon: 'fa-gem' },
  { id: 'ff_mb', name: 'Member Mingguan', price: 30000, icon: 'fa-crown' }
];

// DATA MOCKUP METODE PEMBAYARAN
const paymentData = [
  { id: 'qris', name: 'QRIS (All E-Wallet)', icon: 'fa-qrcode', type: 'qr' },
  { id: 'dana', name: 'DANA', icon: 'fa-wallet', type: 'va' },
  { id: 'gopay', name: 'GoPay', icon: 'fa-wallet', type: 'va' },
  { id: 'ovo', name: 'OVO', icon: 'fa-wallet', type: 'va' },
  { id: 'bca', name: 'BCA Virtual Account', icon: 'fa-building-columns', type: 'va' },
  { id: 'bri', name: 'BRI Virtual Account', icon: 'fa-building-columns', type: 'va' }
];

// MOCK DATABASE PLAYER
const mockPlayers = {
  "123456789": "RIO_GAMER_FF",
  "987654321": "SULTAN_EPEP",
  "112233445": "PRO_PLAYER_007"
};

// STATE FORM GLOBAL
let selectedItem = null;
let selectedPayment = null;
let verifiedNick = null;
let timerInterval = null;

// RENDER ITEM DIAMOND
function renderItems() {
  const container = document.getElementById('itemsGrid');
  if (!container) return;

  container.innerHTML = itemsData.map(item => `
    <div class="item-card" data-id="${item.id}">
      <i class="fa-solid ${item.icon} item-icon"></i>
      <div class="item-name">${item.name}</div>
      <div class="item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
    </div>
  `).join('');

  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = card.getAttribute('data-id');
      if (itemId) selectItem(itemId);
    });
  });
}

// RENDER METODE PEMBAYARAN
function renderPayments() {
  const container = document.getElementById('paymentGrid');
  if (!container) return;

  container.innerHTML = paymentData.map(pay => `
    <div class="pay-card" data-id="${pay.id}">
      <i class="fa-solid ${pay.icon} pay-icon"></i>
      <div class="pay-name">${pay.name}</div>
    </div>
  `).join('');

  document.querySelectorAll('.pay-card').forEach(card => {
    card.addEventListener('click', () => {
      const payId = card.getAttribute('data-id');
      if (payId) selectPayment(payId);
    });
  });
}

// FUNGSI PILIH ITEM
function selectItem(itemId = '') {
  selectedItem = itemsData.find(i => i.id === itemId) || null;
  document.querySelectorAll('.item-card').forEach(card => {
    card.classList.toggle('selected', card.getAttribute('data-id') === itemId);
  });
  updateSummary();
}

// FUNGSI PILIH PEMBAYARAN
function selectPayment(payId = '') {
  selectedPayment = paymentData.find(p => p.id === payId) || null;
  document.querySelectorAll('.pay-card').forEach(card => {
    card.classList.toggle('selected', card.getAttribute('data-id') === payId);
  });
  updateSummary();
}

// UPDATE RINGKASAN
function updateSummary() {
  const userIdInput = document.getElementById('userId');
  const userId = userIdInput ? userIdInput.value.trim() : '';

  const elemSummaryId = document.getElementById('summaryId');
  const elemSummaryNick = document.getElementById('summaryNick');
  const elemSummaryItem = document.getElementById('summaryItem');
  const elemSummaryPayment = document.getElementById('summaryPayment');
  const elemSummaryTotal = document.getElementById('summaryTotal');
  const btnOrder = document.getElementById('btnOrder');

  if (elemSummaryId) elemSummaryId.textContent = userId || '-';
  if (elemSummaryNick) elemSummaryNick.textContent = verifiedNick || '-';
  if (elemSummaryItem) elemSummaryItem.textContent = selectedItem ? selectedItem.name : '-';
  if (elemSummaryPayment) elemSummaryPayment.textContent = selectedPayment ? selectedPayment.name : '-';
  if (elemSummaryTotal) {
    elemSummaryTotal.textContent = selectedItem 
      ? `Rp ${selectedItem.price.toLocaleString('id-ID')}` 
      : 'Rp 0';
  }

  if (btnOrder) {
    btnOrder.disabled = !(userId && selectedItem && selectedPayment);
  }
}

// TIMER WAKTU PEMBAYARAN
function startTimer(seconds = 900) {
  clearInterval(timerInterval);
  let timeRemaining = seconds;
  const timerDisplay = document.getElementById('countdownTimer');

  timerInterval = setInterval(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;

    if (timerDisplay) {
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert("Waktu pembayaran telah habis. Silakan buat pesanan baru.");
      closeModal();
    }
    timeRemaining--;
  }, 1000);
}

// CLOSE MODAL INVOICE
function closeModal() {
  const modal = document.getElementById('invoiceModal');
  if (modal) modal.classList.add('hidden');
  clearInterval(timerInterval);
}

// INISIALISASI SETELAH DOM SIAP
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  renderPayments();

  const userIdInput = document.getElementById('userId');
  if (userIdInput) {
    userIdInput.addEventListener('input', updateSummary);
  }

  const btnCheckId = document.getElementById('btnCheckId');
  if (btnCheckId) {
    btnCheckId.addEventListener('click', () => {
      const idInput = userIdInput ? userIdInput.value.trim() : '';
      const resultMsg = document.getElementById('idResult');

      if (!resultMsg) return;

      if (!idInput) {
        resultMsg.className = "id-result-msg error";
        resultMsg.textContent = "Masukkan Player ID terlebih dahulu!";
        return;
      }

      if (mockPlayers[idInput]) {
        verifiedNick = mockPlayers[idInput];
      } else {
        verifiedNick = "Player_" + idInput.slice(-4);
      }

      resultMsg.className = "id-result-msg success";
      resultMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Nickname ditemukan: <strong>${verifiedNick}</strong>`;
      updateSummary();
    });
  }

  const btnOrder = document.getElementById('btnOrder');
  if (btnOrder) {
    btnOrder.addEventListener('click', () => {
      const idInput = userIdInput ? userIdInput.value.trim() : '';
      const userPhone = document.getElementById('userPhone');
      const phone = userPhone ? userPhone.value.trim() : '';

      if (!phone) {
        alert("Silakan masukkan Nomor WhatsApp Anda untuk konfirmasi transaksi.");
        return;
      }

      if (!selectedItem || !selectedPayment) return;

      const trxCode = "REX-" + Math.floor(100000 + Math.random() * 900000);

      const invCode = document.getElementById('invCode');
      const invPlayerId = document.getElementById('invPlayerId');
      const invNick = document.getElementById('invNick');
      const invItem = document.getElementById('invItem');
      const invMethod = document.getElementById('invMethod');
      const invTotal = document.getElementById('invTotal');

      if (invCode) invCode.textContent = trxCode;
      if (invPlayerId) invPlayerId.textContent = idInput;
      if (invNick) invNick.textContent = verifiedNick || "Player";
      if (invItem) invItem.textContent = selectedItem.name;
      if (invMethod) invMethod.textContent = selectedPayment.name;
      if (invTotal) invTotal.textContent = `Rp ${selectedItem.price.toLocaleString('id-ID')}`;

      const payBox = document.getElementById('payInstruction');
      if (payBox) {
        if (selectedPayment.type === 'qr') {
          payBox.innerHTML = `
            <div class="qris-box">
              <p style="margin-bottom:8px; font-size:0.85rem;">Scan QRIS di bawah ini dengan E-Wallet / Mobile Banking Anda:</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${trxCode}" alt="QRIS Code">
            </div>
          `;
        } else {
          const vaNum = "8800" + Math.floor(100000000 + Math.random() * 900000000);
          payBox.innerHTML = `
            <p style="font-size:0.85rem;">Transfer ke Nomor Virtual Account berikut:</p>
            <div class="va-code-box">${vaNum}</div>
            <p style="font-size:0.75rem; color:#94A3B8; margin-top:5px;">Nomor otomatis terverifikasi setelah pembayaran.</p>
          `;
        }
      }

      const modal = document.getElementById('invoiceModal');
      if (modal) modal.classList.remove('hidden');
      startTimer(15 * 60);
    });
  }

  const btnCloseModal = document.getElementById('btnCloseModal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  const btnSimulatePay = document.getElementById('btnSimulatePay');
  if (btnSimulatePay) {
    btnSimulatePay.addEventListener('click', () => {
      alert("🎉 Pembayaran Berhasil! Diamond akan segera masuk ke akun Free Fire Anda.");
      closeModal();
    });
  }

  const btnWaConfirm = document.getElementById('btnWaConfirm');
  if (btnWaConfirm) {
    btnWaConfirm.addEventListener('click', () => {
      const invCode = document.getElementById('invCode');
      const invPlayerId = document.getElementById('invPlayerId');
      const invItem = document.getElementById('invItem');
      const invTotal = document.getElementById('invTotal');

      const trxCode = invCode ? invCode.textContent : '';
      const userId = invPlayerId ? invPlayerId.textContent : '';
      const item = invItem ? invItem.textContent : '';
      const total = invTotal ? invTotal.textContent : '';

      const text = `Halo CS Riox Epep, saya mau konfirmasi pembayaran top up:\n\n` +
                   `*Kode Transaksi:* ${trxCode}\n` +
                   `*Player ID:* ${userId}\n` +
                   `*Item:* ${item}\n` +
                   `*Total:* ${total}\n\n` +
                   `Mohon segera diproses. Terima kasih!`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }
});