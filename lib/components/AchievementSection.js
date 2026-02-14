"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AchievementSection;
const react_1 = require("react");
function AchievementSection({ value = "", onChange }) {
    const [text, setText] = (0, react_1.useState)(value);
    return (<div style={{ marginTop: 24 }}>
      <h3>보람 있었던 일</h3>

      <textarea value={text} placeholder="오늘 가장 보람 있었던 일을 한 줄로 적어보세요" onChange={(e) => {
            setText(e.target.value);
            onChange(e.target.value);
        }} rows={4} style={{
            width: "100%",
            padding: 12,
            fontSize: 14,
            borderRadius: 8,
            border: "1px solid #ccc",
            resize: "none",
            lineHeight: 1.5,
        }}/>
    </div>);
}
