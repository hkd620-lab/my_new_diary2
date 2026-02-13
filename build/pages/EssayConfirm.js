"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EssayConfirm;
// src/pages/EssayConfirm.tsx
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../services/firebase");
function EssayConfirm() {
    const { essayId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [essay, setEssay] = (0, react_1.useState)(null);
    const [text, setText] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!essayId)
            return;
        async function loadEssay() {
            const ref = (0, firestore_1.doc)(firebase_1.db, "essays", essayId);
            const snap = await (0, firestore_1.getDoc)(ref);
            if (!snap.exists()) {
                alert("에세이를 찾을 수 없습니다.");
                navigate("/library");
                return;
            }
            const data = snap.data();
            if (data.status !== "draft") {
                alert("이미 확정된 에세이입니다.");
                navigate("/library");
                return;
            }
            setEssay(data);
            setText(data.draftEssay);
            setLoading(false);
        }
        loadEssay();
    }, [essayId, navigate]);
    async function handleConfirm() {
        if (!essayId)
            return;
        if (!window.confirm("이 에세이를 최종 확정하시겠습니까?\n확정 후에는 수정할 수 없습니다.")) {
            return;
        }
        try {
            setSaving(true);
            const ref = (0, firestore_1.doc)(firebase_1.db, "essays", essayId);
            await (0, firestore_1.updateDoc)(ref, {
                finalEssay: text,
                status: "confirmed",
            });
            navigate("/library");
        }
        catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
        finally {
            setSaving(false);
        }
    }
    if (loading) {
        return <div style={{ padding: 20 }}>불러오는 중…</div>;
    }
    if (!essay)
        return null;
    return (<div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>에세이 확정</h2>

      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
        {essay.sourceRange.from} ~ {essay.sourceRange.to}
      </div>

      {/* five elements 요약 */}
      <details style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          글의 구조 보기
        </summary>
        <ul style={{ fontSize: 14, marginTop: 8 }}>
          <li><b>제재</b> — {essay.fiveElements.subject}</li>
          <li><b>묘사</b> — {essay.fiveElements.description}</li>
          <li><b>연상</b> — {essay.fiveElements.association}</li>
          <li><b>성찰</b> — {essay.fiveElements.reflection}</li>
          <li><b>여백</b> — {essay.fiveElements.void}</li>
        </ul>
      </details>

      {/* 편집 영역 */}
      <textarea value={text} onChange={(e) => setText(e.target.value)} style={{
            width: "100%",
            minHeight: 360,
            padding: 14,
            fontSize: 15,
            lineHeight: 1.6,
            borderRadius: 10,
            border: "1px solid #cbd5f5",
            marginBottom: 20,
        }}/>

      {/* 액션 버튼 */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => navigate("/library")} disabled={saving} style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #cbd5f5",
            background: "#fff",
        }}>
          나중에
        </button>

        <button onClick={handleConfirm} disabled={saving} style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#2C3E50",
            color: "#fff",
            fontWeight: 600,
        }}>
          {saving ? "확정 중…" : "확정"}
        </button>
      </div>
    </div>);
}
