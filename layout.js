// 1. Tạo HTML cho Header và Modal
const headerHTML = `
    <header>
        <div class="logo-container">
            <h1 onclick="window.location.href='index.html'">ATherapyHub</h1>
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

// 2. Tạo HTML cho Footer
const footerHTML = `
    <footer>
        &copy; ATherapyHub 2026. Diễn đàn Học thuật & Lâm sàng cho Nhà trị liệu.
    </footer>
`;

// 3. Chèn Header vào đầu thẻ <body> và Footer vào cuối thẻ <body>
document.body.insertAdjacentHTML('afterbegin', headerHTML);
document.body.insertAdjacentHTML('beforeend', footerHTML);

// 4. Render Menu từ JSON (Giả lập)
const mockHeaderData = [
    { "title": "Trang chủ", "url": "index.html" },
    { "title": "Lâm sàng", "url": "clinical.html" },
    { "title": "Học thuật", "url": "academic.html" }
];

const navContainer = document.getElementById('main-nav');
mockHeaderData.forEach(item => {
    const a = document.createElement('a');
    a.href = item.url;
    a.textContent = item.title;
    navContainer.appendChild(a);
});

/* Dùng cho sau này khi có file JSON thật trên server:
fetch('./json/header.json').then(res => res.json()).then(data => {
    data.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url; a.textContent = item.title;
        navContainer.appendChild(a);
    });
});
*/

// 5. Logic Modal & Đăng nhập
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-modal');
const closeLoginBtn = document.getElementById('close-login-modal');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');

openLoginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
closeLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');

loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    if(email) {
        loginModal.style.display = 'none';
        openLoginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userEmailDisplay.textContent = email;
        userEmailDisplay.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => {
    logoutBtn.classList.add('hidden');
    userEmailDisplay.classList.add('hidden');
    openLoginBtn.classList.remove('hidden');
});
