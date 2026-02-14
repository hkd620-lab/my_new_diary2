"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
const react_router_dom_1 = require("react-router-dom");
const BottomTab_1 = __importDefault(require("../components/BottomTab"));
function Layout() {
    return (<div style={{
            maxWidth: 420,
            margin: "0 auto",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "#f7f6f3",
        }}>
      <main style={{ flex: 1, padding: "16px 16px 80px" }}>
        <react_router_dom_1.Outlet />
      </main>
      <BottomTab_1.default />
    </div>);
}
