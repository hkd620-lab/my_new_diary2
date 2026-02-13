// src/services/essay.ts
// SAYU 수필 생성 서비스 - Firebase callable 호출

import { getFunctions, httpsCallable } from "firebase/functions";

// 수필 생성 결과 타입
export interface EssayResult {
  essayId: string;
  summary: string;
  fiveElements: {
    subject: string;
    description: string;
    association: string;
    reflection: string;
    void: string;
  };
  essay: string;
}

// 수필 생성 요청
export async function generateEssay(): Promise<EssayResult> {
  const functions = getFunctions();
  const refineDailyRecord = httpsCallable<void, EssayResult>(
    functions,
    "refineDailyRecord"
  );

  const result = await refineDailyRecord();
  return result.data;
}