// =========================================================
// 0. KHỞI TẠO FIREBASE
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
    <header>
        <div class="logo-container">
            <h1 onclick="window.location.href='index.html'" style="cursor: pointer;" title="Về trang chủ">ATherapyHub</h1>
            <nav id="main-nav"></nav>
        </div>
        
        <!-- Thanh tìm kiếm hiển thị cố định -->
        <div class="header-search">
            <span class="search-icon">🔍</span>
            <input type="text" id="global-search-input" placeholder="Tìm kiếm bài viết...">
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
            <h2>Đăng nhập</h2>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" placeholder="Nhập email" required>
            </div>
            <div class="form-group">
                <label>Mật khẩu</label>
                <input type="password" id="password" placeholder="Nhập mật khẩu" required>
            </div>
            <button id="login-btn" class="btn-primary">Đăng nhập</button>
            <div id="error-msg" style="color: var(--danger); text-align: center; margin-top: 16px; font-size: 14px;"></div>
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

// Xử lý sự kiện khi ấn Enter ở ô Tìm Kiếm chuyển sang trang search.html
const globalSearchInput = document.getElementById('global-search-input');
globalSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const keyword = globalSearchInput.value.trim();
        if (keyword) {
            window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
        }
    }
});

// Logic Firebase & Modal Đăng Nhập
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-modal');
const closeLoginBtn = document.getElementById('close-login-modal');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');
const errorMsg = document.getElementById('error-msg');

openLoginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
closeLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');

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

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (email && password) {
        errorMsg.textContent = "Đang xử lý...";
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                errorMsg.textContent = "";
                loginModal.style.display = 'none';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            })
            .catch(() => {
                errorMsg.textContent = "Sai email hoặc mật khẩu!";
            });
    } else {
        errorMsg.textContent = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
    }
});

document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

logoutBtn.addEventListener('click', () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        signOut(auth);
    }
});
