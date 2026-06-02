import { format } from 'date-fns';
import { loadData, saveData } from '../utils/storage';

export const PLANNER_KEY = 'calendarPlannerItems';
const LEGACY_KEY = 'calendarEvents';

export const createPlannerId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const minutesBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  return Math.max(end - start, 0);
};

export const migrateLegacyCalendarEvents = () => {
  const existing = loadData(PLANNER_KEY, null);
  if (existing) return existing;

  const legacy = loadData(LEGACY_KEY, {});
  const migrated = Object.entries(legacy).flatMap(([date, events]) =>
    (events || []).map((event) => ({
      id: event.id || createPlannerId(),
      title: event.title || '일정',
      description: event.memo || '',
      date,
      startTime: event.time || '',
      endTime: '',
      category: 'personal',
      importance: event.importance === '높음' ? 'high' : event.importance === '낮음' ? 'low' : 'medium',
      urgency: 'medium',
      status: event.completed ? 'done' : 'planned',
      repeat: 'none',
      estimatedMinutes: 60,
      actualMinutes: 0,
      memo: event.memo || '',
      createdAt: new Date().toISOString(),
    }))
  );

  saveData(PLANNER_KEY, migrated);
  return migrated;
};

export const loadPlannerItems = () => migrateLegacyCalendarEvents();

export const savePlannerItems = (items) => saveData(PLANNER_KEY, items);

export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export const getItemDuration = (item) => {
  const blockMinutes = minutesBetween(item.startTime, item.endTime);
  return blockMinutes || Number(item.estimatedMinutes || 0);
};
