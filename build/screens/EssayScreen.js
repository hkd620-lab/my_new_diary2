"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EssayScreen;
const react_1 = require("react");
const functions_1 = require("firebase/functions");
const firebase_1 = require("../services/firebase");
const generateEssay = (0, functions_1.httpsCallable)(firebase_1.functions, "generateEssay");
function EssayScreen({ aggregation, type, period, }) {
    var _a, _b;
    /** 아직 에세이를 시작하지 않은 상태 */
    const [essay, setEssay] = (0, react_1.useState)(null);
    const [userText, setUserText] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const isNotStarted = essay === null;
    /* -------------------------------
       STEP 1: 질문 생성 (명시적 요청)
    -------------------------------- */
    async function handleGenerate() {
        setLoading(true);
        const res = await generateEssay({
            step: "generate",
            type,
            period,
            aggregation,
        });
        setEssay({
            id: res.data.essayId,
            status: res.data.status,
            aiQuestions: res.data.aiQuestions,
        });
        setLoading(false);
    }
    /* -------------------------------
       STEP 2: 사용자 답변 → 다듬기
    -------------------------------- */
    async function handleRefine() {
        if (!(essay === null || essay === void 0 ? void 0 : essay.id) || !userText.trim())
            return;
        setLoading(true);
        const res = await generateEssay({
            step: "refine",
            essayId: essay.id,
            userText,
        });
        setEssay(Object.assign(Object.assign({}, essay), { status: res.data.status, userDraft: { content: res.data.content } }));
        setUserText("");
        setLoading(false);
    }
    /* -------------------------------
       STEP 3: 최종 확정 (LOCK)
    -------------------------------- */
    async function handleFinalize() {
        var _a, _b;
        if (!(essay === null || essay === void 0 ? void 0 : essay.id))
            return;
        setLoading(true);
        await generateEssay({
            step: "finalize",
            essayId: essay.id,
            userText: (_a = essay.userDraft) === null || _a === void 0 ? void 0 : _a.content,
        });
        setEssay(Object.assign(Object.assign({}, essay), { status: "final", finalContent: (_b = essay.userDraft) === null || _b === void 0 ? void 0 : _b.content }));
        setLoading(false);
    }
    /* ===============================
       RENDER
    =============================== */
    if (loading) {
        return <p>처리 중…</p>;
    }
    /* -------------------------------
       아직 시작 안 함 (AI 미개입)
    -------------------------------- */
    if (isNotStarted) {
        return (<div>
        <h2>이 기록을 에세이로 만들어볼까요?</h2>
        <p>
          아직 AI는 개입하지 않았습니다.<br />
          원하실 때만 질문을 받아 글을 시작할 수 있습니다.
        </p>
        <button onClick={handleGenerate}>
          질문 받기
        </button>
      </div>);
    }
    /* -------------------------------
       STEP 1: AI 질문 제시
    -------------------------------- */
    if (essay.status === "draft_ai") {
        return (<div>
        <h2>이 기록을 글로 열기 위한 질문</h2>

        <pre style={{ whiteSpace: "pre-wrap" }}>
          {essay.aiQuestions}
        </pre>

        <textarea placeholder="질문에 대한 생각을 자유롭게 적어주세요." value={userText} onChange={(e) => setUserText(e.target.value)} rows={8} style={{ width: "100%" }}/>

        <button onClick={handleRefine} disabled={!userText.trim()}>
          이 답변으로 다듬기
        </button>
      </div>);
    }
    /* -------------------------------
       STEP 2: 다듬어진 글
    -------------------------------- */
    if (essay.status === "draft_user") {
        return (<div>
        <h2>다듬어진 글</h2>

        <textarea value={(_b = (_a = essay.userDraft) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ""} onChange={(e) => setUserText(e.target.value)} rows={10} style={{ width: "100%" }}/>

        <div style={{ marginTop: 12 }}>
          <button onClick={handleRefine}>
            다시 다듬기
          </button>
          <button onClick={handleFinalize} style={{ marginLeft: 8 }}>
            이 글로 확정
          </button>
        </div>
      </div>);
    }
    /* -------------------------------
       FINAL: 잠금 상태
    -------------------------------- */
    if (essay.status === "final") {
        return (<div>
        <h2>완성된 에세이</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {essay.finalContent}
        </pre>
        <p style={{ marginTop: 8, color: "#888" }}>
          🔒 이 글은 수정할 수 없습니다.
        </p>
      </div>);
    }
    return null;
}
