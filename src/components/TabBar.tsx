import { NavLink } from "react-router-dom";

const tabs = [
  { path: "/", label: "기록" },
  { path: "/library", label: "서재" },
  { path: "/stats", label: "통계" },
  { path: "/settings", label: "설정" },
];

export default function TabBar() {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            isActive ? "tab-item active" : "tab-item"
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
