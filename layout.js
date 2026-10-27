// Tự động chèn Logo lên thanh trình duyệt cho mọi trang
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/jpeg';
favicon.href = 'logo.jpg';
document.head.appendChild(favicon);
// =========================================================
// 0. KHỞI TẠO FIREBASE VÀ IMPORT CÁC HÀM CẦN THIẾT
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    sendEmailVerification,
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
    <style>
        .hamburger-btn { display: none; background: none; border: none; font-size: 26px; color: white; cursor: pointer; margin-right: 15px; padding: 0; line-height: 1; }
        #user-email-display { text-decoration: underline; cursor: pointer; font-weight: 600; color: var(--navy-light); }
        #user-email-display:hover { color: white; }
        
        .auth-links { margin-top: 20px; text-align: center; font-size: 13.5px; border-top: 1px solid var(--border-color); padding-top: 15px; }
        .auth-links a { color: var(--accent-blue); cursor: pointer; margin: 0 8px; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .auth-links a:hover { text-decoration: underline; color: var(--navy-primary); }

        .desktop-nav-group { display: flex; align-items: center; gap: 20px; }

        @media (max-width: 768px) {
            .hamburger-btn { display: block; }
            header { flex-direction: row !important; flex-wrap: wrap !important; position: relative !important; align-items: center !important; }
            header .logo-container { width: auto !important; flex: 1 !important; flex-direction: row !important; align-items: center !important; gap: 10px !important; }
            .header-search { order: 3 !important; margin: 15px 0 0 0 !important; flex-basis: 100% !important; max-width: 100% !important; }
            
            /* Nhóm menu và xác thực thả xuống */
            .desktop-nav-group {
                display: none !important; 
                flex-direction: column !important;
                position: absolute !important;
                top: 100% !important; left: 0 !important; width: 100% !important;
                background-color: var(--navy-primary) !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important;
                padding: 0 !important; z-index: 999 !important;
                align-items: stretch !important; gap: 0 !important;
            }
            .desktop-nav-group.active { display: flex !important; }
            
            nav#main-nav { flex-direction: column !important; gap: 0 !important; overflow: visible !important; }
            nav#main-nav a { padding: 15px 20px !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; white-space: normal !important; display: block !important; }
            
            /* Đưa user-controls vào bên trong menu thả xuống */
            .user-controls { 
                position: static !important; 
                padding: 15px 20px !important; 
                flex-direction: column !important; 
                align-items: flex-start !important; 
                gap: 15px !important; 
                background: rgba(0,0,0,0.1) !important; 
            }
            .user-controls .btn-login-nav, .user-controls .btn-logout { width: 100% !important; justify-content: center !important; }
            #user-email-display { display: block !important; max-width: 100% !important; white-space: normal !important; font-size: 14px !important; }
        }
    </style>

    <header>
        <div class="logo-container">
            <button id="mobile-menu-btn" class="hamburger-btn">☰</button>
            <h1 onclick="window.location.href='index.html'" style="cursor: pointer;" title="Về trang chủ">ATherapyHub</h1>
        </div>
        
        <div class="header-search">
            <span class="search-icon">🔍</span>
            <input type="text" id="global-search-input" placeholder="Tìm kiếm bài viết...">
        </div>

        <div id="desktop-nav-group" class="desktop-nav-group">
            <nav id="main-nav"></nav>
            <div class="user-controls">
                <a href="thong_tin_ca_nhan.html" id="user-email-display" class="hidden" title="Quản lý thông tin cá nhân"></a>
                <button id="logout-btn" class="btn-logout hidden">Đăng xuất</button>
                <button id="open-login-modal" class="btn-login-nav">Đăng nhập</button>
            </div>
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
            <div class="form-group" id="confirm-password-group" style="display: none;">
                <label>Xác nhận mật khẩu</label>
                <input type="password" id="auth-confirm-password" placeholder="Nhập lại mật khẩu" required>
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
        &copy; ATherapyHub 2026
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

// Xử lý Menu 3 gạch trên Mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const desktopNavGroup = document.getElementById('desktop-nav-group');
mobileMenuBtn.addEventListener('click', () => {
    desktopNavGroup.classList.toggle('active');
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

let currentAuthMode = 'login'; 
const modalTitle = document.getElementById('modal-title');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authConfirmPassword = document.getElementById('auth-confirm-password');
const passGroup = document.getElementById('password-group');
const confirmPassGroup = document.getElementById('confirm-password-group');
const authMainBtn = document.getElementById('auth-main-btn');
const linkRegister = document.getElementById('link-register');
const linkForgot = document.getElementById('link-forgot');
const linkBackLogin = document.getElementById('link-back-login');
const authSeparator = document.getElementById('auth-separator');

function switchAuthMode(mode) {
    currentAuthMode = mode;
    errorMsg.textContent = '';
    errorMsg.style.color = 'var(--danger)';

    if (mode === 'login') {
        modalTitle.textContent = 'Đăng nhập';
        passGroup.style.display = 'block';
        confirmPassGroup.style.display = 'none';
        authMainBtn.textContent = 'Đăng nhập';
        linkRegister.style.display = 'inline-block';
        linkForgot.style.display = 'inline-block';
        authSeparator.style.display = 'inline-block';
        linkBackLogin.style.display = 'none';
    } else if (mode === 'register') {
        modalTitle.textContent = 'Đăng ký tài khoản';
        passGroup.style.display = 'block';
        confirmPassGroup.style.display = 'block';
        authMainBtn.textContent = 'Đăng ký';
        linkRegister.style.display = 'none';
        linkForgot.style.display = 'none';
        authSeparator.style.display = 'none';
        linkBackLogin.style.display = 'inline-block';
    } else if (mode === 'forgot') {
        modalTitle.textContent = 'Khôi phục mật khẩu';
        passGroup.style.display = 'none';
        confirmPassGroup.style.display = 'none';
        authMainBtn.textContent = 'Gửi email khôi phục';
        linkRegister.style.display = 'none';
        linkForgot.style.display = 'none';
        authSeparator.style.display = 'none';
        linkBackLogin.style.display = 'inline-block';
    }
}

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
    if (user && user.emailVerified) {
        openLoginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userEmailDisplay.textContent = user.email;
        userEmailDisplay.classList.remove('hidden');
    } else {
        if (user && !user.emailVerified) {
            signOut(auth);
        }
        logoutBtn.classList.add('hidden');
        userEmailDisplay.classList.add('hidden');
        userEmailDisplay.textContent = '';
        openLoginBtn.classList.remove('hidden');
    }
});

// Xử lý Form Xác thực
authMainBtn.addEventListener('click', () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    const confirmPassword = authConfirmPassword.value;

    if (!email) {
        errorMsg.textContent = "Vui lòng nhập Email!";
        return;
    }

    errorMsg.style.color = 'var(--danger)';
    errorMsg.textContent = "Đang xử lý...";

    if (currentAuthMode === 'login') {
        if (!password) return errorMsg.textContent = "Vui lòng nhập mật khẩu!";
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (!user.emailVerified) {
                    signOut(auth);
                    errorMsg.textContent = "Vui lòng xác thực email của bạn trước khi đăng nhập. Hãy kiểm tra hộp thư đến (hoặc mục Spam).";
                } else {
                    errorMsg.textContent = "";
                    loginModal.style.display = 'none';
                    authEmail.value = ''; authPassword.value = '';
                }
            })
            .catch(() => {
                errorMsg.textContent = "Sai email hoặc mật khẩu!";
            });

    } else if (currentAuthMode === 'register') {
        if (!password) return errorMsg.textContent = "Vui lòng nhập mật khẩu!";
        if (password.length < 6) return errorMsg.textContent = "Mật khẩu phải từ 6 ký tự!";
        if (password !== confirmPassword) return errorMsg.textContent = "Mật khẩu xác nhận không khớp!";
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user).then(() => {
                    signOut(auth); 
                    errorMsg.style.color = "#03543F";
                    errorMsg.textContent = "Đăng ký thành công! Vui lòng kiểm tra email (cả mục Spam) để xác thực tài khoản trước khi đăng nhập.";
                    authPassword.value = '';
                    authConfirmPassword.value = '';
                });
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
    if (e.key === 'Enter' && currentAuthMode === 'login') authMainBtn.click();
});

authConfirmPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && currentAuthMode === 'register') authMainBtn.click();
});

logoutBtn.addEventListener('click', () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        signOut(auth);
        if(window.location.pathname.includes('thong_tin_ca_nhan.html')) {
            window.location.href = 'index.html';
        }
    }
});
