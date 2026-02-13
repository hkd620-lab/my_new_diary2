"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEssayAvailability = checkEssayAvailability;
const functions_1 = require("firebase/functions");
const firebase_1 = require("./firebase");
/**
 * 서버 판단만 사용하는 에세이 생성 가능 여부 조회 서비스
 * - 프론트는 판단하지 않는다
 * - 서버 결과를 그대로 반영한다
 */
const functions = (0, functions_1.getFunctions)(firebase_1.app);
/**
 * 에세이 생성 가능 여부 확인
 * - AI 호출 없음
 * - essays 생성 없음
 * - 서버 판단 단일 진실(Single Source of Truth)
 */
async function checkEssayAvailability(params) {
    const callable = (0, functions_1.httpsCallable)(functions, "checkEssayAvailability");
    const res = await callable(params);
    return res.data;
}
