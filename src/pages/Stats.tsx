import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState } from "react";

type StatItem = {
  mood: string;
  weather: string;
};

export default function Stats() {
  const [items, setItems] = useState<StatItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "records"));
      setItems(snap.docs.map((d) => d.data() as StatItem));
    };
    load();
  }, []);

  return (
    <div className="app-container">
      <h1>통계</h1>
      <p>기록 수: {items.length}</p>
    </div>
  );
}
