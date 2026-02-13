import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return (
      <div style={{ padding: 20 }}>
        선생님의 메일함에 도착한 확인 메일을 열어주십시오.
        인증 후 정갈한 마음으로 뵙겠습니다.
      </div>
    );
  }

  return <>{children}</>;
}
