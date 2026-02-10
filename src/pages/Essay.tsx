import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";

/** 글쓰기 지도 질문 (정서 곡선 · 문학 톤) */
const GUIDE_QUESTIONS = [
  {
    key: "subject",
    title: "이 글의 중심 장면",
    question:
      "오늘 하루를 떠올릴 때, 이 글의 중심에 두고 싶은 장면이나 순간은 무엇인가요?",
  },
  {
    key: "description",
    title: "장면의 감각",
    question:
      "그 장면 속에서 가장 먼저 느껴졌던 감각은 무엇이었나요?",
  },
  {
    key: "association",
    title: "자연스러운 연결",
    question:
      "이 장면이 다른 기억이나 요즘 생각과 이어진다면 무엇이 떠오르나요?",
  },
  {
    key: "reflection",
    title: "하루의 의미",
    question:
      "시간이 지난 지금, 이 하루가 남긴 감정이나 의미는 무엇인가요?",
  },
  {
    key: "void",
    title: "남겨두는 마음",
    question:
      "말로 다 하지 않고 조용히 남겨두고 싶은 마음이 있다면 무엇인가요?",
  },
];

type LocationState = {
  date?: string;
  readOnly?: boolean;
};

export default function Essay() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const state = (location.state as LocationState) || {};

  const readOnly = state.readOnly ?? false;
  const date = state.date ?? new Date().toLocaleDateString("sv-SE");

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  /** 글쓰기 지도 상태 */
  const [guideMode, setGuideMode] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  /** 기존 에세이 로드 */
  useEffect(() => {
    const loadEssay = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "essays"),
        where("uid", "==", user.uid),
        where("date", "==", date)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setContent(data.finalEssay ?? "");
      }
    };

    loadEssay();
  }, [auth, date]);

  /** 다음 질문 */
  const goNext = () => {
    if (!currentAnswer.trim()) {
      alert("답변을 입력해 주세요.");
      return;
    }

    const q = GUIDE_QUESTIONS[step];
    setAnswers(prev => ({ ...prev, [q.key]: currentAnswer }));
    setCurrentAnswer("");
    setStep(step + 1);
  };

  /** 이전 질문 */
  const goPrev = () => {
    if (step === 0) return;
    const prevKey = GUIDE_QUESTIONS[step - 1].key;
    setCurrentAnswer(answers[prevKey] ?? "");
    setStep(step - 1);
  };

  /** 답변 → 에세이 생성 */
  const generateEssayFromAnswers = () => {
    const essay = `
${answers.subject ?? ""}

—

${answers.description ?? ""}

${answers.association ?? ""}

${answers.reflection ?? ""}

${answers.void ?? ""}
`.trim();

    setContent(essay);

    // 상태 초기화
    setGuideMode(false);
    setStep(0);
    setAnswers({});
    setCurrentAnswer("");
  };

  /** 🔒 가이드 시작 (기존 에세이 잔상 제거) */
  const startGuide = () => {
    setContent("");          // ← 추천 보완 핵심
    setGuideMode(true);
    setStep(0);
    setAnswers({});
    setCurrentAnswer("");
  };

  /** 저장 */
  const onSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);

    try {
      const q = query(
        collection(db, "essays"),
        where("uid", "==", user.uid),
        where("date", "==", date)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          finalEssay: content,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, "essays"), {
          uid: user.uid,
          date,
          finalEssay: content,
          createdAt: Timestamp.now(),
        });
      }

      navigate("/library");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>오늘의 에세이</h1>

      {!readOnly && !guideMode && (
        <button
          onClick={startGuide}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 12,
            borderRadius: 8,
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            fontWeight: 700,
          }}
        >
          글을 여는 질문을 받아보기
        </button>
      )}

      {guideMode && step < GUIDE_QUESTIONS.length && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            {step + 1} / {GUIDE_QUESTIONS.length}
          </div>

          <div style={{ fontWeight: 700 }}>
            {GUIDE_QUESTIONS[step].title}
          </div>
          <div>{GUIDE_QUESTIONS[step].question}</div>

          <textarea
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            style={{
              width: "100%",
              minHeight: 120,
              marginTop: 8,
              padding: 10,
            }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={goPrev} disabled={step === 0}>
              이전
            </button>
            <button
              onClick={
                step === GUIDE_QUESTIONS.length - 1
                  ? generateEssayFromAnswers
                  : goNext
              }
            >
              {step === GUIDE_QUESTIONS.length - 1
                ? "에세이로 옮기기"
                : "다음"}
            </button>
          </div>
        </div>
      )}

      <textarea
        value={content}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : 0}
        onChange={e => !readOnly && setContent(e.target.value)}
        style={{
          width: "100%",
          minHeight: 260,
          padding: 14,
          borderRadius: 12,
          border: readOnly ? "none" : "1px solid #cbd5f5",
          background: readOnly ? "#f8fafc" : "#fff",
          lineHeight: 1.8,
        }}
      />

      {!readOnly && (
        <button
          onClick={onSave}
          disabled={saving}
          style={{ marginTop: 16 }}
        >
          {saving ? "저장 중..." : "오늘의 에세이 저장"}
        </button>
      )}
    </div>
  );
}
