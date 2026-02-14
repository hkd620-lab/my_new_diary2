"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthGuard;
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
function AuthGuard({ children }) {
    const { user, loading } = (0, AuthContext_1.useAuth)();
    if (loading)
        return null;
    if (!user) {
        return <react_router_dom_1.Navigate to="/login" replace/>;
    }
    if (!user.emailVerified) {
        return (<div style={{ padding: 20 }}>
        선생님의 메일함에 도착한 확인 메일을 열어주십시오.
        인증 후 정갈한 마음으로 뵙겠습니다.
      </div>);
    }
    return <>{children}</>;
}
