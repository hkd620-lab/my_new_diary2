import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { saveRecord } from "../services/recordService";

/** 오늘 날짜 YYYY-MM-DD */
function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function WriteEdit() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;

  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const date = getToday();

  const [contents, setContents] = useState<Record<string, string>>(
    Object.fromEntries(
      (state?.sections || []).map((s: string) => [s, ""])
    )
  );

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const update = (k: string, v: string) =>
    setContents((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!user) {
      alert("로그인 중입니다. 잠시만 기다려 주세요.");
      return;
    }
    if (saving) return;

    setSaving(true);

    await saveRecord({
      uid: user.uid,
      date,
      weather: state.weather,
      mood: state.mood,
      sections: contents,
    });

    navigate("/library", { replace: true });
  };

  if (!state) {
    return (
      <div style={{ padding: 16 }}>
        <p>전달된 기록 정보가 없습니다.</p>
        <button onClick={() => navigate("/write")}>처음부터 다시</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>기록</h1>
      <p>{date}</p>

      <div style={{ marginBottom: 12 }}>
        날씨: {state.weather} · 기분: {state.mood}
      </div>

      {Object.keys(contents).map((s) => (
        <div key={s} style={{ marginBottom: 12 }}>
          <strong>{s}</strong>
          <textarea
            value={contents[s]}
            onChange={(e) => update(s, e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
        </div>
      ))}

      <button onClick={handleSave} disabled={saving}>
        {saving ? "저장 중…" : "저장"}
      </button>
    </div>
  );
}
