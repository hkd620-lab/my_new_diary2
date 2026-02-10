import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { mergeRecordsByDate } from "../services/recordMerge";

type DayItem = {
  date: string;
  weather: string;
  temperature: string;
  mood: string;
  sections: Record<string, string>;
};

/** 섹션 순서 및 라벨 (Write와 동일) */
const SECTION_ORDER = [
  { key: "achievement", label: "보람 있었던 일" },
  { key: "pride", label: "자랑하고 싶은 일" },
  { key: "impression", label: "마음에 남은 일" },
  { key: "regret", label: "아쉬웠던 일" },
  { key: "gratitude", label: "감사한 일" },
  { key: "void", label: "여백 · 자유 메모" },
];

export default function Library() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [dates, setDates] = useState<string[]>([]);
  const [day, setDay] = useState<DayItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadDates = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        orderBy("date", "desc")
      );

      const snap = await getDocs(q);
      const all = snap.docs.map(d => d.data());

      const uniqueDates = Array.from(
        new Set(all.map(r => r.date))
      ) as string[];

      setDates(uniqueDates);

      if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }
    };

    loadDates();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const loadDay = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        where("date", "==", selectedDate)
      );

      const snap = await getDocs(q);
      const records = snap.docs.map(d => d.data());

      const merged = mergeRecordsByDate(records as any[]);
      setDay(merged);
    };

    loadDay();
  }, [selectedDate]);

  if (dates.length === 0) {
    return <div style={{ padding: 16 }}>기록 없음</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>서재</h1>

      {/* 날짜 선택 */}
      <div style={{ marginBottom: 16 }}>
        {dates.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            style={{
              marginRight: 8,
              marginBottom: 8,
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: d === selectedDate ? "#2c7be5" : "#fff",
              color: d === selectedDate ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* 읽기 영역 */}
      {day && (
        <>
          <h2 style={{ marginBottom: 8 }}>{day.date}</h2>
          <div style={{ marginBottom: 20, color: "#444" }}>
            날씨: {day.weather} · 기온: {day.temperature} · 기분: {day.mood}
          </div>

          {SECTION_ORDER.map(s => {
            const value = day.sections[s.key];
            if (!value) return null;

            const isVoid = s.key === "void";

            return (
              <div
                key={s.key}
                style={{
                  marginBottom: 16,
                  padding: 14,
                  borderRadius: 10,
                  background: isVoid ? "#fafafa" : "#fff",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>

                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {value}
                </div>
              </div>
            );
          })}

          {/* ✅ 에세이로 이동 */}
          <button
            onClick={() =>
              navigate("/essay", {
                state: {
                  source: "library",
                  date: day.date,
                  sections: day.sections,
                },
              })
            }
            style={{
              marginTop: 24,
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              border: "none",
              background: "#1e293b",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            이 기록으로 에세이 쓰기
          </button>
        </>
      )}
    </div>
  );
}
