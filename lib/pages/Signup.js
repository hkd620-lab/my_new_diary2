"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Signup;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
function Signup() {
    const { signup } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signup(email, password);
            navigate("/");
        }
        catch (err) {
            setError(err.code || "회원가입 실패");
            console.error(err);
        }
    };
    return (<div>
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <br />

        <input type="password" placeholder="password (6자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <br />

        <button type="submit">회원가입</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        이미 계정이 있나요? <react_router_dom_1.Link to="/login">로그인</react_router_dom_1.Link>
      </p>
    </div>);
}
