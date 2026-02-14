"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDailyRecord = saveDailyRecord;
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const firebase_1 = require("./firebase");
/**
 * 하루 기록 저장 (날씨 / 기온 / 기분 / 섹션)
 * - uid + date 기준으로 하루 1문서 유지
 * - 기존 문서가 있으면 sections 병합
 */
async function saveDailyRecord(data) {
    var _a;
    const auth = (0, auth_1.getAuth)();
    const user = auth.currentUser;
    if (!user)
        throw new Error("NOT_AUTHENTICATED");
    const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "records"), (0, firestore_1.where)("uid", "==", user.uid), (0, firestore_1.where)("date", "==", data.date));
    const snap = await (0, firestore_1.getDocs)(q);
    if (!snap.empty) {
        // 기존 문서 업데이트
        const ref = (0, firestore_1.doc)(firebase_1.db, "records", snap.docs[0].id);
        const prev = snap.docs[0].data();
        await (0, firestore_1.updateDoc)(ref, {
            weather: data.weather,
            temperature: data.temperature,
            mood: data.mood,
            sections: {
                ...((_a = prev.sections) !== null && _a !== void 0 ? _a : {}),
                ...data.sections,
            },
            updatedAt: firestore_1.Timestamp.now(),
        });
    }
    else {
        // 최초 생성
        await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "records"), {
            uid: user.uid,
            date: data.date,
            weather: data.weather,
            temperature: data.temperature,
            mood: data.mood,
            sections: data.sections,
            createdAt: firestore_1.Timestamp.now(),
        });
    }
}
