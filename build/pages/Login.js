"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
function Login() {
    const { login } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        }
        catch (err) {
            setError(err.code || "로그인 실패");
            console.error(err);
        }
    };
    return (<main>
      <h1>로그인</h1>

      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required/>

        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required/>

        <button type="submit">로그인</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        계정이 없나요? <react_router_dom_1.Link to="/signup">회원가입</react_router_dom_1.Link>
      </p>
    </main>);
}
