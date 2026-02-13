"use strict";
// src/pages/Onboarding.tsx
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Onboarding;
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const react_router_dom_1 = require("react-router-dom");
const firebase_1 = require("../services/firebase");
const AuthContext_1 = require("../contexts/AuthContext");
function Onboarding() {
    const { user } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [nickname, setNickname] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const handleSubmit = async () => {
        if (!user)
            return;
        if (!nickname.trim()) {
            setError("닉네임을 입력하십시오.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            // 🔥 문서 없으면 생성, 있으면 병합
            await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                nickname: nickname.trim(),
                createdAt: (0, firestore_1.serverTimestamp)(),
            }, { merge: true });
            navigate("/");
        }
        catch (err) {
            console.error("Onboarding 저장 오류:", err);
            setError("저장 중 오류가 발생했습니다.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1>처음 오셨군요.</h1>
      <p style={{ marginBottom: 16 }}>
        이곳에서 사용할 닉네임을 정해주십시오.
      </p>

      <input type="text" placeholder="닉네임 입력" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
        }}/>

      {error && (<p style={{ color: "crimson", marginBottom: 12 }}>
          {error}
        </p>)}

      <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%",
            padding: 14,
            background: "#2f3e4e",
            color: "white",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
        }}>
        {loading ? "저장 중…" : "시작하기"}
      </button>
    </main>);
}
