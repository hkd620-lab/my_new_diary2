"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEssayQuestion = generateEssayQuestion;
const functions_1 = require("firebase/functions");
const functions = (0, functions_1.getFunctions)();
/**
 * 일기 내용을 바탕으로
 * AI가 다음 질문 1개 또는 DONE을 반환
 */
async function generateEssayQuestion(params) {
    var _a;
    const callable = (0, functions_1.httpsCallable)(functions, "generateEssayQuestion");
    const res = await callable({
        sections: params.sections,
        qaLog: (_a = params.qaLog) !== null && _a !== void 0 ? _a : [],
    });
    return res.data;
}
