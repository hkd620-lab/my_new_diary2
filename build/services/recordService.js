"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDailyRecord = saveDailyRecord;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("./firebase");
/**
 * 임시 AI 정제 함수
 * (추후 GPT-4o-mini로 교체)
 */
async function refineText(sections) {
    const joined = Object.values(sections).join(" ");
    if (!joined)
        return "";
    // 간단한 정제 로직 (지금은 mock)
    const cleaned = joined.trim();
    return cleaned.length > 150
        ? cleaned.slice(0, 150) + "..."
        : cleaned;
}
async function saveDailyRecord(data) {
    // 1️⃣ 원본 저장
    const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "records"), Object.assign(Object.assign({}, data), { refinedText: null, createdAt: (0, firestore_1.serverTimestamp)() }));
    // 2️⃣ AI 정제
    const refined = await refineText(data.sections);
    // 3️⃣ 정제 문장 업데이트
    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "records", docRef.id), {
        refinedText: refined,
    });
}
