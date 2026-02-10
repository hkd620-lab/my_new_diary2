import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

type EssayItem = {
  id: string;
  date: string;
  finalEssay: string;
};

export default function Sayu() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [essays, setEssays] = useState<EssayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEssays = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "essays"),
        where("uid", "==", user.uid),
        orderBy("date", "desc")
      );

      const snap = await getDocs(q);

      const list: EssayItem[] = snap.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<EssayItem, "id">),
        }))
        .filter(item => item.finalEssay && item.finalEssay.trim().length > 0);

      setEssays(list);
      setLoading(false);
    };

    loadEssays();
  }, [auth]);

  if (loading) {
    return <div style={{ padding: 16 }}>불러오는 중…</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>사유 (SAYU)</h1>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        글이 된 생각들이 머무는 곳
      </p>

      {essays.length === 0 && (
        <div style={{ color: "#94a3b8" }}>
          아직 완성된 에세이가 없습니다.
        </div>
      )}

      {essays.map(item => {
        const preview =
          item.finalEssay.split("\n").find(line => line.trim()) ?? "";

        return (
          <div
            key={item.id}
            onClick={() =>
              navigate("/essay", { state: { date: item.date } })
            }
            style={{
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 13, color: "#64748b" }}>
              {item.date}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 15,
                lineHeight: 1.6,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {preview}
            </div>
          </div>
        );
      })}
    </div>
  );
}
