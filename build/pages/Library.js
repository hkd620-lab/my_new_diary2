"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Library;
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../services/firebase");
function Library() {
    const [items, setItems] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        async function fetchData() {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "records"), (0, firestore_1.orderBy)("date", "desc"));
            const snapshot = await (0, firestore_1.getDocs)(q);
            const list = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            setItems(list);
        }
        fetchData();
    }, []);
    return (<div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 24 }}>서재</h2>

      {items.map(item => (<div key={item.id} style={{
                background: "#FFFFFF",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            {item.date}
          </div>

          <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>
            날씨: {item.weather} · 기분: {item.mood}
          </div>

          <div style={{ lineHeight: 1.7 }}>
            {item.refinedText
                ? item.refinedText
                : "AI 선생님이 문장을 다듬는 중입니다..."}
          </div>
        </div>))}
    </div>);
}
