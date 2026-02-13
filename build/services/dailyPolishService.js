"use strict";
/**
 * Daily Polish Service (Gemini Flash)
 * - 1차 편집 전용
 * - 의미 추가 금지
 * - 감정 강화 금지
 * - 문장 정리만 허용
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.polishSections = polishSections;
async function polishSections(sections) {
    const cleaned = {};
    // 빈 값 제거
    Object.entries(sections).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
            cleaned[key] = value.trim();
        }
    });
    if (Object.keys(cleaned).length === 0)
        return sections;
    try {
        const response = await fetch("/api/daily-polish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sections: cleaned }),
        });
        if (!response.ok) {
            console.warn("Polish fallback: network error");
            return sections;
        }
        const data = await response.json();
        return data.polished || sections;
    }
    catch (err) {
        console.warn("Polish fallback:", err);
        return sections;
    }
}
