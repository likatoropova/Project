importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCA8yN9xcSB3B8Tv3bALze1a57ai4VqjD4",
    authDomain: "moveup-fb732.firebaseapp.com",
    projectId: "moveup-fb732",
    storageBucket: "moveup-fb732.firebasestorage.app",
    messagingSenderId: "14967627731",
    appId: "1:14967627731:web:b99fe8faee6abdcc429926",
    measurementId: "G-FK8X50NWWB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Обработчик фоновых сообщений
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    // Кастомизация уведомления
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/img/logo.png', // Путь к иконке вашего приложения
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});