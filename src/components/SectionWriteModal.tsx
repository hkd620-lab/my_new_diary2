import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  sectionKey: string;
  title: string;
  initialValue?: string;
  onSave: (value: string) => void;
  onClose: () => void;
};

/** 섹션별 질문 힌트 (1줄 가이드) */
const SECTION_HINT_MAP: Record<string, string> = {
  achievement: "오늘 가장 뿌듯했던 순간은 무엇이었나요?",
  pride: "스스로 칭찬해 주고 싶은 행동이 있나요?",
  impression: "오늘 하루 중 마음에 오래 남은 장면은?",
  regret: "다음에는 다르게 해보고 싶은 점이 있나요?",
  gratitude: "고마웠던 사람이나 순간을 떠올려 보세요.",
  void: "형식 없이 자유롭게 생각을 적어도 괜찮아요.",
};

export default function SectionWriteModal({
  open,
  sectionKey,
  title,
  initialValue = "",
  onSave,
  onClose,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  if (!open) return null;

  const hint = SECTION_HINT_MAP[sectionKey];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: 6 }}>{title}</h3>

        {hint && (
          <div style={hintStyle}>
            {hint}
          </div>
        )}

        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={`${title}을(를) 기록하세요`}
          style={textareaStyle}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            style={saveBtnStyle}
          >
            저장
          </button>

          <button onClick={onClose} style={cancelBtnStyle}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================== 스타일 ================== */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  width: "90%",
  maxWidth: 420,
  background: "#fff",
  borderRadius: 12,
  padding: 16,
};

const hintStyle: React.CSSProperties = {
  marginBottom: 10,
  fontSize: 13,
  color: "#555",
  lineHeight: 1.4,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 120,
  padding: 10,
  fontSize: 14,
  borderRadius: 8,
  border: "1px solid #ccc",
  resize: "vertical",
};

const saveBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  background: "#2c7be5",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};
