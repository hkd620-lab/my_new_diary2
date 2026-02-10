type RecordItem = {
  date: string;
  weather: string;
  temperature: string;
  mood: string;
  sections: Record<string, string>;
  createdAt: any;
};

export function mergeRecordsByDate(records: RecordItem[]) {
  if (records.length === 0) return null;

  const sorted = [...records].sort(
    (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
  );

  const mergedSections: Record<string, string> = {};
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
