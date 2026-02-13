import { Routes, Route } from "react-router-dom";
import Write from "../pages/Write";
import Library from "../pages/Library";
import Sayu from "../pages/Sayu";
import Stats from "../pages/Stats";
import Settings from "../pages/Settings";
import TabBar from "../components/TabBar";

export default function AppLayout() {
  return (
    <div style={{ paddingBottom: 70 }}>
      <Routes>
        <Route path="/" element={<Write />} />
        <Route path="/library" element={<Library />} />
        <Route path="/sayu" element={<Sayu />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <TabBar />
    </div>
  );
}
