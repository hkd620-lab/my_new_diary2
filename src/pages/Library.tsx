import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { mergeRecordsByDate } from "../services/recordMerge";

type DayItem = {
  date: string;
  weather: string;
  mood: string;
  sections: Record<string, string>;
};

export default function Library() {
  console.log("🔥 REAL Library.tsx LOADED"); // ✅ 확인용

  const [day, setDay] = useState<DayItem | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "records"),
        where("uid", "==", user.uid),
        where("date", "==", new Date().toISOString().slice(0, 10))
      );

      const snap = await getDocs(q);
      const records = snap.docs.map(d => d.data());

      const merged = mergeRecordsByDate(records as any[]);
      setDay(merged);
    };

    load();
  }, []);

  if (!day) return <div style={{ padding: 16 }}>기록 없음</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>서재</h1>
      <h2>{day.date}</h2>
      <div style={{ marginBottom: 12 }}>
        날씨: {day.weather} · 기분: {day.mood}
      </div>

      {Object.entries(day.sections).map(([key, value]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <strong>{key}</strong>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
}
