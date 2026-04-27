// ==========================================
// ลงทะเบียน Service Worker (บังคับให้เป็น PWA)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js') // 💡 เช็คว่าลิงก์ถูกแล้ว
            .then(reg => console.log('ลงทะเบียน Service Worker สำเร็จ!'))
            .catch(err => console.error('ลงทะเบียน Service Worker ไม่สำเร็จ:', err));
    });
}
// 1. นำลิงก์ TSV ที่ได้จาก Google Sheets มาวางตรงนี้ (ต้องลงท้ายด้วย output=tsv)
const SHEET_TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vThp6_o3hvsx2QQme7eJgNsttqMZva_c2hXaKT14jL8xbQMetH3JQsinYcf9Un4aiLlruZJ5MsGS1Wn/pub?output=tsv";

const gridContainer = document.getElementById('app-grid-container');
const homeSection = document.getElementById('home-section');
const viewerSection = document.getElementById('viewer-section');
const webViewer = document.getElementById('web-viewer');
const btnHome = document.getElementById('back-to-home');
const searchInput = document.getElementById('search-input');

let allApps = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAppsFromCache();
    syncAppsFromSheets();
});

// ==========================================
// ระบบค้นหาและดึงข้อมูลจาก Sheets
// ==========================================
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    const filteredApps = allApps.filter(app => {
        const nameMatch = app.name ? app.name.toLowerCase().includes(keyword) : false;
        const descMatch = app.description ? app.description.toLowerCase().includes(keyword) : false;
        const audienceMatch = app.audience ? app.audience.toLowerCase().includes(keyword) : false;
        const tagMatch = app.tag ? app.tag.toLowerCase().includes(keyword) : false;

        return nameMatch || descMatch || audienceMatch || tagMatch;
    });

    renderAppGrid(filteredApps);
});

function loadAppsFromCache() {
    const cachedData = localStorage.getItem('pharmatools_sheets_apps');
    if (cachedData) {
        allApps = JSON.parse(cachedData);
        renderAppGrid(allApps);
    }
}

function syncAppsFromSheets() {
    if (!SHEET_TSV_URL || SHEET_TSV_URL === "วางลิงก์_TSV_ของคุณตรงนี้") return;

    const cacheBuster = "&v=" + new Date().getTime();
    const fetchUrl = SHEET_TSV_URL.includes('?') ? SHEET_TSV_URL + cacheBuster : SHEET_TSV_URL + "?v=" + cacheBuster;

    fetch(fetchUrl)
        .then(response => response.text())
        .then(tsvText => {
            const apps = parseTSV(tsvText);
            const currentCache = localStorage.getItem('pharmatools_sheets_apps');

            if (JSON.stringify(apps) !== currentCache) {
                allApps = apps;
                renderAppGrid(allApps);
                localStorage.setItem('pharmatools_sheets_apps', JSON.stringify(apps));
                console.log("อัปเดตแอปจาก Google Sheets เรียบร้อย!");
            }
        })
        .catch(error => console.error("โหลดข้อมูลจาก Sheets ไม่สำเร็จ:", error));
}

function parseTSV(tsv) {
    const lines = tsv.split('\n');
    const result = [];
    if (lines.length < 2) return result;

    const headers = lines[0].split('\t').map(h => h.trim().replace('\r', ''));

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentLine = lines[i].split('\t');
        const appObj = {};

        headers.forEach((header, index) => {
            appObj[header] = currentLine[index] ? currentLine[index].trim().replace('\r', '') : "";
        });

        if (appObj.name && appObj.url) {
            result.push(appObj);
        }
    }
    return result;
}

