cat > src/generateContextLine.ts << 'EOF'
import * as functions from "firebase-functions";

export const generateContextLine = functions.https.onCall(
  async (data) => {
    const { content } = data;

    if (!content || typeof content !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "content must be string"
      );
    }

    const systemPrompt = `
너는 일기 내용을 한 줄로 요약하는 조력자다.
감정의 결을 살려 자연스럽게 정리하라.
과장하지 말고 담백하게 작성한다.
한국어로 작성한다.
`.trim();

    const userPrompt = `User diary text:\n${content}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );

    const result: any = await response.json();

    const summary =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return { summary };
  }
);
EOF
