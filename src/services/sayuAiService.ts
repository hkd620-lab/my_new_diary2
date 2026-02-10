import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

/**
 * 일기 내용을 바탕으로
 * AI가 다음 질문 1개 또는 DONE을 반환
 */
export async function generateEssayQuestion(params: {
  sections: Record<string, string>;
  qaLog?: Array<{ q: string; a: string }>;
}) {
  const callable = httpsCallable(functions, "generateEssayQuestion");

  const res = await callable({
    sections: params.sections,
    qaLog: params.qaLog ?? [],
  });

  return res.data as {
    question: string;
  };
}
