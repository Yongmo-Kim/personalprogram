import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BrainCircuit,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Sliders,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { loadData } from '../utils/storage';
import { fetchSemiNews, fetchWorldNews } from '../services/newsService';
import { fetchJobs } from '../services/jobsService';

const DEFAULT_WIDGETS = [
  { id: 'calendar', label: '오늘 일정', enabled: true },
  { id: 'jobs', label: '취업 공고', enabled: true },
  { id: 'worldNews', label: '세계뉴스', enabled: true },
  { id: 'semiNews', label: '반도체', enabled: true },
  { id: 'defense', label: '방위산업', enabled: true },
  { id: 'ai', label: '인공지능', enabled: true },
];

const loadWidgets = () => {
  try {
    const saved = localStorage.getItem('dashboardWidgets');
    const parsed = saved ? JSON.parse(saved) : [];
    const merged = DEFAULT_WIDGETS.map((widget) => parsed.find((item) => item.id === widget.id) || widget);
    return merged;
  } catch {
    return DEFAULT_WIDGETS;
  }
};

export const HomeDashboard = () => {
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [semiNews, setSemiNews] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [widgets, setWidgets] = useState(loadWidgets);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const allEvents = loadData('calendarEvents', {});
    setCalendarEvents(allEvents[todayDate] || []);

    fetchJobs().then((data) => setJobs((data.jobs || []).slice(0, 3))).catch(() => setJobs([]));
    fetchWorldNews().then((data) => setWorldNews(data.slice(0, 3))).catch(() => setWorldNews([]));
    fetchSemiNews().then((data) => setSemiNews(data.slice(0, 3))).catch(() => setSemiNews([]));
    setLastUpdated(new Date());
  }, [todayDate]);

  const saveWidgets = (nextWidgets) => {
    setWidgets(nextWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(nextWidgets));
  };

  const toggleWidget = (id) => {
    saveWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)));
  };

  const moveWidget = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= widgets.length) return;
    const updated = [...widgets];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    saveWidgets(updated);
  };

  const pendingEvents = calendarEvents.filter((event) => !event.completed).length;

  const renderWidget = (widget) => {
    if (!widget.enabled) return null;

    switch (widget.id) {
      case 'calendar':
        return (
          <Link key="calendar" to="/calendar" className="block md:col-span-2 xl:col-span-4">
            <Card className="h-full transition-colors hover:border-primary/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <CalendarDays size={20} className="text-primary" /> 오늘 일정
                {pendingEvents > 0 && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">{pendingEvents}개 남음</span>
                )}
              </h3>
              {calendarEvents.length > 0 ? (
                <ul className="space-y-2">
                  {calendarEvents.slice(0, 5).map((event) => (
                    <li key={event.id} className={`flex items-center gap-2 text-sm ${event.completed ? 'text-textMuted line-through' : ''}`}>
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      {event.time && <span className="text-textMuted">{event.time}</span>}
                      <span>{event.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-textMuted">오늘 등록된 일정이 없습니다.</p>
              )}
            </Card>
          </Link>
        );
      case 'jobs':
        return (
          <Link key="jobs" to="/jobs" className="block">
            <Card className="h-full transition-colors hover:border-yellow-500/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Briefcase size={20} className="text-yellow-400" /> 취업 공고
              </h3>
              {jobs.length > 0 ? (
                <ul className="space-y-2">
                  {jobs.map((job) => (
                    <li key={job.id} className="text-sm">
                      <p className="truncate font-medium">{job.company}</p>
                      <p className="truncate text-xs text-textMuted">{job.title}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-textMuted">표시할 공고가 없습니다.</p>
              )}
            </Card>
          </Link>
        );
      case 'worldNews':
        return (
          <Link key="worldNews" to="/world-news" className="block">
            <Card className="h-full transition-colors hover:border-blue-400/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Globe size={20} className="text-blue-400" /> 세계뉴스
              </h3>
              {worldNews.length > 0 ? (
                <ul className="space-y-2">
                  {worldNews.map((item) => (
                    <li key={item.id} className="text-sm">
                      <p className="line-clamp-1 font-medium">{item.title}</p>
                      <p className="truncate text-xs text-textMuted">{item.source} · {item.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-textMuted">뉴스를 가져오는 중입니다...</p>
              )}
            </Card>
          </Link>
        );
      case 'semiNews':
        return (
          <Link key="semiNews" to="/semiconductor" className="block">
            <Card className="h-full transition-colors hover:border-purple-400/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Cpu size={20} className="text-purple-400" /> 반도체
              </h3>
              {semiNews.length > 0 ? (
                <ul className="space-y-2">
                  {semiNews.map((item) => (
                    <li key={item.id} className="text-sm">
                      <p className="line-clamp-1 font-medium">{item.title}</p>
                      <p className="truncate text-xs text-textMuted">{item.source} · {item.publishedAt || item.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-textMuted">뉴스를 가져오는 중입니다...</p>
              )}
            </Card>
          </Link>
        );
      case 'defense':
        return (
          <Link key="defense" to="/defense" className="block">
            <Card className="h-full transition-colors hover:border-emerald-400/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Shield size={20} className="text-emerald-400" /> 방위산업
              </h3>
              <p className="mb-2 text-sm leading-relaxed text-textMuted">
                국내외 방산 기업, 핵심 기술, 밸류체인, 시장가치 흐름을 확인합니다.
              </p>
              <span className="text-xs font-medium text-primary hover:underline">자세히 보기 →</span>
            </Card>
          </Link>
        );
      case 'ai':
        return (
          <Link key="ai" to="/ai" className="block">
            <Card className="h-full transition-colors hover:border-fuchsia-400/50">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <BrainCircuit size={20} className="text-fuchsia-400" /> 인공지능
              </h3>
              <p className="mb-2 text-sm leading-relaxed text-textMuted">
                AI 기업, 모델, 인프라, 밸류체인, 시장 흐름을 하나의 산업 지도로 확인합니다.
              </p>
              <span className="text-xs font-medium text-primary hover:underline">자세히 보기 →</span>
            </Card>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">오늘의 대시보드</h2>
          <p className="mt-1 text-textMuted">{format(new Date(), 'yyyy년 MM월 dd일')}</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden items-center gap-1 text-xs text-textMuted sm:flex">
              <Clock size={12} /> {format(lastUpdated, 'HH:mm')} 업데이트
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl border p-2 text-xs font-semibold transition-colors ${
              isEditing
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface text-textMuted hover:text-text'
            }`}
          >
            <Sliders size={14} />
            위젯 관리
          </button>
        </div>
      </header>

      {isEditing && (
        <Card className="border-primary/20 bg-primary/5 p-4">
          <h3 className="mb-3 text-sm font-bold text-primary">위젯 관리 및 순서 설정</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {widgets.map((widget, index) => (
              <div key={widget.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-xs">
                <span className="mr-2 truncate font-semibold">{widget.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleWidget(widget.id)}
                    className={`cursor-pointer rounded p-1 transition-colors ${
                      widget.enabled ? 'text-primary hover:bg-primary/10' : 'text-textMuted hover:bg-background'
                    }`}
                    title={widget.enabled ? '숨기기' : '보이기'}
                  >
                    {widget.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveWidget(index, -1)}
                    disabled={index === 0}
                    className="cursor-pointer rounded p-1 text-text hover:bg-background disabled:opacity-30"
                    title="앞으로"
                  >
                    <ChevronUp size={14} className="rotate-270 md:rotate-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveWidget(index, 1)}
                    disabled={index === widgets.length - 1}
                    className="cursor-pointer rounded p-1 text-text hover:bg-background disabled:opacity-30"
                    title="뒤로"
                  >
                    <ChevronDown size={14} className="rotate-270 md:rotate-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => renderWidget(widget))}
      </div>

      {widgets.filter((widget) => widget.enabled).length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 py-20 text-center text-textMuted">
          <Sliders size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">화면에 표시할 위젯이 없습니다.</p>
          <p className="mt-1 text-xs">상단의 위젯 관리 버튼을 눌러 위젯을 활성화해보세요.</p>
        </div>
      )}
    </div>
  );
};
