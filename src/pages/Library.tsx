import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

type RecordDoc = {
  id: string;
  date: string;
  weather?: string;
  temperature?: string;
  mood?: string;
  sections?: Record<string, string>;
  createdAt?: any;
};

export default function Library() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"today" | "yesterday" | "custom">("today");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    async function fetch() {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const q = query(
          collection(db, "records"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RecordDoc[];
        setRecords(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // 필터링된 기록
  const filteredRecords = records.filter((r) => {
    if (filter === "today") return r.date === today;
    if (filter === "yesterday") return r.date === yesterday;
    if (filter === "custom" && selectedDate) return r.date === selectedDate;
    return false;
  });

  // 🔥 같은 날짜 중 가장 최근 기록만 선택
  const latestRecords: Record<string, RecordDoc> = {};
  filteredRecords.forEach((record) => {
    if (!latestRecords[record.date]) {
      latestRecords[record.date] = record;
    }
  });

  const finalRecords = Object.values(latestRecords);

  if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setFilter("today")}
          style={{
            flex: 1,
            padding: "12px 0",
            background: filter === "today" ? "#333" : "#fff",
            color: filter === "today" ? "#fff" : "#333",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          오늘
        </button>
        <button
          onClick={() => setFilter("yesterday")}
          style={{
            flex: 1,
            padding: "12px 0",
            background: filter === "yesterday" ? "#333" : "#fff",
            color: filter === "yesterday" ? "#fff" : "#333",
            border: "1px solid #ddd",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          어제
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setFilter("custom");
          }}
          style={{
            flex: 1,
            padding: "12px 8px",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 15,
            cursor: "pointer",
          }}
        />
      </div>

      {finalRecords.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
          이 날의 기록이 없습니다.
        </div>
      )}

      {finalRecords.map((r) => (
        <div
          key={r.id}
          style={{
            marginBottom: 20,
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{r.date}</h3>
          <div style={{ fontSize: 14, marginTop: 8, color: "#666" }}>
            {r.weather} · {r.temperature} · {r.mood}
          </div>
          <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />
          {r.sections &&
            Object.entries(r.sections).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10, fontSize: 14 }}>
                <strong>{k}</strong>: {v}
              </div>
            ))}
          
          <button
            onClick={() => navigate("/sayu")}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px 0",
              background: "#2C3E50",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            → SAYU로 이동
          </button>
        </div>
      ))}
    </div>
  );
}
