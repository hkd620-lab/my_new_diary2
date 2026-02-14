"use strict";
/**
 * SAYU (주간 요약) 전용 서비스
 * - records 컬렉션 구조 변경 없음
 * - Library / Write 로직과 완전 분리
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterThisWeekRecords = filterThisWeekRecords;
exports.groupWeeklySections = groupWeeklySections;
exports.getThisWeekRangeLabel = getThisWeekRangeLabel;
/**
 * 날짜 문자열(YYYY-MM-DD)을 Date 객체로 변환
 */
function parseDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}
/**
 * 주 시작일(월요일) 계산
 */
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=일, 1=월
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}
/**
 * 주 종료일(일요일) 계산
 */
function getWeekEnd(weekStart) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
}
/**
 * 이번 주 기록만 필터링
 */
function filterThisWeekRecords(records) {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(weekStart);
    return records.filter(r => {
        const d = parseDate(r.date);
        return d >= weekStart && d <= weekEnd;
    });
}
/**
 * 주간 요약용 섹션별 묶기
 * 결과:
 * {
 *   achievement: [{ date, value }],
 *   gratitude: [{ date, value }],
 *   ...
 * }
 */
function groupWeeklySections(records) {
    const result = {};
    records.forEach(r => {
        Object.entries(r.sections).forEach(([key, value]) => {
            if (!value)
                return;
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push({
                date: r.date,
                value,
            });
        });
    });
    return result;
}
/**
 * 주간 날짜 범위 문자열 반환
 * 예: 2026-02-05 ~ 2026-02-11
 */
function getThisWeekRangeLabel() {
    const today = new Date();
    const start = getWeekStart(today);
    const end = getWeekEnd(start);
    const fmt = (d) => d.toLocaleDateString("sv-SE");
    return `${fmt(start)} ~ ${fmt(end)}`;
}
