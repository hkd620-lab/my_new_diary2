"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
const react_router_dom_1 = require("react-router-dom");
const Write_1 = __importDefault(require("../pages/Write"));
const Library_1 = __importDefault(require("../pages/Library"));
const Sayu_1 = __importDefault(require("../pages/Sayu"));
const Stats_1 = __importDefault(require("../pages/Stats"));
const Settings_1 = __importDefault(require("../pages/Settings"));
const TabBar_1 = __importDefault(require("../components/TabBar"));
function AppLayout() {
    return (<div style={{ paddingBottom: 70 }}>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<Write_1.default />}/>
        <react_router_dom_1.Route path="/library" element={<Library_1.default />}/>
        <react_router_dom_1.Route path="/sayu" element={<Sayu_1.default />}/>
        <react_router_dom_1.Route path="/stats" element={<Stats_1.default />}/>
        <react_router_dom_1.Route path="/settings" element={<Settings_1.default />}/>
      </react_router_dom_1.Routes>
      <TabBar_1.default />
    </div>);
}
