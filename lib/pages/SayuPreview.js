"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SayuPreview;
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../services/firebase");
const sayuService_1 = require("../services/sayuService");
/** 섹션 라벨 (Library / Write 와 동일) */
const SECTION_LABEL_MAP = {
    achievement: "보람 있었던 일",
    pride: "자랑하고 싶은 일",
    impression: "마음에 남은 일",
    regret: "아쉬웠던 일",
    gratitude: "감사한 일",
    void: "여백 · 자유 메모",
};
function SayuPreview() {
    const auth = (0, auth_1.getAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [grouped, setGrouped] = (0, react_1.useState)({});
    const weekLabel = (0, sayuService_1.getThisWeekRangeLabel)();
    (0, react_1.useEffect)(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user)
                return;
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "records"), (0, firestore_1.where)("uid", "==", user.uid));
            const snap = await (0, firestore_1.getDocs)(q);
            const all = snap.docs.map(d => d.data());
            const thisWeek = (0, sayuService_1.filterThisWeekRecords)(all);
            const grouped = (0, sayuService_1.groupWeeklySections)(thisWeek);
            setGrouped(grouped);
            setLoading(false);
        };
        load();
    }, []);
    if (loading) {
        return <div style={{ padding: 16 }}>주간 기록 불러오는 중…</div>;
    }
    const sectionKeys = Object.keys(grouped);
    return (<div style={{ padding: 16 }}>
      <h1>SAYU · 주간 돌아보기</h1>

      {/* ✅ SAYU 철학 문구 */}
      <div style={{
            marginTop: 6,
            marginBottom: 16,
            fontSize: 14,
            color: "#555",
        }}>
        SAYU는 당신의 일주일을 조용히 정리해 줍니다.
      </div>

      {/* 주간 범위 */}
      <div style={{
            marginBottom: 20,
            fontSize: 13,
            color: "#777",
        }}>
        {weekLabel}
      </div>

      {sectionKeys.length === 0 && (<div style={{ color: "#777", marginTop: 20 }}>
          이번 주에 작성된 기록이 아직 없어요.
        </div>)}

      {sectionKeys.map(key => {
            var _a;
            return (<div key={key} style={{
                    marginBottom: 20,
                    padding: 14,
                    borderRadius: 12,
                    border: "1px solid #e0e0e0",
                    background: key === "void" ? "#fafafa" : "#fff",
                }}>
          <div style={{
                    fontWeight: 700,
                    marginBottom: 8,
                }}>
            {(_a = SECTION_LABEL_MAP[key]) !== null && _a !== void 0 ? _a : key}
          </div>

          {grouped[key].map((item, idx) => (<div key={idx} style={{
                        marginBottom: 10,
                        fontSize: 14,
                        lineHeight: 1.6,
                    }}>
              <div style={{
                        fontSize: 12,
                        color: "#888",
                        marginBottom: 2,
                    }}>
                {item.date}
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {item.value}
              </div>
            </div>))}
        </div>);
        })}
    </div>);
}
