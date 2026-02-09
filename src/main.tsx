import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";   // ✅ 이 한 줄이 빠져 있었음

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
