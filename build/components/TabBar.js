"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabBar;
const react_router_dom_1 = require("react-router-dom");
function TabBar() {
    const tabs = [
        { to: "/", label: "HARU" },
        { to: "/write", label: "기록" },
        { to: "/library", label: "서재" },
        { to: "/sayu", label: "SAYU" },
        { to: "/stats", label: "통계" },
        { to: "/settings", label: "설정" },
    ];
    return (<div style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 420,
            background: "#FFFFFF",
            borderTop: "1px solid #DDD",
            display: "flex",
            height: 60,
            zIndex: 1000,
        }}>
      {tabs.map(tab => (<react_router_dom_1.NavLink key={tab.to} to={tab.to} style={({ isActive }) => ({
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                textDecoration: "none",
                color: isActive ? "#1F1F1F" : "#555",
                position: "relative",
            })}>
          {({ isActive }) => (<>
              {tab.label}
              {isActive && (<div style={{
                        position: "absolute",
                        bottom: 8,
                        width: 20,
                        height: 2,
                        background: "#2C3E50",
                    }}/>)}
            </>)}
        </react_router_dom_1.NavLink>))}
    </div>);
}
