cat > src/generateFocusHint.ts << 'EOF'
import * as functions from "firebase-functions";

export const generateFocusHint = functions.https.onCall(
  async (data) => {
    const { content } = data;

    if (!content || typeof content !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "content must be string"
      );
    }

    const systemPrompt = `
너는 사용자의 글에서 더 깊이 생각해볼 지점을 제시하는 조력자다.
지적하거나 평가하지 말고, 확장 질문 형태로 제시한다.
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

    const hint =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return { hint };
  }
);
EOF
