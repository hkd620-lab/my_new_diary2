"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Write;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../services/firebase");
const WEATHER = ["맑음", "흐림", "비", "눈", "황사", "안개"];
const TEMPERATURE = ["매우 더움", "더움", "따뜻함", "선선함", "쌀쌀함", "매우 추움"];
const MOOD = ["아주 좋음", "좋음", "보통", "우울함", "힘듦"];
const SECTIONS = ["보람", "자랑", "아쉬움", "감사", "여백"];
function Write() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const auth = (0, auth_1.getAuth)();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const [selectedWeather, setSelectedWeather] = (0, react_1.useState)("");
    const [selectedTemp, setSelectedTemp] = (0, react_1.useState)("");
    const [selectedMood, setSelectedMood] = (0, react_1.useState)("");
    const [sectionTexts, setSectionTexts] = (0, react_1.useState)({});
    const [activeSection, setActiveSection] = (0, react_1.useState)(null);
    const [popupText, setPopupText] = (0, react_1.useState)("");
    const [saving, setSaving] = (0, react_1.useState)(false);
    const hasContent = Object.values(sectionTexts).some((v) => v && v.trim().length > 0);
    const openPopup = (section) => {
        setActiveSection(section);
        setPopupText(sectionTexts[section] || "");
    };
    const saveSection = () => {
        if (!activeSection)
            return;
        setSectionTexts({
            ...sectionTexts,
            [activeSection]: popupText,
        });
        setActiveSection(null);
    };
    const handleSaveToFirestore = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!hasContent)
            return;
        try {
            setSaving(true);
            await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "records"), {
                uid: user.uid,
                date: today,
                weather: selectedWeather || "",
                temperature: selectedTemp || "",
                mood: selectedMood || "",
                sections: sectionTexts,
                createdAt: (0, firestore_1.serverTimestamp)(),
            });
            navigate("/library");
        }
        catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
        finally {
            setSaving(false);
        }
    };
    const buttonStyle = (active) => ({
        padding: "8px 14px",
        borderRadius: 14,
        border: "1px solid #dcdcdc",
        background: active ? "#2C3E50" : "#fff",
        color: active ? "#fff" : "#1F1F1F",
        cursor: "pointer",
        fontSize: 13,
    });
    const sectionTitleStyle = {
        fontWeight: 800,
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: "1px solid #E5E5E5",
        fontSize: 14,
    };
    return (<div style={{
            padding: "22px 24px 12px 30px",
            maxWidth: 420,
            margin: "0 auto",
            fontFamily: "serif",
        }}>
      <h2 style={{ marginBottom: 28, fontSize: 20, fontWeight: 600 }}>
        HARU {today}
      </h2>

      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitleStyle}>날씨</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {WEATHER.map((w) => (<button key={w} onClick={() => setSelectedWeather(w)} style={buttonStyle(selectedWeather === w)}>
              {w}
            </button>))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitleStyle}>체감</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {TEMPERATURE.map((t) => (<button key={t} onClick={() => setSelectedTemp(t)} style={buttonStyle(selectedTemp === t)}>
              {t}
            </button>))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={sectionTitleStyle}>기분</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {MOOD.map((m) => (<button key={m} onClick={() => setSelectedMood(m)} style={buttonStyle(selectedMood === m)}>
              {m}
            </button>))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={sectionTitleStyle}>기록할 섹션</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SECTIONS.map((s) => (<button key={s} onClick={() => openPopup(s)} style={buttonStyle(!!sectionTexts[s])}>
              {s}
            </button>))}
        </div>
      </div>

      {activeSection && (<div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
          <div style={{ background: "#fff", padding: 20, width: 320, borderRadius: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              {activeSection} 기록
            </div>
            <textarea value={popupText} onChange={(e) => setPopupText(e.target.value)} style={{ width: "100%", height: 100, borderRadius: 8, border: "1px solid #ccc", padding: 8 }}/>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button onClick={saveSection} style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2C3E50",
                color: "#fff",
                cursor: "pointer"
            }}>
                저장
              </button>
            </div>
          </div>
        </div>)}

      {hasContent && (<button onClick={handleSaveToFirestore} disabled={saving} style={{
                position: "fixed",
                bottom: 80,
                right: 30,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                background: "#2C3E50",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
            }}>
          ➜
        </button>)}
    </div>);
}
