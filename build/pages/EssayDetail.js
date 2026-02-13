"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EssayDetail;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../services/firebase");
function EssayDetail() {
    var _a, _b, _c, _d, _e, _f;
    const { essayId } = (0, react_router_dom_1.useParams)();
    const [essay, setEssay] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [notFound, setNotFound] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        async function fetchEssay() {
            if (!essayId) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            try {
                const ref = (0, firestore_1.doc)(firebase_1.db, "essays", essayId);
                const snap = await (0, firestore_1.getDoc)(ref);
                if (!snap.exists()) {
                    setNotFound(true);
                    return;
                }
                const data = snap.data();
                // final 상태가 아니면 차단
                if (data.status !== "final") {
                    setNotFound(true);
                    return;
                }
                setEssay({
                    id: snap.id,
                    type: data.type,
                    period: data.period,
                    finalContent: data.finalContent,
                    createdAt: data.createdAt,
                    status: data.status,
                });
            }
            catch (e) {
                console.error("❌ EssayDetail fetch error:", e);
                setNotFound(true);
            }
            finally {
                setLoading(false);
            }
        }
        fetchEssay();
    }, [essayId]);
    /* -------------------------------
       RENDER
    -------------------------------- */
    if (loading) {
        return <p>에세이를 불러오는 중입니다…</p>;
    }
    if (notFound || !essay) {
        return (<div>
        <h2>에세이를 찾을 수 없습니다</h2>
        <p style={{ color: "#666" }}>
          존재하지 않거나 아직 완성되지 않은 글입니다.
        </p>
      </div>);
    }
    return (<div>
      <h2>에세이</h2>

      <div style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
        {((_a = essay.type) !== null && _a !== void 0 ? _a : "ESSAY").toUpperCase()} ·{" "}
        {(_c = (_b = essay.period) === null || _b === void 0 ? void 0 : _b.start) !== null && _c !== void 0 ? _c : "?"} ~ {(_e = (_d = essay.period) === null || _d === void 0 ? void 0 : _d.end) !== null && _e !== void 0 ? _e : "?"}
      </div>

      <pre style={{
            whiteSpace: "pre-wrap",
            fontSize: 16,
            lineHeight: 1.7,
        }}>
        {((_f = essay.finalContent) === null || _f === void 0 ? void 0 : _f.trim())
            ? essay.finalContent
            : "※ 내용이 비어 있는 에세이입니다."}
      </pre>

      <p style={{ marginTop: 16, color: "#888" }}>
        🔒 이 글은 읽기 전용입니다.
      </p>
    </div>);
}
