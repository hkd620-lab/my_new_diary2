import * as functions from "firebase-functions";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateFinalEssay = functions.https.onRequest(
  async (req, res) => {
    try {
      const { content, answers } = req.body;

      if (!content || !answers) {
        res.status(400).json({ error: "Invalid input" });
        return;
      }

      const systemPrompt = `
You are helping the user turn their own writing into a calm, restrained personal essay.

Rules:
- Use ONLY the provided text.
- Do NOT add new events or facts.
- Do NOT praise, judge, or advise.
- Keep a quiet, reflective tone.
- Leave space and silence at the end.
- Length: about 800–1200 Korean characters.
`;

      const userPrompt = `
Original diary text:
${content}

Writing answers:
- Scene: ${answers.scene ?? ""}
- Sensation: ${answers.sensation ?? ""}
- Connection: ${answers.connection ?? ""}
- Meaning: ${answers.meaning ?? ""}
- Void: ${answers.void ?? ""}

Please combine these into one coherent personal essay.
`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      });

      const finalEssay =
        completion.choices[0]?.message?.content ?? "";

      res.json({ finalEssay });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "AI generation failed" });
    }
  }
);
