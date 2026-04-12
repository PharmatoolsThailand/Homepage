// sw.js
// Service Worker เบื้องต้น เพื่อให้ผ่านเกณฑ์ PWA ของเบราว์เซอร์
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
    // ปัจจุบันปล่อยผ่านไปก่อน ยังไม่ทำระบบ Offline caching แบบซับซ้อน
});