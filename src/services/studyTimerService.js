import { loadData, saveData } from '../utils/storage';

export const STUDY_SESSIONS_KEY = 'studyTimerSessions';

export const loadStudySessions = () => loadData(STUDY_SESSIONS_KEY, []);

export const saveStudySessions = (sessions) => saveData(STUDY_SESSIONS_KEY, sessions);

export const secondsToMinutes = (seconds) => Math.round((seconds || 0) / 60);

export const formatElapsed = (seconds) => {
  const total = Math.max(Math.floor(seconds || 0), 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
