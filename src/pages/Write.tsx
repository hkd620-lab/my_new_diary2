import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SECTIONS = [
  "보람 있었던 일",
  "자랑하고 싶은 일",
  "마음에 남은 일",
  "아쉬웠던 일",
  "슬펐던 일",
];

export default function Write() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState("");
  const [mood, setMood] = useState("");
  const [sections, setSections] = useState<string[]>([]);

  const toggle = (s: string) => {
    setSections((prev) =>
      prev.includes(s) ? prev.filter(v => v !== s) : [...prev, s]
    );
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>기록 시작</h2>

      <h4>날씨</h4>
      {["맑음", "흐림", "비", "눈"].map(v => (
        <button key={v} onClick={() => setWeather(v)}>{v}</button>
      ))}

      <h4>기분</h4>
      {["아주좋음", "좋음", "보통", "나쁨"].map(v => (
        <button key={v} onClick={() => setMood(v)}>{v}</button>
      ))}

      <h4>기록할 항목</h4>
      {SECTIONS.map(s => (
        <label key={s} style={{ display: "block" }}>
          <input type="checkbox" onChange={() => toggle(s)} /> {s}
        </label>
      ))}

      <button
        disabled={!weather || !mood || sections.length === 0}
        onClick={() =>
          navigate("/write/edit", {
            state: { weather, mood, sections },
          })
        }
      >
        다음
      </button>
    </div>
  );
}
