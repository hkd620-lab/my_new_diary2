"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextSection;
function TextSection({ title, placeholder, value, onChange, }) {
    return (<div style={{ marginTop: 24 }}>
      <h3>{title}</h3>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={{
            width: "100%",
            padding: 12,
            fontSize: 14,
            borderRadius: 8,
            border: "1px solid #ccc",
            resize: "vertical",
        }}/>
    </div>);
}
