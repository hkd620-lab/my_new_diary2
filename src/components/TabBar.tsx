import { NavLink } from "react-router-dom";

const tabs = [
  { path: "/", label: "기록" },
  { path: "/library", label: "서재" },
  { path: "/stats", label: "통계" },
  { path: "/settings", label: "설정" },
];

export default function TabBar() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",

        width: "100%",
        maxWidth: 420,

        display: "flex",
        borderTop: "1px solid #ddd",
        background: "#fff",
        zIndex: 1000,
      }}
    >
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          style={({ isActive }) => ({
            flex: 1,
            textAlign: "center",
            padding: "12px 0",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: isActive ? 700 : 400,
            color: isActive ? "#2c7be5" : "#666",
          })}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
