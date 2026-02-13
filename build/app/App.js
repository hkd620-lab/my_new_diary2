"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_router_dom_1 = require("react-router-dom");
const Home_1 = __importDefault(require("../pages/Home"));
const Library_1 = __importDefault(require("../pages/Library"));
const Stats_1 = __importDefault(require("../pages/Stats"));
const Settings_1 = __importDefault(require("../pages/Settings"));
const Login_1 = __importDefault(require("../pages/Login"));
const TabBar_1 = __importDefault(require("../components/TabBar"));
const AuthContext_1 = require("../services/AuthContext");
const AuthGuard_1 = __importDefault(require("../components/AuthGuard"));
function App() {
    return (<AuthContext_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>

          <react_router_dom_1.Route path="/" element={<AuthGuard_1.default>
                <Home_1.default />
              </AuthGuard_1.default>}/>
          <react_router_dom_1.Route path="/library" element={<AuthGuard_1.default>
                <Library_1.default />
              </AuthGuard_1.default>}/>
          <react_router_dom_1.Route path="/stats" element={<AuthGuard_1.default>
                <Stats_1.default />
              </AuthGuard_1.default>}/>
          <react_router_dom_1.Route path="/settings" element={<AuthGuard_1.default>
                <Settings_1.default />
              </AuthGuard_1.default>}/>
        </react_router_dom_1.Routes>

        <TabBar_1.default />
      </react_router_dom_1.BrowserRouter>
    </AuthContext_1.AuthProvider>);
}
