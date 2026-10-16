/* Thêm đoạn reset này lên đầu file style.css nếu chưa có */
* {
    box-sizing: border-box;
}

/* ================= MODAL ================= */
.modal-overlay { 
    display: none; 
    position: fixed; 
    inset: 0; 
    background: rgba(10, 37, 64, 0.6); 
    backdrop-filter: blur(4px); 
    justify-content: center; 
    align-items: center; 
    z-index: 1000; 
    padding: 20px; 
}

.modal-box { 
    background: var(--bg-card); 
    padding: 32px; 
    border-radius: 24px; 
    width: 100%; 
    max-width: 380px; 
    max-height: 90vh;      /* Ngăn chặn tràn khung theo chiều dọc trên điện thoại */
    overflow-y: auto;      /* Hiển thị thanh cuộn bên trong nếu màn hình quá thấp */
    position: relative; 
    box-sizing: border-box; /* Bắt buộc để padding không làm phình to box */
}

.modal-box h2 { text-align: center; color: var(--navy-primary); margin-top: 0; margin-bottom: 24px; font-size: 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; }

.form-group input { 
    width: 100%; 
    padding: 12px 16px; 
    border: 1px solid var(--border-color); 
    border-radius: 12px; 
    font-size: 15px; 
    box-sizing: border-box; /* Ép input không được tràn ra ngoài thẻ cha */
}

.btn-primary { width: 100%; padding: 14px; background-color: var(--navy-primary); color: white; font-size: 15px; border-radius: 12px; margin-top: 10px; border: none; cursor: pointer; }
.btn-primary:hover { background-color: var(--navy-secondary); }
.btn-close-modal { position: absolute; top: 16px; right: 16px; background: #F3F4F6; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
