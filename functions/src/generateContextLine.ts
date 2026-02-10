import * as functions from "firebase-functions";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey });

export const generateContextLine = functions.https.onCall(
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
You are an assistant for a reflective diary app.

Rules:
- Do NOT ask questions.
- Do NOT evaluate, praise, or advise.
- Do NOT judge completeness.
- Use ONLY the user's text.
- Write 1 or 2 short sentences.
- Use neutral, observational language.
- Your only role is to help the user look again at their own writing.
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
      max_tokens: 80,
    });

    const summary = response.choices[0].message.content?.trim() ?? "";

    return { summary };
  }
);
