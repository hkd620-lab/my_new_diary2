import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { db } from "../services/firebase";

type RecordItem = {
  id: string;
  date: string;
  weather: string;
  mood: string;
  sections: Record<string, string>;
  createdAt?: any;
  uid: string;
};

const LABEL_MAP: Record<string, string> = {
  achievement: "보람 있었던 일",
  regret: "아쉬웠던 일",
  impression: "마음에 남은 일",
  pride: "자랑하고 싶은 일",
  memo: "메모",
};

export default function Library() {
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<Record<string, RecordItem[]>>({});
  const [user, setUser] = useState<User | null>(null);

  // 인증 상태 감시
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // user 확보 후 Firestore 조회
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const items: RecordItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      const byDate: Record<string, RecordItem[]> = {};
      for (const it of items) {
        if (!byDate[it.date]) byDate[it.date] = [];
        byDate[it.date].push(it);
      }

      setGrouped(byDate);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return <div style={{ padding: 16 }}>불러오는 중…</div>;
  }

  const dates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>서재</h1>

      {dates.map((date) => (
        <section key={date} style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 8 }}>{date}</h2>

          {grouped[date].map((rec) => (
            <article
              key={rec.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <div style={{ marginBottom: 8, color: "#555" }}>
                날씨: {rec.weather} · 기분: {rec.mood}
              </div>

              {Object.entries(rec.sections || {})
                .filter(([, v]) => v && v.trim().length > 0)
                .map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 6 }}>
                    <strong>{LABEL_MAP[k] || k}</strong>
                    <div>{v}</div>
                  </div>
                ))}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
