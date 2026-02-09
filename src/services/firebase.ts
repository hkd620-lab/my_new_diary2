import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// ✅ 필요한 서비스만 export
export const db = getFirestore(app);
export const auth = getAuth(app);

