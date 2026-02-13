import * as functions from "firebase-functions";

export const generateFinalEssay = functions.https.onRequest(
  async (req, res) => {
    try {
      const { content, answers } = req.body;

      if (!content || typeof content !== "string") {
        res.status(400).json({ error: "Invalid content" });
        return;
      }

      const systemPrompt = `
너는 절제된 문체의 에세이 작성자다.
사용자의 기록과 답변을 바탕으로
과장 없이, 사색적인 한국어 에세이를 작성한다.
`.trim();

      const userPrompt = `
[기록]
${content}

[답변]
${JSON.stringify(answers ?? {}, null, 2)}

위 내용을 바탕으로 하나의 완성된 에세이를 작성하라.
`.trim();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
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
          }),
        }
      );

      const result: any = await response.json();

      const finalEssay =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      res.json({ finalEssay });
    } catch (error: any) {
      console.error("generateFinalEssay error:", error);
      res.status(500).json({ error: "Failed to generate essay" });
    }
  }
);
