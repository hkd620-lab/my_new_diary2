"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Write;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AchievementInput_1 = __importDefault(require("../components/AchievementInput"));
const TextSection_1 = __importDefault(require("../components/TextSection"));
const recordService_1 = require("../services/recordService");
const SECTIONS = [
    { key: "achievement", label: "보람 있었던 일" },
    { key: "pride", label: "자랑하고 싶은 일" },
    { key: "impression", label: "마음에 남은 일" },
    { key: "regret", label: "아쉬웠던 일" },
    { key: "gratitude", label: "감사한 일" },
    { key: "void", label: "여백" },
];
function Write() {
    var _a, _b, _c, _d;
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [weather, setWeather] = (0, react_1.useState)(null);
    const [mood, setMood] = (0, react_1.useState)(null);
    const [selectedSections, setSelectedSections] = (0, react_1.useState)([]);
    const [activeSection, setActiveSection] = (0, react_1.useState)(null);
    const [sections, setSections] = (0, react_1.useState)({});
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [hovered, setHovered] = (0, react_1.useState)(null);
    const today = new Date().toISOString().slice(0, 10);
    const handleSectionClick = (key) => {
        if (!selectedSections.includes(key)) {
            setSelectedSections(prev => [...prev, key]);
        }
        setActiveSection(key);
    };
    const closeModal = () => setActiveSection(null);
    const onSave = async () => {
        if (!weather || !mood) {
            alert("날씨와 기분을 선택하세요");
            return;
        }
        setSaving(true);
        try {
            await (0, recordService_1.saveDailyRecord)({
                date: today,
                weather,
                mood,
                sections,
            });
            navigate("/library", { replace: true });
        }
        finally {
            setSaving(false);
        }
    };
    return (<>
      <div style={{ padding: 16 }}>
        <h4>날씨</h4>
        {["맑음", "흐림", "비", "눈"].map(v => (<button key={v} onClick={() => setWeather(v)} onMouseEnter={() => setHovered(v)} onMouseLeave={() => setHovered(null)} style={{
                marginRight: 8,
                marginBottom: 8,
                padding: "8px 14px",
                borderRadius: 20,
                border: weather === v ? "2px solid #2C3E50" : "1px solid #ccc",
                background: weather === v
                    ? "#2C3E50"
                    : hovered === v
                        ? "#eef1f4"
                        : "#fff",
                color: weather === v ? "#fff" : "#1F1F1F",
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}>
            {v}
          </button>))}

        <h4 style={{ marginTop: 20 }}>기분</h4>
        {["아주좋음", "좋음", "보통", "힘듦"].map(v => (<button key={v} onClick={() => setMood(v)} onMouseEnter={() => setHovered(v)} onMouseLeave={() => setHovered(null)} style={{
                marginRight: 8,
                marginBottom: 8,
                padding: "8px 14px",
                borderRadius: 20,
                border: mood === v ? "2px solid #2C3E50" : "1px solid #ccc",
                background: mood === v
                    ? "#2C3E50"
                    : hovered === v
                        ? "#eef1f4"
                        : "#fff",
                color: mood === v ? "#fff" : "#1F1F1F",
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}>
            {v}
          </button>))}

        <h4 style={{ marginTop: 24 }}>기록할 섹션 선택</h4>

        {SECTIONS.map(s => (<button key={s.key} onClick={() => handleSectionClick(s.key)} onMouseEnter={() => setHovered(s.key)} onMouseLeave={() => setHovered(null)} style={{
                display: "block",
                width: "100%",
                marginBottom: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: selectedSections.includes(s.key)
                    ? "2px solid #2C3E50"
                    : "1px solid #ddd",
                background: selectedSections.includes(s.key)
                    ? "#f0f2f5"
                    : hovered === s.key
                        ? "#f7f7f7"
                        : "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                fontWeight: 500,
            }}>
            {s.label}
          </button>))}

        <button onClick={onSave} disabled={saving} style={{
            marginTop: 28,
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            border: "none",
            background: "#2C3E50",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            opacity: saving ? 0.6 : 1,
            transition: "all 0.2s ease",
        }}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>

      {activeSection && (<div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999999,
            }} onClick={closeModal}>
          <div style={{
                background: "#FFFFFF",
                width: "92%",
                maxWidth: 420,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                animation: "fadeIn 0.2s ease",
            }} onClick={e => e.stopPropagation()}>
            {activeSection === "achievement" ? (<AchievementInput_1.default value={(_a = sections.achievement) !== null && _a !== void 0 ? _a : ""} onChange={v => setSections(p => (Object.assign(Object.assign({}, p), { achievement: v })))}/>) : (<TextSection_1.default title={(_c = (_b = SECTIONS.find(s => s.key === activeSection)) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : ""} placeholder="내용을 입력하세요" value={(_d = sections[activeSection]) !== null && _d !== void 0 ? _d : ""} onChange={v => setSections(p => (Object.assign(Object.assign({}, p), { [activeSection]: v })))}/>)}

            <button style={{
                marginTop: 20,
                width: "100%",
                padding: "10px 0",
                borderRadius: 10,
                border: "none",
                background: "#2C3E50",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
            }} onClick={closeModal}>
              완료
            </button>
          </div>
        </div>)}
    </>);
}
