"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const firebaseConfig = {
    apiKey: "AIzaSyAtV9KDcfbWh9kiAMxyZE57-mriwjiVas0",
    authDomain: "my-new-diary2.firebaseapp.com",
    projectId: "my-new-diary2",
    storageBucket: "my-new-diary2.firebasestorage.app",
    messagingSenderId: "878184296881",
    appId: "1:878184296881:web:be4ebd0cb00cdbbbb74d90",
    measurementId: "G-E45396F7H7",
};
// ✅ Firebase 앱은 여기서 단 한 번만 초기화
const app = (0, app_1.getApps)().length === 0
    ? (0, app_1.initializeApp)(firebaseConfig)
    : (0, app_1.getApp)();
// ✅ 필요한 서비스만 export
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
