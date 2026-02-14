"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRecordsByDate = mergeRecordsByDate;
function mergeRecordsByDate(records) {
    if (records.length === 0)
        return null;
    const sorted = [...records].sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
    const mergedSections = {};
    sorted.forEach(r => Object.assign(mergedSections, r.sections));
    const latest = sorted[sorted.length - 1];
    return {
        date: latest.date,
        weather: latest.weather,
        temperature: latest.temperature,
        mood: latest.mood,
        sections: mergedSections,
    };
}
