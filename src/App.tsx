import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import Write from "./pages/Write";
import WriteEdit from "./pages/WriteEdit";
import Library from "./pages/Library";
import Essay from "./pages/Essay";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/write/edit" element={<WriteEdit />} />
        <Route path="/library" element={<Library />} />
        <Route path="/essay" element={<Essay />} />
      </Route>
    </Routes>
  );
}
