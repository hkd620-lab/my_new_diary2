type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function AchievementInput({ value, onChange }: Props) {
  return (
    <div style={{ marginTop: 24 }}>
      <h4 className="section-title">보람 있었던 일</h4>

      <textarea
        className="text-input"
        placeholder="오늘 보람 있었던 일을 간단히 적어보세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ddd",
          fontSize: 14,
          resize: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
