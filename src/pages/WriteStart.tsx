import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WEATHER = ["맑음", "흐림", "비", "눈"];
const MOOD = ["아주좋음", "좋음", "보통", "나쁨"];
const SECTIONS = [
  "보람 있었던 일",
  "자랑하고 싶은 일",
  "마음에 남은 일",
  "아쉬웠던 일",
  "슬펐던 일",
];

export default function WriteStart() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);

  const toggleSection = (s: string) => {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]
    );
  };

  const next = () => {
    navigate("/write/edit", {
      state: { weather, mood, sections },
    });
  };

  return (
    <div>
      <h1>기록 시작</h1>

      <h3>날씨</h3>
      {WEATHER.map((w) => (
        <button
          key={w}
          onClick={() => setWeather(w)}
          style={{ fontWeight: weather === w ? "bold" : "normal" }}
        >
          {w}
        </button>
      ))}

      <h3>기분</h3>
      {MOOD.map((m) => (
        <button
          key={m}
          onClick={() => setMood(m)}
          style={{ fontWeight: mood === m ? "bold" : "normal" }}
        >
          {m}
        </button>
      ))}

      <h3>기록할 항목</h3>
      {SECTIONS.map((s) => (
        <div key={s}>
          <label>
            <input
              type="checkbox"
              checked={sections.includes(s)}
              onChange={() => toggleSection(s)}
            />
            {s}
          </label>
        </div>
      ))}

      <button
        onClick={next}
        disabled={!weather || !mood || sections.length === 0}
        style={{ marginTop: 20 }}
      >
        다음
      </button>
    </div>
  );
}
