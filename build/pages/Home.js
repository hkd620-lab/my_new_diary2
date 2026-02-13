"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_router_dom_1 = require("react-router-dom");
function getTodayKorean() {
    const now = new Date();
    return now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
    });
}
function Home() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (<div style={{
            padding: "40px 20px",
            minHeight: "100vh",
            background: "#F7F6F3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
            fontSize: 14,
            color: "#888",
            marginBottom: 12,
            letterSpacing: "1px",
        }}>
          {getTodayKorean()}
        </div>

        <h1 style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#1F1F1F",
            marginBottom: 24,
        }}>
          HARU
        </h1>

        <div style={{
            fontSize: 16,
            color: "#555",
            lineHeight: 1.8,
            marginBottom: 40,
        }}>
          비움으로 채우는 한 주의 사유
        </div>

        <button onClick={() => navigate("/write")} style={{
            padding: "14px 40px",
            borderRadius: 30,
            border: "1px solid #2C3E50",
            background: "#2C3E50",
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
        }}>
          오늘을 기록하기
        </button>
      </div>
    </div>);
}
