// ไฟล์ sw.js (Service Worker)
const CACHE_NAME = 'pharmatools-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker: กำลังติดตั้ง');
});

self.addEventListener('fetch', (event) => {
    // ให้ผ่านไปเลย ไม่ต้องทำ Cache อะไรซับซ้อน ขอแค่มีไฟล์นี้เบราว์เซอร์ก็ยอมให้ติดตั้งแล้ว
    event.respondWith(fetch(event.request));
});