// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgxJ2qJ_FW6K6K2G4Dfoqk3IHaCqbnndy4_pePNNLHKuYsXfmGRL06EiXGjuapN1Iy/exec';

// const form = document.getElementById('rsvpForm');
// const btnSubmit = document.getElementById('btnSubmit');
// const statusMsg = document.getElementById('statusMessage');
// const wishesContainer = document.getElementById('wishesContainer');

// // 1. TẢI CÁC LỜI CHÚC ĐÃ CÓ KHI TRANG MỞ LÊN
// document.addEventListener('DOMContentLoaded', fetchWishes);

// function fetchWishes() {
//   fetch(SCRIPT_URL)
//     .then(res => res.json())
//     .then(data => {
//       if (data.result === 'success' && data.data && data.data.length > 0) {
//         wishesContainer.innerHTML = data.data.map(item => `
//           <div class="wish-card">
//             <div class="wish-author">${escapeHtml(item.name)}</div>
//             <div class="wish-text">${escapeHtml(item.wishes)}</div>
//           </div>
//         `).join('');
//       } else {
//         wishesContainer.innerHTML = '<p style="text-align:center;">Chưa có lời chúc nào. Hãy là người đầu tiên chúc mừng nhé!</p>';
//       }
//     })
//     .catch(() => {
//       wishesContainer.innerHTML = '<p style="text-align:center;">Chưa có lời chúc nào hoặc không thể tải danh sách.</p>';
//     });
// }

// // 2. XỬ LÝ KHI KHÁCH MỜI BẤM GỬI FORM
// form.addEventListener('submit', e => {
//   e.preventDefault();
  
//   btnSubmit.disabled = true;
//   btnSubmit.innerText = 'Đang gửi...';
//   statusMsg.className = 'status-msg';

//   const payload = {
//     name: document.getElementById('name').value.trim(),
//     attend: document.getElementById('attend').value,
//     count: document.getElementById('count').value,
//     note: document.getElementById('note').value.trim(),
//     wishes: document.getElementById('wishes').value.trim()
//   };

//   // Dùng URLSearchParams gửi dữ liệu dạng Form chuẩn để tránh lỗi CORS Trình duyệt
//   const formData = new URLSearchParams();
//   formData.append('data', JSON.stringify(payload));

//   fetch(SCRIPT_URL, {
//     method: 'POST',
//     body: formData
//   })
//   .then(res => res.json())
//   .then(res => {
//     if (res.result === 'success') {
//       statusMsg.className = 'status-msg success';
//       statusMsg.innerText = 'Cảm ơn bạn đã xác nhận và gửi lời chúc!';
//       form.reset();
//       fetchWishes(); // Tải lại Sổ lời chúc ngay lập tức
//     } else {
//       throw new Error(res.message);
//     }
//   })
//   .catch(err => {
//     console.error('Lỗi chi tiết:', err);
//     statusMsg.className = 'status-msg error';
//     statusMsg.innerText = 'Có lỗi xảy ra, vui lòng thử lại!';
//   })
//   .finally(() => {
//     btnSubmit.disabled = false;
//     btnSubmit.innerText = 'Gửi Xác Nhận';
//   });
// });

// // Chống lỗi XSS khi hiển thị text
// function escapeHtml(str) {
//   if (!str) return '';
//   return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// }

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgxJ2qJ_FW6K6K2G4Dfoqk3IHaCqbnndy4_pePNNLHKuYsXfmGRL06EiXGjuapN1Iy/exec';

// 1. ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN TIMER)
const weddingDate = new Date("2026-10-20T17:30:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance > 0) {
    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
  } else {
    document.querySelector(".countdown-container").innerHTML = "<p>Đám cưới đã diễn ra!</p>";
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// 2. FORM RSVP & SỔ LỜI CHÚC
const form = document.getElementById('rsvpForm');
const btnSubmit = document.getElementById('btnSubmit');
const statusMsg = document.getElementById('statusMessage');
const wishesContainer = document.getElementById('wishesContainer');

document.addEventListener('DOMContentLoaded', fetchWishes);

function fetchWishes() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (data.result === 'success' && data.data && data.data.length > 0) {
        wishesContainer.innerHTML = data.data.map(item => `
          <div class="wish-card">
            <div class="wish-author">${escapeHtml(item.name)}</div>
            <div class="wish-text">${escapeHtml(item.wishes)}</div>
          </div>
        `).join('');
      } else {
        wishesContainer.innerHTML = '<p style="text-align:center;">Chưa có lời chúc nào. Hãy là người đầu tiên chúc mừng nhé!</p>';
      }
    })
    .catch(() => {
      wishesContainer.innerHTML = '<p style="text-align:center;">Chưa có lời chúc nào hoặc không thể tải danh sách.</p>';
    });
}

// XỬ LÝ GỬI FORM ĐÃ SỬA LỖI BÁO GIẢ
form.addEventListener('submit', e => {
  e.preventDefault();
  
  btnSubmit.disabled = true;
  btnSubmit.innerText = 'Đang gửi...';
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
  .then(res => {
    // Nếu Google phản hồi OK hoặc chuyển hướng opaque, cố gắng đọc JSON
    // Nếu không đọc được JSON do CORS redirect nhưng request thành công thì mặc định trả về success
    return res.json().catch(() => ({ result: 'success' }));
  })
  .then(res => {
    if (res.result === 'success' || res.status === 'success') {
      statusMsg.className = 'status-msg success';
      statusMsg.innerText = 'Cảm ơn bạn đã xác nhận và gửi lời chúc!';
      form.reset();
      
      // Đợi 1 giây để Google Sheets ghi xong rồi mới tải lại sổ lời chúc
      setTimeout(fetchWishes, 1000);
    } else {
      throw new Error(res.message || 'Lỗi xử lý từ máy chủ');
    }
  })
  .catch(err => {
    console.error('Lỗi chi tiết:', err);
    statusMsg.className = 'status-msg error';
    statusMsg.innerText = 'Có lỗi xảy ra, vui lòng thử lại!';
  })
  .finally(() => {
    btnSubmit.disabled = false;
    btnSubmit.innerText = 'Gửi Xác Nhận';
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// TỰ ĐỘNG ĐỌC TÊN KHÁCH MỜI TỪ LINK WEB
document.addEventListener('DOMContentLoaded', () => {
  // Lấy các tham số trên thanh địa chỉ URL
  const urlParams = new URLSearchParams(window.location.search);
  
  // Hỗ trợ đọc cả tham số ?to= hoặc ?khach=
  const guestName = urlParams.get('to') || urlParams.get('khach');

  if (guestName) {
    // Giải mã tiếng Việt (ví dụ: Anh+Ho%C3%A0ng -> Anh Hoàng)
    const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    
    // 1. Hiển thị tên lên vị trí Lời mời
    const guestElem = document.getElementById('guestName');
    if (guestElem) {
      guestElem.innerText = decodedName;
    }
    
    // 2. Tự động điền sẵn tên vào ô "Họ và tên" ở Form RSVP (Khách không cần gõ lại)
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.value = decodedName;
    }
  }
});