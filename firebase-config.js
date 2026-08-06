// firebase-config.js

// 1. Nhập module Firebase cốt lõi (Phiên bản 12.17.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

// 2. Nhập module Đăng nhập (Auth)
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// 3. Nhập module Cơ sở dữ liệu (Firestore)
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// 4. Cấu hình dự án QHphysio của bạn
const firebaseConfig = {
    apiKey: "AIzaSyA9X9Ot7qA88POY2JmsRaQuagvRq2M83Aw",
    authDomain: "qhphysio.firebaseapp.com",
    projectId: "qhphysio",
    storageBucket: "qhphysio.firebasestorage.app",
    messagingSenderId: "1074697284977",
    appId: "1:1074697284977:web:8f4d73f7fca0a2ea09dad0",
    measurementId: "G-LF28MQDWKG" 
    // measurementId được giữ lại trong chuỗi cấu hình, nhưng chúng ta không gọi getAnalytics() nên sẽ không bị lỗi AdBlock.
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ cần thiết
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất các biến và hàm này để index.html, dashboard.html và admin.html có thể tái sử dụng
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
