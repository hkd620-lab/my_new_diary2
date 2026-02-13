"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEssay = saveEssay;
// src/services/essayService.ts
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("./firebase");
async function saveEssay(payload) {
    const { uid, from, to, language, fiveElements, draftEssay, analytics, } = payload;
    const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "essays"), {
        uid,
        createdAt: firestore_1.Timestamp.now(),
        sourceRange: {
            from,
            to,
        },
        language,
        fiveElements,
        draftEssay,
        finalEssay: draftEssay, // 초기값은 초안 복사
        status: "draft",
        analytics,
    });
    return docRef.id;
}
