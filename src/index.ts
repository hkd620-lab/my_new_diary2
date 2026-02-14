import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from "firebase-admin";

admin.initializeApp();
setGlobalOptions({ region: "asia-northeast3" });

export const generateAIText = onCall({ cors: true }, async (request) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new HttpsError("failed-precondition", "API Key missing");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt =
      "허교장님에게 Gemini 1.5 Flash 엔진 연결이 정상 완료되었음을 보고하는 한 문장을 작성하시오.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      model: "gemini-1.5-flash",
      region: "asia-northeast3",
      message: text.trim()
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new HttpsError(
      "internal",
      error?.message || "AI connection failed"
    );
  }
});
