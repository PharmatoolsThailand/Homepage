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

// --- 3. ระบบ Modal ติดตั้งแอป (Install Guide) ---
const installData = {
    ios: { icon: "fa-apple text-slate-700", text: ["เปิด Safari", "แตะไอคอน Share (แชร์) ด้านล่าง", "เลือก Add to Home Screen (เพิ่มไปยังหน้าจอโฮม)", "กด Add (เพิ่ม)"] },
    android: { icon: "fa-android text-green-500", text: ["เปิด Chrome", "แตะเมนู 3 จุด มุมขวาบน", "เลือก Install App (ติดตั้งแอป) หรือ Add to Home Screen", "กด ติดตั้ง"] },
    pc: { icon: "fa-desktop text-blue-500", text: ["เปิด Chrome / Edge", "คลิกไอคอนติดตั้ง หรือเมนู 3 จุดที่มุมขวาบน", "เลือก Install (ติดตั้ง) หรือ Apps > Install"] }
};

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

// ฟังก์ชันเปิด Modal
window.openModal = (os) => {
    document.getElementById('modal-title').innerHTML = `<i class="fa-brands ${installData[os].icon} mr-2"></i> วิธีติดตั้งบน ${os.toUpperCase()}`;
    document.getElementById('modal-steps').innerHTML = installData[os].text.map(step => `<li>${step}</li>`).join('');
    modal.classList.remove('hidden');

    // หน่วงเวลาเล็กน้อยเพื่อให้ Animation Transition ทำงาน
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
};

// ฟังก์ชันปิด Modal
window.closeModal = () => {
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

// ปิดเมื่อคลิกพื้นที่ว่างด้านนอกกรอบ
modal?.addEventListener('click', (e) => e.target === modal && closeModal());