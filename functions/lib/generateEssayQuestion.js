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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEssayQuestion = void 0;
const functions = __importStar(require("firebase-functions"));
const openai_1 = __importDefault(require("openai"));
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables");
}
const openai = new openai_1.default({
    apiKey,
});
exports.generateEssayQuestion = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }
    const { sections, qaLog } = data;
    if (!sections || typeof sections !== "object") {
        throw new functions.https.HttpsError("invalid-argument", "sections is required");
    }
    const systemPrompt = `
You are a calm, thoughtful writing mentor.
You never write essays for the user.
You only ask one gentle question at a time.

Your task:
- Read the user's daily notes.
- Check whether the following five elements are sufficiently present:
  1. central moment
  2. sensory description
  3. association
  4. reflection
  5. quiet remainder (what is left unsaid)

Rules:
- Ask about missing or weak elements only.
- Ask only ONE question.
- Do not explain.
- Do not praise.
- Do not criticize.
- Do not use "why".
- If all five elements are sufficiently present, respond with exactly: DONE
`;
    const userPrompt = `
[User daily notes]
${JSON.stringify(sections, null, 2)}

[Previous Q&A]
${JSON.stringify(qaLog ?? [], null, 2)}
`;
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 120,
    });
    const text = response.choices[0].message.content?.trim();
    return {
        question: text,
    };
});
