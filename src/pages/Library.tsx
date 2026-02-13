import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";

type RecordDoc = {
  id: string;
  date: string;
  weather?: string;
  temperature?: string;
  mood?: string;
  sections?: Record<string, string>;
};

const SECTION_LABELS: Record<string, string> = {
  achievement: "보람 있었던 일",
  pride: "자랑하고 싶은 일",
  impression: "마음에 남은 일",
  regret: "아쉬웠던 일",
  memo: "기록",
};

const SECTION_ORDER = [
  "achievement",
  "pride",
  "impression",
  "regret",
  "memo",
];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function Library() {
  const auth = getAuth();

  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  const [selectedDate, setSelectedDate] = useState(today);
  const [record, setRecord] = useState<RecordDoc | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchByDate(date: string) {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        where("date", "==", date)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const doc0 = snap.docs[0];
        const data = doc0.data();

        setRecord({
          id: doc0.id,
          date: data.date,
          weather: data.weather,
          temperature: data.temperature,
          mood: data.mood,
          sections: data.sections,
        });
      } else {
        setRecord(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchByDate(selectedDate);
  }, [selectedDate]);

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    borderRadius: 30,
    border: active ? "1px solid #2C3E50" : "1px solid #ddd",
    background: active ? "#2C3E50" : "#ffffff",
    color: active ? "#ffffff" : "#2C3E50",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.25s ease",
    fontFamily: "serif",
    letterSpacing: "0.5px",
  });

  return (
    <div
      style={{
        paddingTop: 40,        // 🔹 기록장과 동일한 상단 여백
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "serif",
        background: "#F7F6F3",
        minHeight: "100vh",
      }}
    >
      {/* 날짜 선택 카드 */}
      <div
        style={{
          background: "#ffffff",
          padding: 18,
          borderRadius: 20,
          marginBottom: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={pillStyle(selectedDate === today)}
              onClick={() => setSelectedDate(today)}
            >
              오늘
            </button>

            <button
              style={pillStyle(selectedDate === yesterday)}
              onClick={() => setSelectedDate(yesterday)}
            >
              어제
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              border: "none",
              borderBottom: "1px solid #2C3E50",
              padding: "6px 4px",
              fontSize: 14,
              fontFamily: "serif",
              background: "transparent",
              color: "#2C3E50",
              outline: "none",
            }}
          />
        </div>
      </div>

      {loading && <div>불러오는 중...</div>}

      {!loading && !record && (
        <div style={{ opacity: 0.6 }}>선택한 날짜의 기록이 없습니다.</div>
      )}

      {!loading && record && (
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ margin: 0 }}>{record.date}</h3>

          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#555",
            }}
          >
            날씨: {record.weather} · 체감: {record.temperature} · 기분:{" "}
            {record.mood}
          </div>

          <hr style={{ margin: "16px 0" }} />

          {record.sections &&
            SECTION_ORDER.map((key) => {
              const value = record.sections?.[key];
              if (!value) return null;

              return (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    {SECTION_LABELS[key]}
                  </div>
                  <div style={{ lineHeight: 1.7 }}>{value}</div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
