// นำเข้าการเชื่อมต่อฐานข้อมูลจากไฟล์ที่เราสร้างไว้
import { db, ref, onValue } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ฟังก์ชันวาดการ์ด (Render HTML) ---
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

    // --- 2. ดึงข้อมูลจาก Firebase แบบ Real-time ---
    const toolsRef = ref(db, 'tools');

    // onValue จะทำงานทันทีเมื่อเปิดเว็บ และทำงานทุกครั้งที่ข้อมูลในฐานข้อมูลเปลี่ยน
    onValue(toolsRef, (snapshot) => {
        const data = snapshot.val();

        // เตรียมพื้นที่หน้าเว็บ
        const clinicalContainer = document.getElementById('clinical-tools');
        const patientContainer = document.getElementById('patient-tools');
        const devContainer = document.getElementById('dev-tools');

        // ล้างข้อมูลเก่าบนหน้าจอก่อน (เพื่อวาดใหม่)
        clinicalContainer.innerHTML = '';
        patientContainer.innerHTML = '';
        devContainer.innerHTML = '';

        // ถ้ามีข้อมูลในฐานข้อมูล ให้นำมาวาดเป็นการ์ด
        if (data) {
            // หมวดคลินิก
            if (data.clinical) {
                Object.values(data.clinical).forEach(tool => {
                    clinicalContainer.innerHTML += renderCard(tool);
                });
            }
            // หมวดผู้ป่วย
            if (data.patient) {
                Object.values(data.patient).forEach(tool => {
                    patientContainer.innerHTML += renderCard(tool);
                });
            }
            // หมวดกำลังพัฒนา
            if (data.dev) {
                Object.values(data.dev).forEach(tool => {
                    devContainer.innerHTML += renderDevCard(tool);
                });
            }
        } else {
            // กรณีฐานข้อมูลว่างเปล่า
            clinicalContainer.innerHTML = '<p class="text-slate-400">ยังไม่มีเครื่องมือในหมวดนี้</p>';
            patientContainer.innerHTML = '<p class="text-slate-400">ยังไม่มีเครื่องมือในหมวดนี้</p>';
            devContainer.innerHTML = '<p class="text-slate-400">ยังไม่มีเครื่องมือในหมวดนี้</p>';
        }
    });
});

// --- 3. ระบบจัดการ Modal วิธีติดตั้ง (คงไว้เหมือนเดิม) ---
const installData = {
    ios: { icon: "fa-apple text-slate-700", text: ["เปิดเว็บไซต์ผ่านเบราว์เซอร์ <b>Safari</b>", "แตะไอคอน <b>Share</b>", "เลือก <b>'Add to Home Screen'</b>", "แตะ <b>'Add'</b>"] },
    android: { icon: "fa-android text-green-500", text: ["เปิดเว็บไซต์ผ่าน <b>Chrome</b>", "แตะไอคอน <b>เมนู 3 จุด</b>", "เลือก <b>'Install App'</b>", "กดยืนยัน <b>'Install'</b>"] },
    pc: { icon: "fa-desktop text-blue-500", text: ["เปิดเว็บไซต์ผ่าน <b>Chrome หรือ Edge</b>", "คลิกไอคอน <b>ติดตั้ง (Install)</b> ที่แถบ URL", "คลิก <b>'Install'</b>"] }
};

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

window.openModal = (os) => {
    document.getElementById('modal-title').innerHTML = `<i class="fa-brands ${installData[os].icon} mr-2"></i> วิธีติดตั้ง`;
    document.getElementById('modal-steps').innerHTML = installData[os].text.map(step => `<li>${step}</li>`).join('');
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
};

window.closeModal = () => {
    modal.classList.add('opacity-0'); modalContent.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};