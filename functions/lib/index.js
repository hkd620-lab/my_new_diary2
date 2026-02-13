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
exports.generateEssayQuestion = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const generative_ai_1 = require("@google/generative-ai");
admin.initializeApp();
exports.generateEssayQuestion = functions.https.onCall(async (data, context) => {
    try {
        const { sections, qaLog } = data;
        if (!sections || !Array.isArray(sections)) {
            throw new functions.https.HttpsError("invalid-argument", "sections must be an array");
        }
        const apiKey = process.env.GEMINI_API_KEY ||
            functions.config().gemini?.api_key;
        if (!apiKey) {
            throw new functions.https.HttpsError("internal", "GEMINI_API_KEY not set");
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const systemPrompt = `
너는 HARU/SAYU 시스템의 사유 유도 질문 생성자다.
- 최근 7일 기록을 분석한다.
- 사용자가 아직 깊이 탐색하지 않은 축을 질문한다.
- 질문은 1개만 생성한다.
- 과장하지 말고 사색을 유도하는 문장으로 작성한다.
- 한국어로 작성한다.
`.trim();
        const userPrompt = `
[최근 7일 기록]
${JSON.stringify(sections, null, 2)}

[이전 Q&A 로그]
${JSON.stringify(qaLog ?? [], null, 2)}

위 기록을 바탕으로 사유를 확장할 수 있는 질문 1개를 생성하라.
`.trim();
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${systemPrompt}\n\n${userPrompt}`,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.4,
            },
        });
        const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "";
        if (!text) {
            throw new functions.https.HttpsError("internal", "Gemini returned empty question");
        }
        return { question: text };
    }
    catch (error) {
        console.error("generateEssayQuestion error:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", error?.message || "Failed to generate question");
    }
});
