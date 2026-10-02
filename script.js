const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgxJ2qJ_FW6K6K2G4Dfoqk3IHaCqbnndy4_pePNNLHKuYsXfmGRL06EiXGjuapN1Iy/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 1. LẤY TÊN KHÁCH MỜI TỪ LINK WEB (?to=Tên)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('khach');

  if (guestName) {
    const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const guestElem = document.getElementById('guestName');
    if (guestElem) guestElem.innerText = decodedName;

    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.value = decodedName;
  }

  // 2. KÍCH HOẠT HIỆU ỨNG SCROLL REVEAL
  setupScrollReveal();

  // 3. TỰ ĐỘNG TẠO TRÁI TIM RƠI (Chạy định kỳ 450ms)
  setInterval(createFallingHeart, 450);

  // 4. XỬ LÝ PHÁT NHẠC NỀN
  setupMusicPlayer();

  // 5. XỬ LÝ POPUP MODAL MÃ QR
  setupQrModal();

  // 6. XỬ LÝ FORM RSVP
  setupFormRSVP();
});

// HÀM XỬ LÝ SCROLL REVEAL (HIỆU ỨNG CUỘN TRANG)
function setupScrollReveal() {
  const elementsToAnimate = document.querySelectorAll(
    '.announcement-section, .invitation-section, .timeline-events-section, .calendar-card-section, .gallery-card-section, .gift-section, .rsvp-card-section, .event-card-style, .gallery-item, .parent-col'
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add('reveal');
  });

  const observerOptions = {
    root: null,
    threshold: 0.12
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => scrollObserver.observe(el));
}

// HÀM TẠO TRÁI TIM RƠI ĐỘNG (CHỈ DÙNG TRÁI TIM)
function createFallingHeart() {
  const heart = document.createElement('div');
  heart.classList.add('falling-heart');
  
  const hearts = ['❤️', '💖', '💕'];
  heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

  heart.style.left = Math.random() * 98 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 4 + 's';
  heart.style.fontSize = Math.random() * 8 + 14 + 'px';
  heart.style.opacity = Math.random() * 0.6 + 0.4;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7500);
}

// XỬ LÝ POPUP MODAL QR
function setupQrModal() {
  const openQrBtn = document.getElementById('openQrBtn');
  const closeQrBtn = document.getElementById('closeQrBtn');
  const qrModal = document.getElementById('qrModal');

  if (openQrBtn && qrModal) {
    openQrBtn.addEventListener('click', () => {
      qrModal.classList.add('active');
    });
  }

  if (closeQrBtn && qrModal) {
    closeQrBtn.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('active');
      }
    });
  }
}

// XỬ LÝ BẬT / TẮT NHẠC
function setupMusicPlayer() {
  const musicBtn = document.getElementById('musicControl');
  const bgMusic = document.getElementById('bgMusic');

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.classList.remove('paused');
        musicBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('paused');
      }
    });

    const startAudioOnInteraction = () => {
      if (bgMusic.paused && musicBtn.classList.contains('paused')) {
        bgMusic.play().then(() => {
          musicBtn.classList.remove('paused');
          musicBtn.classList.add('playing');
        }).catch(() => {});
      }
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('touchstart', startAudioOnInteraction);
    };

    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);
  }
}

// XỬ LÝ GỬI FORM RSVP
function setupFormRSVP() {
  const form = document.getElementById('rsvpForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const statusMsg = document.getElementById('statusMessage');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    btnSubmit.disabled = true;
    btnSubmit.innerText = 'ĐANG GỬI...';
    statusMsg.className = 'status-msg';

    const payload = {
      name: document.getElementById('name').value.trim(),
      attend: document.getElementById('attend').value,
      count: document.getElementById('count').value,
      note: document.getElementById('note').value.trim(),
      wishes: document.getElementById('wishes').value.trim()
    };

    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(payload));

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json().catch(() => ({ result: 'success' })))
    .then(res => {
      if (res.result === 'success' || res.status === 'success') {
        statusMsg.className = 'status-msg success';
        statusMsg.innerText = 'Cảm ơn bạn đã xác nhận và gửi lời chúc!';
        form.reset();
      } else {
        throw new Error(res.message || 'Lỗi xử lý');
      }
    })
    .catch(err => {
      console.error('Lỗi:', err);
      statusMsg.className = 'status-msg error';
      statusMsg.innerText = 'Có lỗi xảy ra, vui lòng thử lại!';
    })
    .finally(() => {
      btnSubmit.disabled = false;
      btnSubmit.innerText = 'GỬI XÁC NHẬN';
    });
  });
}