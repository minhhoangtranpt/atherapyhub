// firebase-config.js

// 1. Nhập các module Firebase cốt lõi từ CDN (Phiên bản 12.17.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";

// 2. Nhập các module cho tính năng Đăng nhập (Authentication)
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// 3. Nhập các module cho Cơ sở dữ liệu (Firestore)
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Cấu hình ứng dụng web QHphysio của bạn
const firebaseConfig = {
    apiKey: "AIzaSyA9X9Ot7qA88POY2JmsRaQuagvRq2M83Aw",
    authDomain: "qhphysio.firebaseapp.com",
    projectId: "qhphysio",
    storageBucket: "qhphysio.firebasestorage.app",
    messagingSenderId: "1074697284977",
    appId: "1:1074697284977:web:8f4d73f7fca0a2ea09dad0",
    measurementId: "G-LF28MQDWKG"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất (export) các biến và hàm này để các trang HTML khác gọi được
export { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    collection, 
    addDoc, 
    getDocs 
};
