import { Outlet } from "react-router-dom";
import BottomTab from "../components/BottomTab";

export default function Layout() {
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
      <main style={{ flex: 1, padding: "16px 16px 80px" }}>
        <Outlet />
      </main>
      <BottomTab />
    </div>
  );
}
