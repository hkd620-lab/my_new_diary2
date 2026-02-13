"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
const react_router_dom_1 = require("react-router-dom");
const TabBar_1 = __importDefault(require("../components/TabBar"));
function AppLayout() {
    return (<div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
            width: "100%",
            maxWidth: 420,
            minHeight: "100vh",
            paddingBottom: 72,
            boxSizing: "border-box",
            background: "#F7F6F3",
        }}>
        <react_router_dom_1.Outlet />
        <TabBar_1.default />
      </div>
    </div>);
}
