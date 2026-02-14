"use strict";
// src/services/essay.ts
// SAYU 수필 생성 서비스 - Firebase callable 호출
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEssay = generateEssay;
const functions_1 = require("firebase/functions");
// 수필 생성 요청
async function generateEssay() {
    const functions = (0, functions_1.getFunctions)();
    const refineDailyRecord = (0, functions_1.httpsCallable)(functions, "refineDailyRecord");
    const result = await refineDailyRecord();
    return result.data;
}
