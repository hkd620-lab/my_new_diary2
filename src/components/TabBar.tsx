import { NavLink } from "react-router-dom";

const tabs = [
  { path: "/", label: "기록" },
  { path: "/library", label: "서재" },
  { path: "/sayu", label: "SAYU" },
  { path: "/stats", label: "통계" },
  { path: "/settings", label: "설정" },
];

export default function TabBar() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 420,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        background: "#F7F6F3",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        fontFamily: "serif",
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          style={({ isActive }) => ({
            position: "relative",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: isActive ? 800 : 500,
            color: isActive
              ? "#2C3E50"              // 🔥 선택 시 Accent 색 복원
              : "rgba(0,0,0,0.45)",
            paddingBottom: 6,
            transition: "all 0.2s ease",
            letterSpacing: "0.04em",
            borderBottom: isActive
              ? "3px solid #2C3E50"    // 🔥 선택 표시 라인 추가
              : "3px solid transparent",
          })}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
