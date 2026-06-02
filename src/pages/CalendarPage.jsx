import { useMemo, useState } from 'react';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { BarChart3, CalendarDays, Clock3, Flame, NotebookPen, Plus, Save, Trash2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/UI/Card';
import {
  createPlannerId,
  getItemDuration,
  getTodayKey,
  loadPlannerItems,
  savePlannerItems,
} from '../services/calendarService';
import { getPriorityQuadrant, sortByExecutionPriority } from '../services/priorityService';
import { loadStudySessions, saveStudySessions } from '../services/studyTimerService';

const CATEGORY_OPTIONS = [
  { id: 'study', label: '공부', color: '#60a5fa' },
  { id: 'workout', label: '운동', color: '#22c55e' },
  { id: 'job', label: '취업', color: '#f59e0b' },
  { id: 'project', label: '프로젝트', color: '#a78bfa' },
  { id: 'personal', label: '개인', color: '#f472b6' },
  { id: 'etc', label: '기타', color: '#94a3b8' },
];

const STATUS_OPTIONS = [
  { id: 'planned', label: '예정' },
  { id: 'doing', label: '진행 중' },
  { id: 'done', label: '완료' },
  { id: 'postponed', label: '미룸' },
];

const LEVEL_OPTIONS = [
  { id: 'high', label: '높음' },
  { id: 'medium', label: '보통' },
  { id: 'low', label: '낮음' },
];

const emptyForm = {
  title: '',
  description: '',
  date: getTodayKey(),
  startTime: '',
  endTime: '',
  category: 'study',
  importance: 'medium',
  urgency: 'medium',
  status: 'planned',
  repeat: 'none',
  estimatedMinutes: 60,
  actualMinutes: 0,
  memo: '',
};

const emptyStudyLog = {
  topic: '반도체 공부',
  date: getTodayKey(),
  minutes: 60,
  linkedTaskId: '',
  memo: '',
};

const getCategory = (id) => CATEGORY_OPTIONS.find((item) => item.id === id) || CATEGORY_OPTIONS.at(-1);
const getLevelLabel = (id) => LEVEL_OPTIONS.find((item) => item.id === id)?.label || id;
const dateKeyOf = (date) => format(date, 'yyyy-MM-dd');
const todayKey = getTodayKey();

const formatMinutes = (minutes) => {
  const value = Math.max(Number(minutes || 0), 0);
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  if (hours <= 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
};

const quadrantClass = (tone) => {
  const map = {
    red: 'border-red-500/30 bg-red-500/10 text-red-200',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    slate: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  };
  return map[tone] || map.slate;
};

const getWeekKeys = (selectedDate) => {
  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => dateKeyOf(addDays(start, index)));
};

export const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(loadPlannerItems);
  const [sessions, setSessions] = useState(loadStudySessions);
  const [form, setForm] = useState(() => ({ ...emptyForm, date: todayKey }));
  const [studyLogForm, setStudyLogForm] = useState(() => ({ ...emptyStudyLog, date: todayKey }));
  const [showForm, setShowForm] = useState(false);

  const selectedKey = dateKeyOf(selectedDate);

  const persistItems = (nextItems) => {
    setItems(nextItems);
    savePlannerItems(nextItems);
  };

  const persistSessions = (nextSessions) => {
    setSessions(nextSessions);
    saveStudySessions(nextSessions);
  };

  const selectedItems = useMemo(
    () => items.filter((item) => item.date === selectedKey),
    [items, selectedKey]
  );

  const todayItems = useMemo(
    () => items.filter((item) => item.date === todayKey),
    [items]
  );

  const topThree = useMemo(
    () => sortByExecutionPriority(todayItems.filter((item) => item.status !== 'done')).slice(0, 3),
    [todayItems]
  );

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const weekKeys = useMemo(() => getWeekKeys(selectedDate), [selectedDate]);

  const weeklyStats = useMemo(
    () =>
      weekKeys.map((key) => {
        const dayItems = items.filter((item) => item.date === key);
        const daySessions = sessions.filter((session) => session.date === key);
        const studyMinutes = daySessions.reduce((sum, session) => sum + Number(session.minutes || 0), 0);
        const done = dayItems.filter((item) => item.status === 'done').length;
        return {
          date: format(new Date(`${key}T00:00:00`), 'E', { locale: ko }),
          key,
          studyMinutes,
          completionRate: dayItems.length ? Math.round((done / dayItems.length) * 100) : 0,
        };
      }),
    [items, sessions, weekKeys]
  );

  const categoryStats = useMemo(() => {
    const totals = CATEGORY_OPTIONS.map((category) => ({
      name: category.label,
      value: items
        .filter((item) => item.category === category.id && item.date >= dateKeyOf(subDays(new Date(), 6)))
        .reduce((sum, item) => sum + getItemDuration(item), 0),
      color: category.color,
    })).filter((item) => item.value > 0);
    return totals.length ? totals : [{ name: '기록 없음', value: 1, color: '#334155' }];
  }, [items]);

  const todaySessions = sessions.filter((session) => session.date === todayKey);
  const todayPlannedMinutes = todayItems.reduce((sum, item) => sum + Number(item.estimatedMinutes || 0), 0);
  const todayStudyMinutes = todaySessions.reduce((sum, session) => sum + Number(session.minutes || 0), 0);
  const todayDone = todayItems.filter((item) => item.status === 'done').length;
  const remainingCount = todayItems.filter((item) => item.status !== 'done').length;
  const completionRate = todayItems.length ? Math.round((todayDone / todayItems.length) * 100) : 0;

  const addItem = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    const nextItem = {
      ...form,
      id: createPlannerId(),
      title: form.title.trim(),
      description: form.description.trim(),
      estimatedMinutes: Number(form.estimatedMinutes || 0),
      actualMinutes: Number(form.actualMinutes || 0),
      createdAt: new Date().toISOString(),
    };
    persistItems([...items, nextItem]);
    setForm((current) => ({ ...emptyForm, date: current.date }));
    setShowForm(false);
  };

  const updateItem = (id, patch) => {
    persistItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteItem = (id) => {
    persistItems(items.filter((item) => item.id !== id));
  };

  const addStudyLog = (event) => {
    event.preventDefault();
    const minutes = Math.max(Number(studyLogForm.minutes || 0), 0);
    if (!studyLogForm.topic.trim() || minutes <= 0) return;
    const linked = items.find((item) => item.id === studyLogForm.linkedTaskId);
    const session = {
      id: createPlannerId(),
      topic: studyLogForm.topic.trim(),
      linkedTaskId: studyLogForm.linkedTaskId || '',
      linkedTaskTitle: linked?.title || '',
      date: studyLogForm.date || todayKey,
      minutes,
      memo: studyLogForm.memo.trim(),
      source: 'manual',
      createdAt: new Date().toISOString(),
    };
    persistSessions([session, ...sessions]);
    setStudyLogForm((current) => ({ ...emptyStudyLog, date: current.date, topic: current.topic }));
  };

  const deleteStudyLog = (id) => {
    persistSessions(sessions.filter((session) => session.id !== id));
  };

  const renderItemCard = (item) => {
    const category = getCategory(item.category);
    const quadrant = getPriorityQuadrant(item);
    return (
      <div key={item.id} className="rounded-xl border border-border bg-background p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
              <h4 className={`font-bold ${item.status === 'done' ? 'text-textMuted line-through' : 'text-text'}`}>
                {item.title}
              </h4>
              <span className={`rounded border px-1.5 py-0.5 text-[10px] ${quadrantClass(quadrant.tone)}`}>
                {quadrant.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-textMuted">
              {category.label} · {item.startTime || '시간 미정'}{item.endTime ? `-${item.endTime}` : ''} · 예상 {formatMinutes(item.estimatedMinutes)}
            </p>
            {item.description && <p className="mt-2 line-clamp-2 text-sm text-textMuted">{item.description}</p>}
          </div>
          <button onClick={() => deleteItem(item.id)} className="rounded-lg p-1.5 text-textMuted hover:bg-surface hover:text-red-300">
            <Trash2 size={15} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={item.status}
            onChange={(event) => updateItem(item.id, { status: event.target.value })}
            className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
          <span className="text-xs text-textMuted">중요 {getLevelLabel(item.importance)} · 긴급 {getLevelLabel(item.urgency)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/25 bg-primary/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays size={24} />
              <span className="text-sm font-semibold">Execution Calendar</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-text">일정표 / 실행 관리</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              오늘 해야 할 일, 우선순위, 하루 일정, 공부 기록을 간단하게 관리합니다.
            </p>
          </div>
          <button
            onClick={() => {
              setForm((current) => ({ ...current, date: selectedKey }));
              setShowForm((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={16} />
            일정 추가
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: '오늘 완료', value: `${todayDone}/${todayItems.length}` },
            { label: '완료율', value: `${completionRate}%` },
            { label: '계획 시간', value: formatMinutes(todayPlannedMinutes) },
            { label: '공부 기록', value: formatMinutes(todayStudyMinutes) },
            { label: '남은 할 일', value: `${remainingCount}개` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3">
              <p className="text-xs text-textMuted">{item.label}</p>
              <p className="mt-1 text-xl font-bold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <Card>
          <form onSubmit={addItem} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-xs font-medium text-textMuted">제목</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" required />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-textMuted">날짜</span>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-textMuted">시작/종료</span>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-text" />
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-text" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-textMuted">예상 시간</span>
                <input type="number" min="0" value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[
                ['category', '카테고리', CATEGORY_OPTIONS],
                ['importance', '중요도', LEVEL_OPTIONS],
                ['urgency', '긴급도', LEVEL_OPTIONS],
                ['status', '상태', STATUS_OPTIONS],
                ['repeat', '반복', [{ id: 'none', label: '없음' }, { id: 'daily', label: '매일' }, { id: 'weekly', label: '매주' }, { id: 'monthly', label: '매월' }]],
              ].map(([key, label, options]) => (
                <label key={key} className="block">
                  <span className="text-xs font-medium text-textMuted">{label}</span>
                  <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text">
                    {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
              ))}
            </div>

            <label className="block">
              <span className="text-xs font-medium text-textMuted">설명/메모</span>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-text" />
            </label>

            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">
                <Save size={16} />
                저장
              </button>
            </div>
          </form>
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button onClick={() => setSelectedDate((date) => subDays(date, 30))} className="rounded-lg border border-border px-3 py-1.5 text-sm text-textMuted">이전</button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-text">{format(selectedDate, 'yyyy년 M월', { locale: ko })}</h2>
              <button onClick={() => setSelectedDate(new Date())} className="mt-1 text-xs text-primary">오늘로 이동</button>
            </div>
            <button onClick={() => setSelectedDate((date) => addDays(date, 30))} className="rounded-lg border border-border px-3 py-1.5 text-sm text-textMuted">다음</button>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-textMuted">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const key = dateKeyOf(day);
              const dayItems = items.filter((item) => item.date === key);
              const done = dayItems.filter((item) => item.status === 'done').length;
              const minutes = sessions.filter((session) => session.date === key).reduce((sum, session) => sum + Number(session.minutes || 0), 0);
              const active = key === selectedKey;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-20 rounded-lg border p-1.5 text-left transition-colors ${
                    active ? 'border-primary bg-primary/15' : 'border-border bg-background hover:border-primary/50'
                  } ${!isSameMonth(day, selectedDate) ? 'opacity-45' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${key === todayKey ? 'text-primary' : 'text-text'}`}>{format(day, 'd')}</span>
                    {dayItems.length > 0 && <span className="text-[10px] text-textMuted">{done}/{dayItems.length}</span>}
                  </div>
                  {minutes > 0 && <p className="mt-1 text-[10px] text-sky-300">{formatMinutes(minutes)}</p>}
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayItems.slice(0, 3).map((item) => <span key={item.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getCategory(item.category).color }} />)}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text"><Flame size={18} className="text-amber-300" />오늘 먼저 할 일 TOP 3</h3>
            <div className="space-y-3">{topThree.length ? topThree.map(renderItemCard) : <p className="text-sm text-textMuted">오늘 남은 할 일이 없습니다.</p>}</div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text"><Clock3 size={18} className="text-primary" />{format(selectedDate, 'M월 d일')} 하루 일정</h3>
            <div className="space-y-2">
              {sortByExecutionPriority(selectedItems).sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99')).map(renderItemCard)}
              {!selectedItems.length && <p className="text-sm text-textMuted">선택한 날짜에 등록된 일정이 없습니다.</p>}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text"><NotebookPen size={18} className="text-emerald-300" />공부 시간 기록</h3>
          <form onSubmit={addStudyLog} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-textMuted">날짜</span>
                <input type="date" value={studyLogForm.date} onChange={(e) => setStudyLogForm({ ...studyLogForm, date: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-textMuted">공부 시간</span>
                <input type="number" min="1" value={studyLogForm.minutes} onChange={(e) => setStudyLogForm({ ...studyLogForm, minutes: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-textMuted">주제</span>
              <input value={studyLogForm.topic} onChange={(e) => setStudyLogForm({ ...studyLogForm, topic: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text" placeholder="예: 반도체 공정, 영어, 코딩 테스트" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-textMuted">연결 일정</span>
              <select value={studyLogForm.linkedTaskId} onChange={(e) => setStudyLogForm({ ...studyLogForm, linkedTaskId: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text">
                <option value="">연결하지 않음</option>
                {items
                  .filter((item) => item.category === 'study')
                  .slice(0, 30)
                  .map((item) => <option key={item.id} value={item.id}>{item.date} · {item.title}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-textMuted">메모</span>
              <textarea value={studyLogForm.memo} onChange={(e) => setStudyLogForm({ ...studyLogForm, memo: e.target.value })} rows={2} className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-text" placeholder="열품타 등에서 기록한 공부 내용을 간단히 남깁니다." />
            </label>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
              <Save size={15} />
              공부 기록 저장
            </button>
          </form>

          <div className="mt-5 space-y-2">
            <p className="text-sm font-bold text-text">최근 기록</p>
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-bold text-text">{session.topic}</p>
                  <p className="mt-1 text-xs text-textMuted">
                    {session.date} · {formatMinutes(session.minutes)}{session.linkedTaskTitle ? ` · ${session.linkedTaskTitle}` : ''}
                  </p>
                  {session.memo && <p className="mt-1 line-clamp-2 text-xs text-textMuted">{session.memo}</p>}
                </div>
                <button onClick={() => deleteStudyLog(session.id)} className="rounded-lg p-1.5 text-textMuted hover:bg-surface hover:text-red-300">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {!sessions.length && <p className="text-sm text-textMuted">아직 공부 기록이 없습니다.</p>}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-text"><BarChart3 size={18} className="text-sky-300" />주간 통계</h3>
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(148, 163, 184, 0.28)', borderRadius: 8, color: '#f8fafc' }} />
                  <Bar dataKey="studyMinutes" name="공부 시간" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats} dataKey="value" nameKey="name" innerRadius={45} outerRadius={82} paddingAngle={3}>
                    {categoryStats.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(148, 163, 184, 0.28)', borderRadius: 8, color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-text">할 일 보드</h3>
        <div className="grid gap-4 xl:grid-cols-4">
          {STATUS_OPTIONS.map((status) => {
            const statusItems = items.filter((item) => item.status === status.id && item.date >= todayKey).slice(0, 8);
            return (
              <div key={status.id} className="rounded-xl border border-border bg-background p-3">
                <h4 className="mb-3 font-bold text-text">{status.label} <span className="text-xs text-textMuted">{statusItems.length}</span></h4>
                <div className="space-y-2">
                  {statusItems.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-surface p-2">
                      <p className="line-clamp-1 text-sm font-bold text-text">{item.title}</p>
                      <p className="mt-1 text-[11px] text-textMuted">{item.date} · {getCategory(item.category).label}</p>
                    </div>
                  ))}
                  {!statusItems.length && <p className="text-xs text-textMuted">없음</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
