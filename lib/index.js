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
exports.generateAIText = void 0;
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const generative_ai_1 = require("@google/generative-ai");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
(0, v2_1.setGlobalOptions)({ region: "asia-northeast3" });
exports.generateAIText = (0, https_1.onCall)({ cors: true }, async (request) => {
    var _a;
    const apiKey = (_a = process.env.GEMINI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
    if (!apiKey) {
        throw new https_1.HttpsError("failed-precondition", "API Key missing");
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });
        const prompt = "허교장님에게 Gemini 1.5 Flash 엔진 연결이 정상 완료되었음을 보고하는 한 문장을 작성하시오.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return {
            success: true,
            model: "gemini-1.5-flash",
            region: "asia-northeast3",
            message: text.trim()
        };
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        throw new https_1.HttpsError("internal", (error === null || error === void 0 ? void 0 : error.message) || "AI connection failed");
    }
});
