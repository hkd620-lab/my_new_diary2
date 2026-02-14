"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
const auth_1 = require("firebase/auth");
const react_router_dom_1 = require("react-router-dom");
const firebase_1 = require("../services/firebase");
function Settings() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = async () => {
        await (0, auth_1.signOut)(firebase_1.auth);
        navigate("/login");
    };
    return (<div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>설정</h1>
      <p style={{ marginBottom: 30 }}>닉네임, 언어, 구독을 관리합니다.</p>

      <button onClick={handleLogout} style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "#2C3E50",
            color: "#fff",
            cursor: "pointer",
            fontSize: 16,
        }}>
        로그아웃
      </button>
    </div>);
}
