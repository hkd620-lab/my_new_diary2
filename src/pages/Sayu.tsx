import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";

const DEV_MODE = true; // 개발 모드

type RecordDoc = {
  date: string;
  weather?: string;
  temperature?: string;
  mood?: string;
  sections?: Record<string, string>;
};

export default function Sayu() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [essay, setEssay] = useState("");
  const [records, setRecords] = useState<RecordDoc[]>([]);

  useEffect(() => {
    checkEligibility();
    fetchLast7Days();
  }, []);

  // 168시간(7일) 제한 확인
  async function checkEligibility() {
    if (DEV_MODE) {
      setCanGenerate(true);
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "essays"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setCanGenerate(true);
        return;
      }

      const lastDoc = snap.docs[0];
      const lastCreated = lastDoc.data().createdAt?.toDate();
      setLastGenerated(lastCreated);

      const now = new Date();
      const diff = now.getTime() - lastCreated.getTime();
      const hours = diff / (1000 * 60 * 60);

      if (hours >= 168) {
        setCanGenerate(true);
      } else {
        setCanGenerate(false);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 최근 7일 기록 가져오기
  async function fetchLast7Days() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateString = sevenDaysAgo.toISOString().split("T")[0];

      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        where("date", ">=", dateString),
        orderBy("date", "desc")
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => doc.data()) as RecordDoc[];
      setRecords(list);
    } catch (e) {
      console.error(e);
    }
  }

  // SAYU 생성
  async function generateSayu() {
    if (records.length === 0) {
      alert("최근 7일간 기록이 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const tempEssay = `지난 일주일을 돌이켜본다.

${records.length}개의 기록이 쌓였다. 
날씨는 ${records[0]?.weather || "기록 없음"}이었고, 
기분은 ${records[0]?.mood || "기록 없음"}이었다.

아직 AI 연결 전이므로 임시 텍스트입니다.
Gemini API 연결 후 실제 수필이 생성됩니다.`;

      setEssay(tempEssay);

      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "essays"), {
          uid: user.uid,
          content: tempEssay,
          createdAt: Timestamp.now(),
        });
      }

      if (!DEV_MODE) {
        setCanGenerate(false);
      }
    } catch (e) {
      console.error(e);
      alert("생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "serif",
      }}
    >
      <h2 style={{ marginBottom: 20, fontSize: 22, fontWeight: 600 }}>
        SAYU
      </h2>

      <div style={{ marginBottom: 20, fontSize: 14, color: "#666" }}>
        최근 7일간 기록: {records.length}개
      </div>

      {!DEV_MODE && !canGenerate && lastGenerated && (
        <div
          style={{
            padding: 16,
            background: "#FFF3CD",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          다음 생성 가능 시간:{" "}
          {new Date(
            lastGenerated.getTime() + 168 * 60 * 60 * 1000
          ).toLocaleString("ko-KR")}
        </div>
      )}

      <button
        onClick={generateSayu}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 0",
          background: !loading ? "#2C3E50" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: !loading ? "pointer" : "not-allowed",
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        {loading ? "사유 생성 중..." : "사유 생성"}
      </button>

      {essay && (
        <div
          style={{
            padding: 20,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
        >
          {essay}
        </div>
      )}
    </div>
  );
}
