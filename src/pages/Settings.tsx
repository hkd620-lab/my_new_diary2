import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>설정</h1>
      <p style={{ marginBottom: 30 }}>닉네임, 언어, 구독을 관리합니다.</p>

      <button
        onClick={handleLogout}
        style={{
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          background: "#2C3E50",
          color: "#fff",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
