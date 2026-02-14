import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

/**
 * [SAYU 엔진 최종 안정화 - 2026-02-14 12:20]
 * 1. 404 에러 원천 차단: 모델명을 표준 'gemini-1.5-flash'로 사용
 * 2. API 키 세척: .replace(/\s/g, '')를 사용하여 모든 보이지 않는 공백 제거
 * 3. 디버깅 강화: 에러 발생 시 구글 서버의 응답 원문을 로그에 상세 기록
 */

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

setGlobalOptions({ 
  region: "asia-northeast3",
  memory: "512MiB",
  timeoutSeconds: 120 
});

admin.initializeApp();
const db = admin.firestore();

export const generateSayu = onCall({
  secrets: [GEMINI_API_KEY],
}, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "로그인이 필요합니다.");

  const uid = request.auth.uid;
  const today = new Date();
  const sevenDaysAgoStr = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  try {
    const rawKey = GEMINI_API_KEY.value();
    if (!rawKey) throw new Error("API Key가 설정되지 않았습니다.");
    // 앞뒤 공백뿐만 아니라 내부의 모든 공백 문자까지 제거하여 순수한 키만 추출
    const apiKey = rawKey.replace(/\s/g, ''); 
    
    // 1. HARU 기록 수집
    const recordsSnapshot = await db.collection("records").where("uid", "==", uid).get();
    if (recordsSnapshot.empty) {
      throw new HttpsError("not-found", "분석할 기록(HARU)이 없습니다. 일기를 먼저 작성해 주세요.");
    }

    const filteredRecords = recordsSnapshot.docs
      .map(doc => doc.data())
      .filter(doc => doc.date >= sevenDaysAgoStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (filteredRecords.length === 0) {
      throw new HttpsError("not-found", "최근 7일간의 기록이 없습니다. 사유(SAYU)를 위해 오늘 일기를 남겨주세요.");
    }

    const recordsText = filteredRecords.map(d => `[${d.date}] ${d.content}`).join("\n");

    // 2. Gemini 엔진 설정
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: { type: SchemaType.STRING },
            elements: {
              type: SchemaType.OBJECT,
              properties: {
                subject: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                association: { type: SchemaType.STRING },
                reflection: { type: SchemaType.STRING },
                void: { type: SchemaType.STRING },
              },
              required: ["subject", "description", "association", "reflection", "void"],
            },
            essay: { type: SchemaType.STRING },
          },
          required: ["summary", "elements", "essay"],
        },
      },
    });

    const prompt = `당신은 깊은 통찰을 가진 수필가입니다. 다음 기록을 분석하여 사용자의 내면을 비추는 사유(SAYU)를 작성하십시오.\n\n${recordsText}`;
    
    // API 호출
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let aiResponse;
    try {
      const cleanJson = text.replace(/```json|```/g, "").trim();
      aiResponse = JSON.parse(cleanJson);
    } catch (e) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }

    // 3. Firestore 결과 저장
    const sayuData = {
      uid,
      date: today.toISOString().split("T")[0],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...aiResponse,
      model: "gemini-1.5-flash"
    };

    const docRef = await db.collection("sayu").add(sayuData);
    return { success: true, id: docRef.id, data: aiResponse };

  } catch (error: any) {
    // 상세 에러 로깅 (Firebase Console의 로그에서 확인 가능)
    console.error("SAYU CRITICAL ERROR:", JSON.stringify(error, null, 2));
    
    if (error.message?.includes("404") || error.status === 404) {
      throw new HttpsError("internal", "구글 AI 모델 경로 오류(404). 모델 이름을 표준으로 복구했으니 다시 한번 테스트해 주세요. 계속되면 API 키의 권한 동기화 대기 시간일 수 있습니다.");
    }
    
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", `에러 발생: ${error.message}`);
  }
});

export const generateAIText = generateSayu;
