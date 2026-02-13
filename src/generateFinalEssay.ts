import * as functions from "firebase-functions";

export const generateFinalEssay = functions.https.onRequest(
  async (req, res) => {
    try {
      const { content, answers } = req.body;

      if (!content || typeof content !== "string") {
        res.status(400).json({ error: "content must be string" });
        return;
      }

      const apiKey =
        process.env.GEMINI_API_KEY ||
        functions.config().gemini?.key;

      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY not set" });
        return;
      }

      const systemPrompt = `
너는 사용자의 일기를 문학적으로 다듬는 에디터다.
감정을 과장하지 말고 절제된 문체로 정리한다.
자연스럽고 읽기 좋은 단락으로 구성한다.
한국어로 작성한다.
`.trim();

      const userPrompt = `
[원문]
${content}

[보조 답변]
${JSON.stringify(answers ?? {}, null, 2)}

위 내용을 바탕으로 완성된 에세이를 작성하라.
`.trim();

      const response = await fetch(
        \`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: \`\${systemPrompt}\n\n\${userPrompt}\` }],
              },
            ],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini error:", errorText);
        res.status(500).json({ error: "Gemini API error" });
        return;
      }

      const result: any = await response.json();

      const finalEssay =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      if (!finalEssay) {
        console.error("Empty Gemini response:", JSON.stringify(result));
        res.status(500).json({ error: "Empty Gemini response" });
        return;
      }

      res.json({ finalEssay });
    } catch (error: any) {
      console.error("generateFinalEssay error:", error);
      res.status(500).json({ error: "Failed to generate essay" });
    }
  }
);
