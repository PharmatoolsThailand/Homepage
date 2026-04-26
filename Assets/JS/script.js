// ฟังก์ชันสำหรับเปิดแอป
function openWebApp(url) {
    if (!url || url === '#') return;

    const homeSection = document.getElementById('home-section');
    const viewerSection = document.getElementById('viewer-section');
    const webViewer = document.getElementById('web-viewer');
    const btnHome = document.getElementById('back-to-home');
    const loader = document.getElementById('iframe-loader');

    // 1. โชว์ตัวโหลดข้อมูล
    loader.style.display = 'block';

    // 2. สั่งโหลดหน้าเว็บ (ใส่ URL เข้าไปตรงๆ)
    webViewer.src = url;

    // 3. สลับหน้าจอจากเมนูหลัก ไปหน้า Viewer
    homeSection.style.display = 'none';
    viewerSection.style.display = 'block';
    btnHome.style.display = 'block';
}

// ฟังก์ชันสำหรับปุ่มกลับหน้าหลัก
document.getElementById('back-to-home').addEventListener('click', () => {
    const homeSection = document.getElementById('home-section');
    const viewerSection = document.getElementById('viewer-section');
    const webViewer = document.getElementById('web-viewer');
    const btnHome = document.getElementById('back-to-home');

    // 1. ล้าง URL ทิ้ง! (นี่คือเคล็ดลับที่ทำให้มันต้องโหลดใหม่ทุกครั้งที่กดเข้าแอป)
    webViewer.src = "";

    // 2. สลับหน้าจอกลับไปเมนูหลัก
    viewerSection.style.display = 'none';
    homeSection.style.display = 'block';
    btnHome.style.display = 'none';
});