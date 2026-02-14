import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as admin from "firebase-admin";

setGlobalOptions({
  region: "us-central1",
  memory: "512MiB",
  timeoutSeconds: 120,
});

admin.initializeApp();
const db = admin.firestore();

export const generateSayu = onCall(
  { secrets: ["OPENAI_API_KEY"] },
  async (request) => {
    try {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
      }

      const uid = request.auth.uid;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        throw new HttpsError(
          "failed-precondition",
          "OPENAI_API_KEY가 설정되지 않았습니다."
        );
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
        throw new HttpsError("not-found", "최근 7일 기록이 없습니다.");
      }

      const recordsText = records
        .map((d: any) => `[${d.date}] ${d.content}`)
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

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API 오류: ${errorText}`);
      }

      const result: any = await response.json();
      let text = result?.choices?.[0]?.message?.content;

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
    } catch (error: any) {
      console.error("SAYU CRITICAL ERROR:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError("internal", error.message);
    }
  }
);

export const generateAIText = generateSayu;
