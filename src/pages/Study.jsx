import { useState, useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { loadData, saveData } from '../utils/storage';
import { format, subDays } from 'date-fns';
import { BookOpen, Plus, Trash2, Check, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DEFAULT_SUBJECTS = ['반도체 공학', '회로 설계', '영어'];

export const Study = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [subjects, setSubjects] = useState(() => loadData('studySubjects', DEFAULT_SUBJECTS));
  const [tasks, setTasks] = useState(() => loadData('studyTasks', {}));
  const [newSubject, setNewSubject] = useState('');
  const [newTaskInputs, setNewTaskInputs] = useState({});
  const [timeInputs, setTimeInputs] = useState({});

  // Tasks for the selected date
  const dayTasks = useMemo(() => tasks[selectedDate] || [], [tasks, selectedDate]);

  // --- Subject Management ---
  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed || subjects.includes(trimmed)) return;
    const updated = [...subjects, trimmed];
    setSubjects(updated);
    saveData('studySubjects', updated);
    setNewSubject('');
  };

  const removeSubject = (subject) => {
    const updated = subjects.filter((s) => s !== subject);
    setSubjects(updated);
    saveData('studySubjects', updated);
  };

  // --- Task Management ---
  const saveTasks = (updatedAll) => {
    setTasks(updatedAll);
    saveData('studyTasks', updatedAll);
  };

  const addTask = (subject) => {
    const text = (newTaskInputs[subject] || '').trim();
    if (!text) return;
    const newTask = {
      id: Date.now().toString(),
      subject,
      task: text,
      completed: false,
      timeSpent: 0,
    };
    const updatedDay = [...dayTasks, newTask];
    saveTasks({ ...tasks, [selectedDate]: updatedDay });
    setNewTaskInputs({ ...newTaskInputs, [subject]: '' });
  };

  const removeTask = (taskId) => {
    const updatedDay = dayTasks.filter((t) => t.id !== taskId);
    saveTasks({ ...tasks, [selectedDate]: updatedDay });
  };

  const toggleTask = (taskId) => {
    const updatedDay = dayTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveTasks({ ...tasks, [selectedDate]: updatedDay });
  };

  const updateTimeSpent = (taskId) => {
    const minutes = parseInt(timeInputs[taskId], 10);
    if (isNaN(minutes) || minutes < 0) return;
    const updatedDay = dayTasks.map((t) =>
      t.id === taskId ? { ...t, timeSpent: minutes } : t
    );
    saveTasks({ ...tasks, [selectedDate]: updatedDay });
    setTimeInputs({ ...timeInputs, [taskId]: '' });
  };

  // --- Date Navigation ---
  const changeDate = (offset) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + offset);
    setSelectedDate(format(current, 'yyyy-MM-dd'));
  };

  // --- Weekly Summary ---
  const weeklySummary = useMemo(() => {
    const summary = {};
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dateTasks = tasks[date] || [];
      dateTasks.forEach((t) => {
        if (!summary[t.subject]) summary[t.subject] = 0;
        summary[t.subject] += t.timeSpent || 0;
      });
    }
    return summary;
  }, [tasks]);

  const maxWeeklyTime = Math.max(...Object.values(weeklySummary), 1);
  const totalWeeklyMinutes = Object.values(weeklySummary).reduce((a, b) => a + b, 0);

  // Group tasks by subject for the selected date
  const tasksBySubject = useMemo(() => {
    const grouped = {};
    subjects.forEach((s) => (grouped[s] = []));
    dayTasks.forEach((t) => {
      if (!grouped[t.subject]) grouped[t.subject] = [];
      grouped[t.subject].push(t);
    });
    return grouped;
  }, [dayTasks, subjects]);

  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalDayMinutes = dayTasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text flex items-center gap-3">
            <BookOpen size={32} className="text-primary" />
            학업 관리
          </h2>
          <p className="text-textMuted mt-1">과목별 학습 계획과 진행 상황을 관리하세요</p>
        </div>
      </header>

      {/* Date Selector */}
      <Card>
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl hover:bg-background transition-colors text-textMuted hover:text-text"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-background border border-border rounded-xl px-4 py-2 text-text text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <p className="text-sm text-textMuted mt-1">
              할 일 {dayTasks.length}개 · 완료 {completedCount}개 · 학습 {totalDayMinutes}분
            </p>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl hover:bg-background transition-colors text-textMuted hover:text-text"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Card>

      {/* Subject Management */}
      <Card>
        <h3 className="text-lg font-bold text-text mb-4">📚 과목 관리</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1.5 rounded-xl text-sm font-medium"
            >
              {subject}
              <button
                onClick={() => removeSubject(subject)}
                className="hover:text-red-400 transition-colors"
                title="과목 삭제"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {subjects.length === 0 && (
            <p className="text-textMuted text-sm">등록된 과목이 없습니다.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="새 과목명 입력"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            className="flex-1"
          />
          <Button onClick={addSubject} variant="primary" className="shrink-0">
            <Plus size={16} className="mr-1 inline" />
            추가
          </Button>
        </div>
      </Card>

      {/* Daily TODO by Subject */}
      <div className="space-y-4">
        {subjects.map((subject) => {
          const subjectTasks = tasksBySubject[subject] || [];
          const subjectCompleted = subjectTasks.filter((t) => t.completed).length;
          const subjectMinutes = subjectTasks.reduce((a, t) => a + (t.timeSpent || 0), 0);

          return (
            <Card key={subject}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-text">{subject}</h3>
                  <p className="text-xs text-textMuted">
                    {subjectTasks.length > 0
                      ? `${subjectCompleted}/${subjectTasks.length} 완료 · ${subjectMinutes}분 학습`
                      : '할 일 없음'}
                  </p>
                </div>
                {subjectTasks.length > 0 && (
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        subjectCompleted === subjectTasks.length && subjectTasks.length > 0
                          ? 'text-secondary'
                          : 'text-textMuted'
                      }`}
                    >
                      {subjectTasks.length > 0
                        ? Math.round((subjectCompleted / subjectTasks.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                )}
              </div>

              {/* Task List */}
              <ul className="space-y-2 mb-4">
                {subjectTasks.map((t) => (
                  <li
                    key={t.id}
                    className={`flex items-center gap-3 bg-background p-3 rounded-xl border transition-colors ${
                      t.completed ? 'border-secondary/30' : 'border-border'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                        t.completed
                          ? 'bg-secondary border-secondary text-white'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {t.completed && <Check size={14} />}
                    </button>

                    {/* Task text */}
                    <span
                      className={`flex-1 text-sm ${
                        t.completed ? 'line-through text-textMuted' : 'text-text'
                      }`}
                    >
                      {t.task}
                    </span>

                    {/* Time spent */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock size={14} className="text-textMuted" />
                      {t.timeSpent > 0 ? (
                        <span className="text-xs text-secondary font-medium">{t.timeSpent}분</span>
                      ) : (
                        <span className="text-xs text-textMuted">0분</span>
                      )}
                      <input
                        type="number"
                        min="0"
                        placeholder="분"
                        value={timeInputs[t.id] || ''}
                        onChange={(e) =>
                          setTimeInputs({ ...timeInputs, [t.id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === 'Enter' && updateTimeSpent(t.id)}
                        className="w-16 bg-surface border border-border rounded-lg px-2 py-1 text-xs text-text text-center focus:outline-none focus:border-primary transition-colors"
                      />
                      <Button
                        variant="outline"
                        className="!px-2 !py-1 text-xs"
                        onClick={() => updateTimeSpent(t.id)}
                      >
                        기록
                      </Button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeTask(t.id)}
                      className="text-textMuted hover:text-red-400 transition-colors shrink-0"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add task input */}
              <div className="flex gap-2">
                <Input
                  placeholder={`${subject} 할 일 입력`}
                  value={newTaskInputs[subject] || ''}
                  onChange={(e) =>
                    setNewTaskInputs({ ...newTaskInputs, [subject]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && addTask(subject)}
                  className="flex-1"
                />
                <Button onClick={() => addTask(subject)} variant="secondary" className="shrink-0">
                  <Plus size={16} className="mr-1 inline" />
                  추가
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <Card>
        <h3 className="text-lg font-bold text-text mb-1 flex items-center gap-2">
          📊 주간 학습 요약
        </h3>
        <p className="text-xs text-textMuted mb-4">
          최근 7일간 총 학습 시간:{' '}
          <span className="text-secondary font-bold">
            {Math.floor(totalWeeklyMinutes / 60)}시간 {totalWeeklyMinutes % 60}분
          </span>
        </p>

        {Object.keys(weeklySummary).length > 0 ? (
          <ul className="space-y-3">
            {Object.entries(weeklySummary)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const percentage = Math.round((minutes / maxWeeklyTime) * 100);

                return (
                  <li key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text">{subject}</span>
                      <span className="text-sm text-textMuted">
                        {hours > 0 ? `${hours}시간 ` : ''}
                        {mins}분
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-textMuted text-sm text-center py-4">
            최근 7일간 기록된 학습 시간이 없습니다.
          </p>
        )}
      </Card>
    </div>
  );
};
