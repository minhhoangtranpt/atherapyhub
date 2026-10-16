// =========================================================
// 0. KHỞI TẠO FIREBASE VÀ IMPORT CÁC HÀM CẦN THIẾT
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBcC-sXCRnZ1eg9gzGR25HvaNi-B1P3Xuo",
    authDomain: "datatherapy-52437.firebaseapp.com",
    projectId: "datatherapy-52437",
    storageBucket: "datatherapy-52437.firebasestorage.app",
    messagingSenderId: "206559916642",
    appId: "1:206559916642:web:d4e911752ef2bb3b58973b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =========================================================
// 1. TẠO CẤU TRÚC HTML CHO HEADER, TÌM KIẾM VÀ MODAL
// =========================================================
const headerHTML = `
    <!-- Thêm CSS trực tiếp để xử lý Menu 3 gạch và Giao diện Modal -->
    <style>
        .hamburger-btn { display: none; background: none; border: none; font-size: 26px; color: white; cursor: pointer; margin-right: 15px; padding: 0; line-height: 1; }
        #user-email-display { text-decoration: underline; cursor: pointer; font-weight: 600; color: var(--navy-light); }
        #user-email-display:hover { color: white; }
        
        .auth-links { margin-top: 20px; text-align: center; font-size: 13.5px; border-top: 1px solid var(--border-color); padding-top: 15px; }
        .auth-links a { color: var(--accent-blue); cursor: pointer; margin: 0 8px; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .auth-links a:hover { text-decoration: underline; color: var(--navy-primary); }

        @media (max-width: 768px) {
            .hamburger-btn { display: block; }
            header { position: relative; }
            header .logo-container { flex-direction: row !important; align-items: center !important; justify-content: flex-start; }
            
            /* Ghi đè menu cuộn ngang thành menu thả xuống */
            nav#main-nav {
                display: none !important; 
                flex-direction: column;
                position: absolute;
                top: 100%; left: 0; width: 100%;
                background-color: var(--navy-primary);
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                padding: 10px 0; z-index: 999;
            }
            nav#main-nav.active { display: flex !important; }
            nav#main-nav a { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: normal !important; }
        }
    </style>

    <header>
        <div class="logo-container">
            <button id="mobile-menu-btn" class="hamburger-btn">☰</button>
            <h1 onclick="window.location.href='index.html'" style="cursor: pointer;" title="Về trang chủ">ATherapyHub</h1>
            <nav id="main-nav"></nav>
        </div>
        
        <!-- Thanh tìm kiếm -->
        <div class="header-search">
            <span class="search-icon">🔍</span>
            <input type="text" id="global-search-input" placeholder="Tìm kiếm bài viết...">
        </div>

        <div class="user-controls">
            <!-- Đổi thành thẻ <a> để click chuyển sang trang Thông tin cá nhân -->
            <a href="thong_tin_ca_nhan.html" id="user-email-display" class="hidden" title="Quản lý thông tin cá nhân"></a>
            <button id="logout-btn" class="btn-logout hidden">Đăng xuất</button>
            <button id="open-login-modal" class="btn-login-nav">Đăng nhập</button>
        </div>
    </header>

    <div id="login-modal" class="modal-overlay">
        <div class="modal-box">
            <button id="close-login-modal" class="btn-close-modal">&times;</button>
            <h2 id="modal-title">Đăng nhập</h2>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="auth-email" placeholder="Nhập email của bạn" required>
            </div>
            <div class="form-group" id="password-group">
                <label>Mật khẩu</label>
                <input type="password" id="auth-password" placeholder="Nhập mật khẩu (từ 6 ký tự)" required>
            </div>
            
            <button id="auth-main-btn" class="btn-primary">Đăng nhập</button>
            <div id="error-msg" style="color: var(--danger); text-align: center; margin-top: 16px; font-size: 14px;"></div>
            
            <div class="auth-links">
                <a id="link-register">Đăng ký tài khoản mới</a>
                <span id="auth-separator">|</span>
                <a id="link-forgot">Quên mật khẩu?</a>
                <a id="link-back-login" style="display:none;">← Quay lại Đăng nhập</a>
            </div>
        </div>
    </div>
`;

// =========================================================
// 2. TẠO CẤU TRÚC HTML CHO FOOTER
// =========================================================
const footerHTML = `
    <footer>
        &copy; ATherapyHub 2026.
    </footer>
`;

// =========================================================
// 3. CHÈN HEADER VÀ FOOTER VÀO TRANG (GẮN VÀO THẺ BODY)
// =========================================================
document.body.insertAdjacentHTML('afterbegin', headerHTML);
document.body.insertAdjacentHTML('beforeend', footerHTML);

// =========================================================
// 4. LẤY DỮ LIỆU MENU TỪ FILE HEADER.JSON
// =========================================================
const navContainer = document.getElementById('main-nav');
fetch('./json/header.json')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
        data.forEach(item => {
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            navContainer.appendChild(a);
        });
    })
    .catch(() => navContainer.innerHTML = `<a href="index.html">Trang chủ</a>`);

// =========================================================
// 5. XỬ LÝ GIAO DIỆN VÀ LOGIC
// =========================================================

