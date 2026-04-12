// ไฟล์: Assets/JS/firebase-config.js

// 1. นำเข้าคำสั่งของ Firebase จาก CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove, push, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. ใส่ URL ของฐานข้อมูลที่คุณเพิ่งสร้าง
const firebaseConfig = {
  // ⚠️ เปลี่ยนลิงก์ด้านล่างให้เป็น URL ของคุณ (อย่าลืมเครื่องหมายคำพูด "")
  databaseURL: "https://pharmatoolsthailand-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// 3. เริ่มต้นเปิดการเชื่อมต่อ
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ส่งออกคำสั่งต่างๆ ไปให้ไฟล์อื่นใช้งาน
export { db, ref, set, onValue, remove, push, get, child };