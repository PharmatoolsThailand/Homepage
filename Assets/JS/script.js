// นำเข้าเฉพาะสิ่งที่จำเป็นเพื่อความลีน
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

    // --- 2. ดึงข้อมูลแบบ Optimized (เรียกครั้งเดียวแล้วตัด Connection) ---
    const dbRef = ref(db);

    get(child(dbRef, 'tools')).then((snapshot) => {
        const data = snapshot.val();

        const clinicalContainer = document.getElementById('clinical-tools');
        const patientContainer = document.getElementById('patient-tools');
        const devContainer = document.getElementById('dev-tools');

        if (snapshot.exists()) {
            // ดึงข้อมูลและวาดการ์ด
            if (data.clinical) {
                clinicalContainer.innerHTML = Object.values(data.clinical).map(renderCard).join('');
            }
            if (data.patient) {
                patientContainer.innerHTML = Object.values(data.patient).map(renderCard).join('');
            }
            if (data.dev) {
                devContainer.innerHTML = Object.values(data.dev).map(renderDevCard).join('');
            }
            console.log("Data fetched and connection closed.");
        } else {
            clinicalContainer.innerHTML = '<p class="text-slate-400">ไม่มีข้อมูลเครื่องมือ</p>';
        }
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
});

// --- 3. ระบบ Modal ติดตั้งแอป (คงเดิม) ---
const installData = {
    ios: { icon: "fa-apple text-slate-700", text: ["เปิด Safari", "แตะไอคอน Share", "เลือก Add to Home Screen", "กด Add"] },
    android: { icon: "fa-android text-green-500", text: ["เปิด Chrome", "แตะเมนู 3 จุด", "เลือก Install App", "กดติดตั้ง"] },
    pc: { icon: "fa-desktop text-blue-500", text: ["เปิด Chrome / Edge", "คลิกไอคอนติดตั้งที่แถบ URL", "กด Install"] }
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

modal?.addEventListener('click', (e) => e.target === modal && closeModal());

// เพิ่มตัวแปรสถานะไว้ด้านบนของสคริปต์
let isEditing = false;
let editingId = null;
let editingCat = null;

// 1. ปรับปรุงฟังก์ชัน Render รายการเครื่องมือ (เพิ่มปุ่มแก้ไข)
// ในส่วน onValue(toolsRef, ...) ให้เพิ่มปุ่มนี้เข้าไปในชุดปุ่มเดิม:
/* <button onclick="editTool('${category}', '${toolId}')" class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
*/

// 2. ฟังก์ชันเตรียมข้อมูลเพื่อแก้ไข (ดึงข้อมูลจากรายการขึ้นไปบนฟอร์ม)
window.editTool = async (category, toolId) => {
    isEditing = true;
    editingId = toolId;
    editingCat = category;

    try {
        const snapshot = await get(child(ref(db), `tools/${category}/${toolId}`));
        const tool = snapshot.val();

        // นำข้อมูลไปใส่ใน Input ต่างๆ
        document.getElementById('tool-category').value = category;
        document.getElementById('tool-title').value = tool.title;
        document.getElementById('tool-desc').value = tool.desc;
        document.getElementById('tool-icon').value = tool.icon;
        document.getElementById('tool-link').value = tool.link;

        // เปลี่ยน UI ของฟอร์ม
        document.getElementById('form-title').innerText = "แก้ไขเครื่องมือ";
        document.getElementById('submit-btn').querySelector('span').innerText = "บันทึกการแก้ไข";
        document.getElementById('submit-btn').classList.replace('bg-slate-800', 'bg-amber-600');
        document.getElementById('cancel-edit').classList.remove('hidden');

        // เลื่อนหน้าจอขึ้นไปที่ฟอร์ม
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) { alert(error.message); }
};

// 3. ฟังก์ชันยกเลิกการแก้ไข
window.cancelEdit = () => {
    isEditing = false;
    editingId = null;
    editingCat = null;
    document.getElementById('tool-form').reset();
    document.getElementById('form-title').innerText = "เพิ่มเครื่องมือใหม่";
    document.getElementById('submit-btn').querySelector('span').innerText = "บันทึกข้อมูล";
    document.getElementById('submit-btn').classList.replace('bg-amber-600', 'bg-slate-800');
    document.getElementById('cancel-edit').classList.add('hidden');
};

// 4. ปรับปรุงฟังก์ชัน Submit (ให้รองรับทั้ง Add และ Edit)
document.getElementById('tool-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('tool-category').value;
    const title = document.getElementById('tool-title').value;
    const desc = document.getElementById('tool-desc').value;
    const icon = document.getElementById('tool-icon').value;
    const link = document.getElementById('tool-link').value;

    let bg, color;
    if(category === 'clinical') { bg = 'bg-indigo-100'; color = 'text-indigo-600'; }
    else if(category === 'patient') { bg = 'bg-emerald-100'; color = 'text-emerald-600'; }
    else { bg = 'bg-slate-200'; color = 'text-slate-400'; }

    try {
        if (isEditing) {
            // กรณีแก้ไข: ถ้าเปลี่ยนหมวดหมู่ ต้องลบอันเก่าในหมวดเดิมทิ้งด้วย
            if (editingCat !== category) {
                await remove(ref(db, `tools/${editingCat}/${editingId}`));
            }
            // เซฟทับที่ ID เดิม (หรือตำแหน่งใหม่ถ้าเปลี่ยนหมวด)
            await set(ref(db, `tools/${category}/${editingId}`), { title, desc, icon, bg, color, link });
            alert('แก้ไขข้อมูลเรียบร้อย!');
            cancelEdit();
        } else {
            // กรณีเพิ่มใหม่: ใช้ push() ปกติ
            const newToolRef = push(ref(db, 'tools/' + category));
            await set(newToolRef, { title, desc, icon, bg, color, link });
            e.target.reset();
        }
    } catch (error) { alert(error.message); }
});