import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCA8yN9xcSB3B8Tv3bALze1a57ai4VqjD4",
    authDomain: "moveup-fb732.firebaseapp.com",
    projectId: "moveup-fb732",
    storageBucket: "moveup-fb732.firebasestorage.app",
    messagingSenderId: "14967627731",
    appId: "1:14967627731:web:b99fe8faee6abdcc429926",
    measurementId: "G-FK8X50NWWB"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Функция для запроса разрешения и получения токена
export const requestForToken = async () => {
    try {
        // Запрашиваем разрешение на уведомления
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Получаем токен, передавая VAPID-ключ
            const currentToken = await getToken(messaging, {
                vapidKey: "BKlu_jvd5zUS2X0iiJ9vv6sI3c3Vr-qR2q__1_v5dYWuTr5NJtCSpkpFwotnWO07wbuRVMGSvtYTtoSD1-yaBJk", // Ваш публичный VAPID-ключ
            });
            if (currentToken) {
                console.log('FCM Token:', currentToken);
                return currentToken;
            } else {
                console.log('No registration token available.');
            }
        } else {
            console.log('Permission not granted.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

// Слушатель для уведомлений, когда приложение открыто (в foreground)
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
