"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WriteEdit;
const react_router_dom_1 = require("react-router-dom");
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const recordService_1 = require("../services/recordService");
/** 오늘 날짜 YYYY-MM-DD */
function getToday() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
function WriteEdit() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { state } = (0, react_router_dom_1.useLocation)();
    const [user, setUser] = (0, react_1.useState)(null);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const date = getToday();
    const [contents, setContents] = (0, react_1.useState)(Object.fromEntries(((state === null || state === void 0 ? void 0 : state.sections) || []).map((s) => [s, ""])));
    (0, react_1.useEffect)(() => {
        const auth = (0, auth_1.getAuth)();
        const unsub = (0, auth_1.onAuthStateChanged)(auth, (u) => setUser(u));
        return () => unsub();
    }, []);
    const update = (k, v) => setContents((prev) => ({ ...prev, [k]: v }));
    const handleSave = async () => {
        if (!user) {
            alert("로그인 중입니다. 잠시만 기다려 주세요.");
            return;
        }
        if (saving)
            return;
        setSaving(true);
        await (0, recordService_1.saveRecord)({
            uid: user.uid,
            date,
            weather: state.weather,
            mood: state.mood,
            sections: contents,
        });
        navigate("/library", { replace: true });
    };
    if (!state) {
        return (<div style={{ padding: 16 }}>
        <p>전달된 기록 정보가 없습니다.</p>
        <button onClick={() => navigate("/write")}>처음부터 다시</button>
      </div>);
    }
    return (<div style={{ padding: 16 }}>
      <h1>기록</h1>
      <p>{date}</p>

      <div style={{ marginBottom: 12 }}>
        날씨: {state.weather} · 기분: {state.mood}
      </div>

      {Object.keys(contents).map((s) => (<div key={s} style={{ marginBottom: 12 }}>
          <strong>{s}</strong>
          <textarea value={contents[s]} onChange={(e) => update(s, e.target.value)} rows={4} style={{ width: "100%" }}/>
        </div>))}

      <button onClick={handleSave} disabled={saving}>
        {saving ? "저장 중…" : "저장"}
      </button>
    </div>);
}
