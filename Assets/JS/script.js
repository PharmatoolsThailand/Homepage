// ฟังก์ชันสำหรับเปิดแอปใน Iframe
function openWebApp(url) {
    if (!url || url === '#') return;

    const homeSection = document.getElementById('home-section');
    const viewerSection = document.getElementById('viewer-section');
    const webViewer = document.getElementById('web-viewer');
    const btnHome = document.getElementById('back-to-home');
    const loader = document.getElementById('iframe-loader');

    // โชว์หน้าโหลดข้อมูล
    loader.style.display = 'block';

    // เทคนิคป้องกันแคชเก่า (ทำให้ระบบ Sync ข้อมูลใหม่ขึ้น)
    const cacheBuster = "v=" + new Date().getTime();
    const finalUrl = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;

    // โหลดหน้าเว็บ
    webViewer.src = finalUrl;

    // สลับหน้าต่างแสดงผล
    homeSection.style.display = 'none';
    viewerSection.style.display = 'block';
    btnHome.style.display = 'block'; // แสดงปุ่มกลับหน้าหลัก
}

// ฟังก์ชันสำหรับปุ่มกลับหน้าหลัก
document.getElementById('back-to-home').addEventListener('click', () => {
    const homeSection = document.getElementById('home-section');
    const viewerSection = document.getElementById('viewer-section');
    const webViewer = document.getElementById('web-viewer');
    const btnHome = document.getElementById('back-to-home');

    // ล้าง URL ใน Iframe เพื่อหยุดการทำงานพื้นหลังของแอปนั้น
    webViewer.src = "";

    // สลับกลับไปหน้าเลือกแอป
    viewerSection.style.display = 'none';
    homeSection.style.display = 'block';
    btnHome.style.display = 'none'; // ซ่อนปุ่มกลับหน้าหลัก
});