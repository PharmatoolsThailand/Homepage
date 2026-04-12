// Assets/JS/script.js
import { db, ref, get, child } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ฟังก์ชันวาดการ์ด (UI Renderers) ---
    const renderCard = (t) => `
        <a href="${t.link || '#'}" class="tool-card">
            <div class="icon-box w-14 h-14 ${t.bg} rounded-xl flex items-center justify-center ${t.color} text-3xl mb-5 shadow-sm">
                <i class="fa-solid ${t.icon}"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 text-slate-800">${t.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${t.desc}</p>
        </a>`;

    const renderDevCard = (t) => `
        <div class="dev-card">
            <span class="absolute top-4 right-4 bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">Dev</span>
            <div class="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-3xl mb-5">
                <i class="fa-solid ${t.icon}"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 text-slate-500">${t.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">${t.desc}</p>
        </div>`;

    // --- 2. ดึงข้อมูลแบบ Optimized (เรียกครั้งเดียวตอนโหลดหน้าจอ) ---
    const dbRef = ref(db);

    get(child(dbRef, 'tools')).then((snapshot) => {
        const data = snapshot.val();

        const clinicalContainer = document.getElementById('clinical-tools');
        const patientContainer = document.getElementById('patient-tools');
        const devContainer = document.getElementById('dev-tools');

        if (snapshot.exists()) {
            // ดึงข้อมูลและวาดการ์ดลงในแต่ละหมวดหมู่
            if (data.clinical) {
                clinicalContainer.innerHTML = Object.values(data.clinical).map(renderCard).join('');
            }
            if (data.patient) {
                patientContainer.innerHTML = Object.values(data.patient).map(renderCard).join('');
            }
            if (data.dev) {
                devContainer.innerHTML = Object.values(data.dev).map(renderDevCard).join('');
            }
            console.log("Data fetched successfully.");
        } else {
            clinicalContainer.innerHTML = '<p class="text-slate-400">ยังไม่มีข้อมูลเครื่องมือในระบบ</p>';
        }
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
});

// --- 3. ระบบ PWA Install อัตโนมัติ ---

let deferredPrompt;

// ดักจับ Event เมื่อเบราว์เซอร์พร้อมให้ติดตั้ง (ทำงานบน Android และ Chrome/Edge PC)
window.addEventListener('beforeinstallprompt', (e) => {
    // ป้องกันเบราว์เซอร์แสดง popup เล็กๆ ของตัวเอง
    e.preventDefault();
    // เก็บ Event ไว้ใช้เมื่อผู้ใช้กดปุ่ม
    deferredPrompt = e;
});

window.installApp = async (os) => {
    // 1. กรณีเป็น Android หรือ PC และระบบพร้อมให้ติดตั้ง
    if ((os === 'android' || os === 'pc') && deferredPrompt) {
        // สั่งเปิดหน้าต่างติดตั้งของระบบ
        deferredPrompt.prompt();

        // รอผู้ใช้กดยืนยัน หรือ ยกเลิก
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // ล้างค่า Event หลังจากใช้งานเสร็จ
        deferredPrompt = null;
    }
    // 2. กรณีเป็น iOS (Apple ไม่รองรับคำสั่งติดตั้งอัตโนมัติ)
    else if (os === 'ios') {
        alert('สำหรับ iOS:\nกรุณาแตะไอคอน Share (แชร์) ที่แถบด้านล่าง\nแล้วเลือก "Add to Home Screen" (เพิ่มไปยังหน้าจอโฮม)');
    }
    // 3. กรณีติดตั้งไปแล้ว หรือ เปิดบนเบราว์เซอร์ที่ไม่รองรับ / ยังไม่เป็น PWA เต็มรูปแบบ
    else {
        alert('อุปกรณ์นี้อาจติดตั้งแอปไว้แล้ว หรือเบราว์เซอร์ไม่รองรับการติดตั้งอัตโนมัติ\n(บน PC สามารถกดไอคอนติดตั้งที่แถบ URL ด้านขวาบนได้เลย)');
    }
};