// =========================================================
// 1. TẠO CẤU TRÚC HTML CHO HEADER VÀ MODAL ĐĂNG NHẬP
// =========================================================
const headerHTML = `
    <header>
        <div class="logo-container">
            <!-- Click vào logo sẽ chuyển về trang chủ (index.html) -->
            <h1 onclick="window.location.href='index.html'" style="cursor: pointer;" title="Về trang chủ">ATherapyHub</h1>
            <nav id="main-nav"></nav>
        </div>
        <div class="user-controls">
            <span id="user-email-display" class="hidden"></span>
            <button id="logout-btn" class="btn-logout hidden">Đăng xuất</button>
            <button id="open-login-modal" class="btn-login-nav">Đăng nhập</button>
        </div>
    </header>

    <div id="login-modal" class="modal-overlay">
        <div class="modal-box">
            <button id="close-login-modal" class="btn-close-modal">&times;</button>
            <h2>Đăng Nhập Quản Trị</h2>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" placeholder="Nhập email" required>
            </div>
            <div class="form-group">
                <label>Mật khẩu</label>
                <input type="password" id="password" placeholder="Nhập mật khẩu" required>
            </div>
            <button id="login-btn" class="btn-primary">Đăng nhập</button>
        </div>
    </div>
`;

// =========================================================
// 2. TẠO CẤU TRÚC HTML CHO FOOTER
// =========================================================
const footerHTML = `
    <footer>
        &copy; ATherapyHub 2026. Diễn đàn Học thuật & Lâm sàng cho Nhà trị liệu.
    </footer>
`;

// =========================================================
// 3. CHÈN HEADER VÀ FOOTER VÀO TRANG (GẮN VÀO THẺ BODY)
// =========================================================
// Chèn Header lên sát đỉnh (đầu thẻ body)
document.body.insertAdjacentHTML('afterbegin', headerHTML);
// Chèn Footer xuống dưới cùng (cuối thẻ body)
document.body.insertAdjacentHTML('beforeend', footerHTML);


// =========================================================
// 4. LẤY DỮ LIỆU MENU TỪ FILE HEADER.JSON
// =========================================================
const navContainer = document.getElementById('main-nav');

// Sử dụng fetch để gọi file JSON (Yêu cầu chạy qua Local Server hoặc GitHub Pages)
fetch('./json/header.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Không tìm thấy file header.json hoặc lỗi mạng');
        }
        return response.json();
    })
    .then(data => {
        // Duyệt qua từng mục trong json và tạo thẻ <a>
        data.forEach(item => {
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            navContainer.appendChild(a);
        });
    })
    .catch(error => {
        console.error("Lỗi khi tải menu:", error);
        // Fallback: Nếu lỗi (do mở file trực tiếp không qua server), hiển thị tạm 1 menu
        navContainer.innerHTML = `<a href="index.html">Trang chủ (Fallback)</a>`;
    });


// =========================================================
// 5. XỬ LÝ LOGIC ĐÓNG/MỞ MODAL VÀ ĐĂNG NHẬP/ĐĂNG XUẤT
// =========================================================
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-modal');
const closeLoginBtn = document.getElementById('close-login-modal');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');

// Nút mở modal đăng nhập
openLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Nút tắt modal (dấu X)
closeLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Nút thực hiện Đăng nhập (Mô phỏng)
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email && password) {
        // Đóng modal
        loginModal.style.display = 'none';
        
        // Ẩn nút "Đăng nhập", hiện nút "Đăng xuất" và Email người dùng
        openLoginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userEmailDisplay.textContent = email;
        userEmailDisplay.classList.remove('hidden');

        // Xóa trắng form để lần sau mở lên không bị dính chữ cũ
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } else {
        alert("Vui lòng nhập Email và Mật khẩu!");
    }
});

// Nút thực hiện Đăng xuất
logoutBtn.addEventListener('click', () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        // Ẩn nút "Đăng xuất" và Email
        logoutBtn.classList.add('hidden');
        userEmailDisplay.classList.add('hidden');
        userEmailDisplay.textContent = '';
        
        // Hiện lại nút "Đăng nhập"
        openLoginBtn.classList.remove('hidden');
    }
});
