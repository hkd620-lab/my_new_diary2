import { useState } from "react";

type Props = {
  value?: string;
  onChange: (text: string) => void;
};

export default function AchievementSection({ value = "", onChange }: Props) {
  const [text, setText] = useState(value);

  return (
    <div style={{ marginTop: 24 }}>
      <h3>보람 있었던 일</h3>

      <textarea
        value={text}
        placeholder="오늘 가장 보람 있었던 일을 한 줄로 적어보세요"
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        rows={4}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 14,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "none",
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}
