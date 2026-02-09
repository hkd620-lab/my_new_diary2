import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AchievementInput from "../components/AchievementInput";
import TextSection from "../components/TextSection";
import { saveDailyRecord } from "../services/recordService";

/**
 * 섹션 정의 (기본형)
 */
const SECTIONS = [
  { key: "achievement", label: "보람 있었던 일" },
  { key: "pride", label: "자랑하고 싶은 일" },
  { key: "impression", label: "마음에 남은 일" },
  { key: "regret", label: "아쉬웠던 일" },
  { key: "gratitude", label: "감사한 일" },
  { key: "void", label: "여백" },
];

export default function Write() {
  const navigate = useNavigate();

  const [weather, setWeather] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const toggleSection = (key: string) => {
    setSelectedSections(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const onSave = async () => {
    if (!weather || !mood) {
      alert("날씨와 기분을 선택하세요");
      return;
    }

    setSaving(true);
    try {
      await saveDailyRecord({
        date: today,
        weather,
        mood,
        sections,
      });
      navigate("/library", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h4>날씨</h4>
      {["맑음", "흐림", "비", "눈"].map(v => (
        <button
          key={v}
          className={`select-btn ${weather === v ? "active" : ""}`}
          onClick={() => setWeather(v)}
        >
          {v}
        </button>
      ))}

      <h4 style={{ marginTop: 20 }}>기분</h4>
      {["아주좋음", "좋음", "보통", "힘듦"].map(v => (
        <button
          key={v}
          className={`select-btn ${mood === v ? "active" : ""}`}
          onClick={() => setMood(v)}
        >
          {v}
        </button>
      ))}

      {/* 섹션 선택 */}
      <h4 style={{ marginTop: 24 }}>기록할 섹션 선택</h4>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
        먼저 섹션을 선택하세요. 선택한 섹션만 아래에서 작성할 수 있습니다.
      </div>

      {SECTIONS.map(s => (
        <button
          key={s.key}
          className={`select-btn ${selectedSections.includes(s.key) ? "active" : ""}`}
          onClick={() => toggleSection(s.key)}
        >
          {s.label}
        </button>
      ))}

      {selectedSections.includes("achievement") && (
        <AchievementInput
          value={sections.achievement ?? ""}
          onChange={v => setSections(p => ({ ...p, achievement: v }))}
        />
      )}

      {selectedSections.includes("pride") && (
        <TextSection
          title="자랑하고 싶은 일"
          placeholder="스스로 칭찬하고 싶은 일"
          value={sections.pride ?? ""}
          onChange={v => setSections(p => ({ ...p, pride: v }))}
        />
      )}

      {selectedSections.includes("impression") && (
        <TextSection
          title="마음에 남은 일"
          placeholder="오늘 가장 기억에 남는 일"
          value={sections.impression ?? ""}
          onChange={v => setSections(p => ({ ...p, impression: v }))}
        />
      )}

      {selectedSections.includes("regret") && (
        <TextSection
          title="아쉬웠던 일"
          placeholder="조금 아쉬웠던 점"
          value={sections.regret ?? ""}
          onChange={v => setSections(p => ({ ...p, regret: v }))}
        />
      )}

      {selectedSections.includes("gratitude") && (
        <TextSection
          title="감사한 일"
          placeholder="고마웠던 순간 한 가지"
          value={sections.gratitude ?? ""}
          onChange={v => setSections(p => ({ ...p, gratitude: v }))}
        />
      )}

      {selectedSections.includes("void") && (
        <TextSection
          title="여백"
          placeholder="흰색 도화지처럼, 무엇이든 남겨도 됩니다"
          value={sections.void ?? ""}
          onChange={v => setSections(p => ({ ...p, void: v }))}
        />
      )}

      <button
        onClick={onSave}
        disabled={saving}
        style={{
          marginTop: 28,
          width: "100%",
          padding: "12px 0",
          borderRadius: 10,
          border: "none",
          background: "#2c7be5",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </div>
  );
}