// ==========================================
// ระบบวาดการ์ดแอปพลิเคชัน
// ==========================================
function renderAppGrid(apps) {
    gridContainer.innerHTML = '';

    if(apps.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d; margin-top: 20px;">ไม่พบแอปพลิเคชันที่ค้นหา</p>';
        return;
    }

    const groups = {};
    apps.forEach(app => {
        const category = app.audience ? app.audience.trim() : 'หมวดหมู่ทั่วไป';
        if (!groups[category]) groups[category] = [];
        groups[category].push(app);
    });

    const preferredOrder = [
        "บุคลากรทางการแพทย์",
        "แพทย์",
        "เภสัชกร",
        "พยาบาล",
        "ประชาชนทั่วไป",
        "ผู้ป่วย"
    ];

    const sortedCategories = Object.keys(groups).sort((a, b) => {
        let indexA = preferredOrder.indexOf(a);
        let indexB = preferredOrder.indexOf(b);
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
    });

    sortedCategories.forEach(categoryName => {
        const categoryApps = groups[categoryName];

        const section = document.createElement('div');
        section.className = 'app-section';

        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = `📌 สำหรับ${categoryName}`;
        section.appendChild(sectionTitle);

        const grid = document.createElement('div');
        grid.className = 'app-grid';

        categoryApps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.style.setProperty('--theme-color', app.color || '#3498db');
            card.onclick = () => openWebApp(app.url);

            let statusHtml = '';
            if (app.status) {
                const statusText = app.status.trim();
                const statusLower = statusText.toLowerCase();
                let statusClass = '';
                if (statusLower.includes('new')) statusClass = 'status-new';
                else if (statusLower.includes('update')) statusClass = 'status-update';

                if (statusClass) {
                    statusHtml = `<div class="status-badge ${statusClass}">${statusText}</div>`;
                }
            }

            let tagClass = 'tag-default';
            if (categoryName.includes('บุคลากร') || categoryName.includes('แพทย์') || categoryName.includes('เภสัช') || categoryName.includes('พยาบาล')) {
                tagClass = 'tag-med';
            } else if (categoryName.includes('ทั่วไป') || categoryName.includes('ผู้ป่วย') || categoryName.includes('ประชาชน')) {
                tagClass = 'tag-public';
            }

            let tagHtml = '';
            if (app.tag) {
                tagHtml = `<span class="card-tag ${tagClass}">${app.tag}</span>`;
            }

            card.innerHTML = `
                ${statusHtml}
                <div class="card-icon-wrapper"><span class="card-icon">${app.icon || '💊'}</span></div>
                <h3 class="card-title">${app.name}</h3>
                <span class="card-subtitle">${app.description || ''}</span>
                ${tagHtml}
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        gridContainer.appendChild(section);
    });
}

// ==========================================
// ระบบ Iframe (เปิดแอป / กลับหน้าหลัก)
// ==========================================
function openWebApp(url) {
    document.getElementById('iframe-loader').style.display = 'block';
    webViewer.src = url;
    homeSection.style.display = 'none';
    viewerSection.style.display = 'block';
    btnHome.style.display = 'block';
}

btnHome.addEventListener('click', () => {
    webViewer.src = "";
    viewerSection.style.display = 'none';
    homeSection.style.display = 'block';
    btnHome.style.display = 'none';
});

// ==========================================
// ระบบ Sidebar Menu (สำหรับมือถือ)
// ==========================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const navMenu = document.getElementById('nav-menu');
const menuOverlay = document.getElementById('menu-overlay');

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
        menuOverlay.style.display = 'block';
        setTimeout(() => menuOverlay.classList.add('active'), 10);
    } else {
        menuOverlay.classList.remove('active');
        setTimeout(() => menuOverlay.style.display = 'none', 400);
    }
}

if(hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
if(closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);
if(menuOverlay) menuOverlay.addEventListener('click', toggleMobileMenu);

const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ==========================================
// ระบบ Pop-up Modal (วิธีติดตั้ง / ผู้จัดทำ)
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ปิดเมื่อคลิกพื้นที่สีดำนอกกรอบ
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('show');
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 300);
    }
});

// ==========================================
// ระบบ PWA Install Prompt (สำหรับติดตั้งลง Desktop)
// ==========================================
let deferredPrompt;
const installPwaBtn = document.getElementById('install-pwa-btn');

// ดักจับเหตุการณ์ก่อนการติดตั้ง
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e; // เก็บค่าไว้ใช้ตอนผู้ใช้กดปุ่ม
});

// เมื่อมีการกดปุ่มติดตั้ง
if (installPwaBtn) {
    installPwaBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // ถ้าระบบพร้อม จะแสดงหน้าต่างติดตั้งของเบราว์เซอร์
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`การตัดสินใจของผู้ใช้: ${outcome}`);
            deferredPrompt = null;
        } else {
            // ถ้าระบบยังไม่พร้อม (เช่นรันบนเครื่องที่ติดตั้งไปแล้ว หรือเบราว์เซอร์ไม่รองรับ)
            alert('เบราว์เซอร์นี้ยังไม่พร้อมติดตั้งอัตโนมัติ หรือคุณอาจติดตั้งแอปไปแล้วครับ\n\n💡 วิธีติดตั้งด้วยตัวเอง:\nให้คลิกที่เมนู (จุด 3 จุด) ที่มุมขวาบนของ Chrome แล้วเลือก "ติดตั้งแอป" หรือ "บันทึกและแชร์ > สร้างทางลัด" ครับ');
        }
    });
}

// ตรวจสอบว่าแอปถูกติดตั้งไปแล้วหรือยัง
window.addEventListener('appinstalled', (evt) => {
    console.log('Pharmatools ถูกติดตั้งเรียบร้อยแล้ว');
    if (installPwaBtn) {
        installPwaBtn.style.display = 'none';
    }
});