document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Database ข้อมูลเครื่องมือ ---
    const tools = {
        clinical: [
            { title: "Medication Timeline", desc: "สร้างกราฟิกประวัติการใช้ยา เพื่อวิเคราะห์ความร่วมมือและสนับสนุนงาน Medication Reconciliation", icon: "fa-timeline", bg: "bg-indigo-100", color: "text-indigo-600", link: "#" },
            { title: "Warfarin Calculator", desc: "เครื่องมือช่วยคำนวณและปรับขนาดยา Warfarin พร้อมคาดการณ์ค่า INR อย่างปลอดภัย", icon: "fa-heart-pulse", bg: "bg-rose-100", color: "text-rose-600", link: "#" }
        ],
        patient: [
            { title: "คำนวณวันยาหมด", desc: "เครื่องมือช่วยคำนวณวันที่ยาจะหมด เพื่อวางแผนการมารับยาต่อเนื่องได้อย่างถูกต้อง", icon: "fa-calendar-check", bg: "bg-emerald-100", color: "text-emerald-600", link: "#" },
            { title: "สมุดบันทึกยาประจำตัว", desc: "จดบันทึกรายการยาที่ใช้อยู่ในปัจจุบัน รวมถึงประวัติการแพ้ยาเพื่อสื่อสารกับแพทย์", icon: "fa-notes-medical", bg: "bg-amber-100", color: "text-amber-600", link: "#" }
        ],
        dev: [
            { title: "Complex Drug Titration", desc: "แนวทางการปรับขนาดยาทางหลอดเลือดดำ สำหรับกลุ่มยารักษาโรคที่มีความซับซ้อน", icon: "fa-syringe" },
            { title: "Vancomycin Dosing", desc: "ระบบประเมินขนาดยา Vancomycin ที่เหมาะสมตามค่าการทำงานของไต", icon: "fa-vial" }
        ]
    };

    // --- 2. ฟังก์ชันสร้างการ์ด HTML ---
    const renderCard = (t) => `
        <a href="${t.link}" class="tool-card">
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

    document.getElementById('clinical-tools').innerHTML = tools.clinical.map(renderCard).join('');
    document.getElementById('patient-tools').innerHTML = tools.patient.map(renderCard).join('');
    document.getElementById('dev-tools').innerHTML = tools.dev.map(renderDevCard).join('');
});

// --- 3. ระบบจัดการ Modal วิธีติดตั้ง ---
const installData = {
    ios: { icon: "fa-apple text-slate-700", text: ["เปิดเว็บไซต์ Pharmatools ผ่านเบราว์เซอร์ <b>Safari</b>", "แตะไอคอน <b>Share (แชร์)</b> <i class='fa-solid fa-arrow-up-from-bracket mx-1 text-blue-500'></i> ที่แถบเมนู", "เลือก <b>'Add to Home Screen' (เพิ่มไปยังหน้าจอโฮม)</b>", "ตรวจสอบชื่อแล้วแตะ <b>'Add' (เพิ่ม)</b>"] },
    android: { icon: "fa-android text-green-500", text: ["เปิดเว็บไซต์ Pharmatools ผ่าน <b>Google Chrome</b>", "แตะไอคอน <b>เมนู 3 จุด</b> <i class='fa-solid fa-ellipsis-vertical mx-1 text-slate-500'></i>", "เลือก <b>'Install App'</b> หรือ <b>'Add to Home Screen'</b>", "กดยืนยันคำว่า <b>'Install' (ติดตั้ง)</b>"] },
    pc: { icon: "fa-desktop text-blue-500", text: ["เปิดเว็บไซต์ Pharmatools ผ่าน <b>Chrome หรือ Edge</b>", "สังเกตที่ <b>แถบ URL (ช่องพิมพ์ชื่อเว็บ)</b>", "คลิกที่ไอคอน <b>ติดตั้ง (Install)</b> <i class='fa-solid fa-download mx-1 text-slate-500'></i>", "คลิก <b>'Install' (ติดตั้ง)</b>"] }
};

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

window.openModal = (os) => {
    document.getElementById('modal-title').innerHTML = `<i class="fa-brands ${installData[os].icon} mr-2"></i> วิธีติดตั้งบนระบบ ${os.toUpperCase()}`;
    document.getElementById('modal-steps').innerHTML = installData[os].text.map(step => `<li>${step}</li>`).join('');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
};

window.closeModal = () => {
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

modal.addEventListener('click', (e) => e.target === modal && closeModal());