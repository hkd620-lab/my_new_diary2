"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const react_router_dom_1 = require("react-router-dom");
const firebase_1 = require("../services/firebase");
function Login() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
            navigate("/");
        }
        catch (err) {
            setError("로그인 실패: 이메일 또는 비밀번호를 확인하십시오.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#F7F6F3",
        }}>
      <div style={{
            width: 320,
            padding: 30,
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}>
        <h1 style={{ marginBottom: 20, textAlign: "center" }}>로그인</h1>

        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
        }}/>

        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #ddd",
        }}/>

        {error && (<div style={{ color: "red", marginBottom: 10 }}>{error}</div>)}

        <button onClick={handleLogin} disabled={loading} style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#2C3E50",
            color: "#fff",
            cursor: "pointer",
            fontSize: 15,
        }}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div style={{ marginTop: 15, textAlign: "center" }}>
          계정이 없나요? <react_router_dom_1.Link to="/signup">회원가입</react_router_dom_1.Link>
        </div>
      </div>
    </div>);
}