// Menu 3 gạch cho Mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
mobileMenuBtn.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});

// Tìm kiếm
const globalSearchInput = document.getElementById('global-search-input');
globalSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const keyword = globalSearchInput.value.trim();
        if (keyword) {
            window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
        }
    }
});

// Logic Firebase & Modal Xác thực
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-modal');
const closeLoginBtn = document.getElementById('close-login-modal');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');
const errorMsg = document.getElementById('error-msg');

// Các thành phần trong Modal
let currentAuthMode = 'login'; // 'login', 'register', 'forgot'
const modalTitle = document.getElementById('modal-title');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const passGroup = document.getElementById('password-group');
const authMainBtn = document.getElementById('auth-main-btn');
const linkRegister = document.getElementById('link-register');
const linkForgot = document.getElementById('link-forgot');
const linkBackLogin = document.getElementById('link-back-login');
const authSeparator = document.getElementById('auth-separator');

// Hàm chuyển đổi giao diện Modal
function switchAuthMode(mode) {
    currentAuthMode = mode;
    errorMsg.textContent = '';
    errorMsg.style.color = 'var(--danger)';

    if (mode === 'login') {
        modalTitle.textContent = 'Đăng nhập';
        passGroup.style.display = 'block';
        authMainBtn.textContent = 'Đăng nhập';
        linkRegister.style.display = 'inline-block';
        linkForgot.style.display = 'inline-block';
        authSeparator.style.display = 'inline-block';
        linkBackLogin.style.display = 'none';
    } else if (mode === 'register') {
        modalTitle.textContent = 'Đăng ký tài khoản';
        passGroup.style.display = 'block';
        authMainBtn.textContent = 'Đăng ký';
        linkRegister.style.display = 'none';
        linkForgot.style.display = 'none';
        authSeparator.style.display = 'none';
        linkBackLogin.style.display = 'inline-block';
    } else if (mode === 'forgot') {
        modalTitle.textContent = 'Khôi phục mật khẩu';
        passGroup.style.display = 'none';
        authMainBtn.textContent = 'Gửi email khôi phục';
        linkRegister.style.display = 'none';
        linkForgot.style.display = 'none';
        authSeparator.style.display = 'none';
        linkBackLogin.style.display = 'inline-block';
    }
}

// Bắt sự kiện chuyển đổi chế độ
linkRegister.addEventListener('click', () => switchAuthMode('register'));
linkForgot.addEventListener('click', () => switchAuthMode('forgot'));
linkBackLogin.addEventListener('click', () => switchAuthMode('login'));

openLoginBtn.addEventListener('click', () => {
    switchAuthMode('login');
    loginModal.style.display = 'flex';
});
closeLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');

// Giữ trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        openLoginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userEmailDisplay.textContent = user.email;
        userEmailDisplay.classList.remove('hidden');
    } else {
        logoutBtn.classList.add('hidden');
        userEmailDisplay.classList.add('hidden');
        userEmailDisplay.textContent = '';
        openLoginBtn.classList.remove('hidden');
    }
});

// Xử lý Gửi Form (Đăng nhập / Đăng ký / Quên mật khẩu)
authMainBtn.addEventListener('click', () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email) {
        errorMsg.textContent = "Vui lòng nhập Email!";
        return;
    }

    errorMsg.style.color = 'var(--danger)';
    errorMsg.textContent = "Đang xử lý...";

    if (currentAuthMode === 'login') {
        if (!password) return errorMsg.textContent = "Vui lòng nhập mật khẩu!";
        
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                errorMsg.textContent = "";
                loginModal.style.display = 'none';
                authEmail.value = ''; authPassword.value = '';
            })
            .catch(() => {
                errorMsg.textContent = "Sai email hoặc mật khẩu!";
            });

    } else if (currentAuthMode === 'register') {
        if (!password) return errorMsg.textContent = "Vui lòng nhập mật khẩu!";
        if (password.length < 6) return errorMsg.textContent = "Mật khẩu phải từ 6 ký tự!";
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                errorMsg.textContent = "";
                loginModal.style.display = 'none';
                authEmail.value = ''; authPassword.value = '';
                alert("Đăng ký thành công! Hãy vào Thông tin cá nhân để đặt Tên hiển thị.");
                window.location.href = 'thong_tin_ca_nhan.html';
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    errorMsg.textContent = "Email này đã được sử dụng!";
                } else {
                    errorMsg.textContent = "Lỗi đăng ký: " + err.message;
                }
            });

    } else if (currentAuthMode === 'forgot') {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                errorMsg.style.color = "#03543F";
                errorMsg.textContent = "Đã gửi link khôi phục! Vui lòng kiểm tra hộp thư email.";
            })
            .catch(() => {
                errorMsg.textContent = "Lỗi: Không tìm thấy tài khoản với email này!";
            });
    }
});

authPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') authMainBtn.click();
});

logoutBtn.addEventListener('click', () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        signOut(auth);
        // Tùy chọn: Chuyển về trang chủ nếu đang ở trang cá nhân
        if(window.location.pathname.includes('thong_tin_ca_nhan.html')) {
            window.location.href = 'index.html';
        }
    }
});
