const IMPORTANCE_SCORE = { high: 3, medium: 2, low: 1 };
const URGENCY_SCORE = { high: 3, medium: 2, low: 1 };
const STATUS_SCORE = { doing: 3, planned: 2, postponed: 1, done: 0 };

const daysUntil = (dateKey) => {
  if (!dateKey) return 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateKey}T00:00:00`);
  return Math.round((target - today) / 86400000);
};

export const getPriorityScore = (task) => {
  const deadlinePressure = Math.max(0, 8 - Math.max(daysUntil(task.date), 0));
  const effortPenalty = Math.min(Number(task.estimatedMinutes || 0) / 120, 2);
  return (
    (IMPORTANCE_SCORE[task.importance] || 1) * 12 +
    (URGENCY_SCORE[task.urgency] || 1) * 10 +
    (STATUS_SCORE[task.status] || 0) * 4 +
    deadlinePressure * 2 -
    effortPenalty
  );
};

export const getPriorityQuadrant = (task) => {
  const important = task.importance === 'high';
  const urgent = task.urgency === 'high';
  if (important && urgent) return { label: '지금 처리', tone: 'red' };
  if (important && !urgent) return { label: '계획해서 처리', tone: 'blue' };
  if (!important && urgent) return { label: '빠르게 처리', tone: 'amber' };
  return { label: '보류 후보', tone: 'slate' };
};

export const sortByExecutionPriority = (items) =>
  [...items].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });
