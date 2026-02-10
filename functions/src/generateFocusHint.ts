import * as functions from "firebase-functions";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey });

export const generateFocusHint = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    const { content } = data;

    if (!content || typeof content !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "content is required"
      );
    }

    const systemPrompt = `
You are a quiet mirror for a diary writer.

Rules:
- Do NOT ask questions.
- Do NOT judge completeness.
- Do NOT evaluate or advise.
- Use ONLY the user's text.
- Write ONE short sentence.
- Describe only what is visible in the text.
`;

    const userPrompt = `
User diary text:
${content}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 60,
    });

    const hint =
      response.choices[0].message.content?.trim() ?? "";

    return { hint };
  }
);
