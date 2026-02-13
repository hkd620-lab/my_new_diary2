import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
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

export default function Library() {
  const auth = getAuth();
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

  const filteredRecords = records.filter((r) => {
    if (filter === "today") return r.date === today;
    if (filter === "yesterday") return r.date === yesterday;
    if (filter === "custom" && selectedDate) return r.date === selectedDate;
    return false;
  });

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

      {filteredRecords.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
          이 날의 기록이 없습니다.
        </div>
      )}

      {filteredRecords.map((r) => (
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
        </div>
      ))}
    </div>
  );
}
