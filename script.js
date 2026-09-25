const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgxJ2qJ_FW6K6K2G4Dfoqk3IHaCqbnndy4_pePNNLHKuYsXfmGRL06EiXGjuapN1Iy/exec';

document.addEventListener('DOMContentLoaded', () => {
  fetchWishes();

  // 1. ĐỌC TÊN KHÁCH MỜI TỪ LINK WEB (?to=Tên)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('khach');

  if (guestName) {
    const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const guestElem = document.getElementById('guestName');
    if (guestElem) guestElem.innerText = decodedName;

    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.value = decodedName;
  }

  // 2. TỰ ĐỘNG KÍCH HOẠT HIỆU ỨNG TRÁI TIM RƠI
  setInterval(createFallingHeart, 400);

  // 3. XỬ LÝ NHẠC CƯỚI NỀN
  setupMusicPlayer();
});

// HÀM TẠO TRÁI TIM RƠI
function createFallingHeart() {
  const heart = document.createElement('div');
  heart.classList.add('falling-heart');
  
  // Biểu tượng trái tim / hoa hồng ngẫu nhiên
  const icons = ['❤️', '💖', '💕', '🌸'];
  heart.innerText = icons[Math.floor(Math.random() * icons.length)];

  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // Rơi trong 4-7 giây
  heart.style.fontSize = Math.random() * 10 + 14 + 'px';
  heart.style.opacity = Math.random() * 0.7 + 0.3;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// HÀM XỬ LÝ PHÁT NHẠC
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

    // Phát nhạc tự động khi người dùng chạm/lướt trang web lần đầu tiên
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

// TẢI SỔ LỜI CHÚC TỪ GOOGLE SHEETS
function fetchWishes() {
  const container = document.getElementById('wishesContainer');
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (data.result === 'success' && data.data && data.data.length > 0) {
        container.innerHTML = data.data.map(item => `
          <div class="wish-card">
            <div class="wish-author">${escapeHtml(item.name)}</div>
            <div class="wish-text">${escapeHtml(item.wishes)}</div>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p style="text-align:center; color:#888; font-size:0.85rem;">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>';
      }
    })
    .catch(() => {
      container.innerHTML = '<p style="text-align:center; color:#888; font-size:0.85rem;">Chưa có lời chúc nào hoặc không thể tải danh sách.</p>';
    });
}

// XỬ LÝ GỬI FORM RSVP
const form = document.getElementById('rsvpForm');
const btnSubmit = document.getElementById('btnSubmit');
const statusMsg = document.getElementById('statusMessage');

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
      setTimeout(fetchWishes, 1000);
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}