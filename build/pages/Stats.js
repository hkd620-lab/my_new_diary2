"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stats;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../services/firebase");
const react_1 = require("react");
function Stats() {
    const [items, setItems] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const load = async () => {
            const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "records"));
            setItems(snap.docs.map((d) => d.data()));
        };
        load();
    }, []);
    return (<div className="app-container">
      <h1>통계</h1>
      <p>기록 수: {items.length}</p>
    </div>);
}
