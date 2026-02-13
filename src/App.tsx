import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import AuthGuard from "./components/AuthGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 루트 경로 명확히 지정 */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
