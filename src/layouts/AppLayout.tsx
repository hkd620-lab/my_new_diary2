import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          minHeight: "100vh",
          paddingBottom: 72,
          boxSizing: "border-box",
          background: "#fafafa",
        }}
      >
        <Outlet />

        {/* 하단 탭바 */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            maxWidth: 420,
            height: 60,
            background: "#fff",
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <NavLink to="/" style={linkStyle}>홈</NavLink>
          <NavLink to="/write" style={linkStyle}>기록</NavLink>
          <NavLink to="/library" style={linkStyle}>서재</NavLink>
          <NavLink to="/essay" style={linkStyle}>에세이</NavLink>
        </nav>
      </div>
    </div>
  );
}

const linkStyle = ({ isActive }: any) => ({
  textDecoration: "none",
  color: isActive ? "#000" : "#888",
  fontWeight: isActive ? 600 : 400,
});
