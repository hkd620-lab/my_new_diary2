import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Library from "../pages/Library";
import Stats from "../pages/Stats";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import TabBar from "../components/TabBar";
import { AuthProvider } from "../services/AuthContext";
import AuthGuard from "../components/AuthGuard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path="/library"
            element={
              <AuthGuard>
                <Library />
              </AuthGuard>
            }
          />
          <Route
            path="/stats"
            element={
              <AuthGuard>
                <Stats />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
        </Routes>

        <TabBar />
      </BrowserRouter>
    </AuthProvider>
  );
}
