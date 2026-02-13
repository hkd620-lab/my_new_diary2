"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_router_dom_1 = require("react-router-dom");
const AppLayout_1 = __importDefault(require("./layouts/AppLayout"));
const Home_1 = __importDefault(require("./pages/Home"));
const Write_1 = __importDefault(require("./pages/Write"));
const WriteEdit_1 = __importDefault(require("./pages/WriteEdit"));
const Library_1 = __importDefault(require("./pages/Library"));
const Essay_1 = __importDefault(require("./pages/Essay"));
function App() {
    return (<react_router_dom_1.Routes>
      <react_router_dom_1.Route element={<AppLayout_1.default />}>
        <react_router_dom_1.Route path="/" element={<Home_1.default />}/>
        <react_router_dom_1.Route path="/write" element={<Write_1.default />}/>
        <react_router_dom_1.Route path="/write/edit" element={<WriteEdit_1.default />}/>
        <react_router_dom_1.Route path="/library" element={<Library_1.default />}/>
        <react_router_dom_1.Route path="/essay" element={<Essay_1.default />}/>
      </react_router_dom_1.Route>
    </react_router_dom_1.Routes>);
}
