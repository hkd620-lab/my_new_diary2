"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIText = exports.generateSayu = void 0;
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const admin = __importStar(require("firebase-admin"));
(0, v2_1.setGlobalOptions)({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120,
});
admin.initializeApp();
const db = admin.firestore();
exports.generateSayu = (0, https_1.onCall)({ secrets: ["OPENAI_API_KEY"] }, async (request) => {
    var _a, _b, _c;
    try {
        if (!request.auth) {
            throw new https_1.HttpsError("unauthenticated", "로그인이 필요합니다.");
        }
        const uid = request.auth.uid;
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new https_1.HttpsError("failed-precondition", "OPENAI_API_KEY가 설정되지 않았습니다.");
        }
        const today = new Date();
        const snapshot = await db
            .collection("records")
            .where("uid", "==", uid)
            .orderBy("date", "desc")
            .limit(7)
            .get();
        const records = snapshot.docs.map((doc) => doc.data());
        if (records.length === 0) {
            throw new https_1.HttpsError("not-found", "최근 7일 기록이 없습니다.");
        }
        const recordsText = records
            .map((d) => `[${d.date}] ${d.content}`)
            .join("\n");
        const prompt = `당신은 깊은 통찰을 가진 수필가입니다.
다음 7일 기록을 분석하여 JSON 형식으로 응답하십시오.

{
  "summary": "...",
  "elements": {
    "subject": "...",
    "description": "...",
    "association": "...",
    "reflection": "...",
    "void": "..."
  },
  "essay": "..."
}

기록:
${recordsText}`;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "당신은 구조화된 사유 분석가입니다. 반드시 순수 JSON만 응답하세요. 마크다운 코드블록을 사용하지 마세요." },
                    { role: "user", content: prompt },
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API 오류: ${errorText}`);
        }
        const result = await response.json();
        let text = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (!text) {
            throw new Error("AI 응답이 비어 있습니다.");
        }
        // 마크다운 코드블록 제거
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(text);
        const sayuData = {
            uid,
            date: today.toISOString().split("T")[0],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ...parsed,
            model: "gpt-4o-mini",
        };
        const docRef = await db.collection("sayu").add(sayuData);
        return {
            success: true,
            id: docRef.id,
            data: parsed,
        };
    }
    catch (error) {
        console.error("SAYU CRITICAL ERROR:", error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError("internal", error.message);
    }
});
exports.generateAIText = exports.generateSayu;
