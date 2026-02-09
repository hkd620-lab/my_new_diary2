import { Routes, Route } from "react-router-dom";
import TabBar from "../components/TabBar";

import Write from "../pages/Write";
import Library from "../pages/Library";
import Stats from "../pages/Stats";
import Settings from "../pages/Settings";

export default function AppLayout() {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f7f6f3",
      }}
    >
      {/* 본문 */}
      <div style={{ flex: 1, paddingBottom: 56 }}>
        <Routes>
          <Route path="/" element={<Write />} />
          <Route path="/library" element={<Library />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      {/* 하단 탭바 */}
      <TabBar />
    </div>
  );
}
