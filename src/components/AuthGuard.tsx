import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: 24 }}>인증 확인 중…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return (
      <main>
        <h1>이메일 인증 필요</h1>
        <p>
          선생님의 메일함에 도착한 확인 메일을 열어주십시오.
          <br />
          인증 후 정갈한 마음으로 뵙겠습니다.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
