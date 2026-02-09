import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signup(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.code || "회원가입 실패");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="password"
          placeholder="password (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit">회원가입</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
