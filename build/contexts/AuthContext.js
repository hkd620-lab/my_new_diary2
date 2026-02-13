"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
exports.AuthProvider = AuthProvider;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../services/firebase");
const AuthContext = (0, react_1.createContext)({
    user: null,
    loading: true,
});
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsub = (0, auth_1.onAuthStateChanged)(firebase_1.auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);
    return (<AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>);
}
const useAuth = () => (0, react_1.useContext)(AuthContext);
exports.useAuth = useAuth;
