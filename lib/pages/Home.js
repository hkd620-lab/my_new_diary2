"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_router_dom_1 = require("react-router-dom");
function Home() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (<div style={{ padding: 16 }}>
      <h2>오늘의 기록</h2>
      
      <button onClick={() => navigate("/write")} style={{
            marginTop: 20,
            width: "100%",
            padding: "16px 0",
            borderRadius: 12,
            border: "none",
            background: "#2c7be5",
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
        }}>
        ✏️ 오늘 일기 쓰기
      </button>
    </div>);
}
