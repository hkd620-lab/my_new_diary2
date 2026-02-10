import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDailyRecord } from "../services/recordService";
import SectionWriteModal from "../components/SectionWriteModal";

/**
 * 섹션 정의 (순서 중요)
 * - 여백은 자유 메모 성격을 드러내기 위해 라벨 강화
 */
const SECTIONS = [
  { key: "achievement", label: "보람 있었던 일" },
  { key: "pride", label: "자랑하고 싶은 일" },
  { key: "impression", label: "마음에 남은 일" },
  { key: "regret", label: "아쉬웠던 일" },
  { key: "gratitude", label: "감사한 일" },
  { key: "void", label: "여백 · 자유 메모" }, // ✅ 4️⃣ 적용
];

const TEMPERATURES = [
  "매우 더움",
  "더움",
  "푸근함",
  "쌀쌀함",
  "매서움",
];

export default function Write() {
  const navigate = useNavigate();

  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  const [sections, setSections] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<{
    key: string;
    label: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  // ✅ 한국 날짜 YYYY-MM-DD
  const today = new Date().toLocaleDateString("sv-SE");

  /** 다음 미작성 섹션 찾기 */
  const openNextSection = (currentKey: string) => {
    const idx = SECTIONS.findIndex(s => s.key === currentKey);
    if (idx === -1) return;

    for (let i = idx + 1; i < SECTIONS.length; i++) {
      const next = SECTIONS[i];
      if (!sections[next.key]) {
        setActiveSection(next);
        return;
      }
    }
    setActiveSection(null);
  };

  const onSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      await saveDailyRecord({
        date: today,
        weather: weather!,
        temperature: temperature!,
        mood: mood!,
        sections,
      });
      navigate("/library", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  /** ✅ 섹션 1개 이상 작성 여부 */
  const hasAnySection = Object.values(sections).some(
    v => v && v.trim() !== ""
  );

  /** ✅ 저장 가능 여부 */
  const canSave =
    Boolean(weather) &&
    Boolean(temperature) &&
    Boolean(mood) &&
    hasAnySection &&
    !saving;

  /** ✅ 모든 섹션 완료 여부 */
  const allSectionsDone = SECTIONS.every(s => sections[s.key]);

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

      <h4 style={{ marginTop: 20 }}>기온</h4>
      {TEMPERATURES.map(v => (
        <button
          key={v}
          className={`select-btn ${temperature === v ? "active" : ""}`}
          onClick={() => setTemperature(v)}
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

      <h4 style={{ marginTop: 24 }}>기록할 섹션</h4>

      {SECTIONS.map(s => {
        const done = Boolean(sections[s.key]);

        return (
          <button
            key={s.key}
            onClick={() => setActiveSection(s)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              marginBottom: 8,
              padding: "10px 12px",
              borderRadius: 10,
              border: done ? "2px solid #2c7be5" : "1px solid #ccc",
              background: done ? "#eef4ff" : "#fff",
              fontWeight: 600,
            }}
          >
            {done ? "✔ " : ""}
            {s.label}
          </button>
        );
      })}

      {/* ✅ 4️⃣ 여백 섹션 역할 안내 */}
      {sections.void && (
        <div
          style={{
            marginTop: 4,
            marginBottom: 12,
            fontSize: 13,
            color: "#666",
            paddingLeft: 4,
          }}
        >
          여백은 형식 없이 생각을 남기는 공간입니다.
        </div>
      )}

      {/* ✅ 2️⃣ 모든 섹션 완료 안내 */}
      {allSectionsDone && (
        <div
          style={{
            marginTop: 16,
            padding: "12px",
            borderRadius: 10,
            background: "#f6f9ff",
            color: "#2c7be5",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          오늘 기록이 거의 완성됐어요. 저장해도 좋아요.
        </div>
      )}

      {/* ✅ 3️⃣ 저장 버튼 (활성 조건 적용) */}
      <button
        onClick={onSave}
        disabled={!canSave}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "12px 0",
          borderRadius: 10,
          border: "none",
          background: canSave ? "#2c7be5" : "#cfd8e3",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: canSave ? "pointer" : "not-allowed",
        }}
      >
        {saving ? "저장 중..." : "오늘 기록 저장"}
      </button>

      {activeSection && (
        <SectionWriteModal
          open={true}
          sectionKey={activeSection.key}
          title={activeSection.label}
          initialValue={sections[activeSection.key] ?? ""}
          onSave={value => {
            setSections(prev => ({
              ...prev,
              [activeSection.key]: value,
            }));
            openNextSection(activeSection.key);
          }}
          onClose={() => setActiveSection(null)}
        />
      )}
    </div>
  );
}
