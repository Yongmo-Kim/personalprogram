import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Briefcase, CalendarDays, Clock, Cpu, Globe, Shield, Sliders, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { loadData } from '../utils/storage';
import { fetchSemiNews, fetchWorldNews } from '../services/newsService';
import { fetchJobs } from '../services/jobsService';

export const HomeDashboard = () => {
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [semiNews, setSemiNews] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Widget Customization States
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboardWidgets');
      return saved ? JSON.parse(saved) : [
        { id: 'calendar', label: '오늘 일정', enabled: true },
        { id: 'jobs', label: '취업 공고', enabled: true },
        { id: 'worldNews', label: '세계 뉴스', enabled: true },
        { id: 'semiNews', label: '반도체 뉴스', enabled: true },
        { id: 'defense', label: '방위산업', enabled: true }
      ];
    } catch {
      return [
        { id: 'calendar', label: '오늘 일정', enabled: true },
        { id: 'jobs', label: '취업 공고', enabled: true },
        { id: 'worldNews', label: '세계 뉴스', enabled: true },
        { id: 'semiNews', label: '반도체 뉴스', enabled: true },
        { id: 'defense', label: '방위산업', enabled: true }
      ];
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const allEvents = loadData('calendarEvents', {});
    setCalendarEvents(allEvents[todayDate] || []);

    fetchJobs().then((data) => setJobs((data.jobs || []).slice(0, 3))).catch(() => setJobs([]));
    fetchWorldNews().then((data) => setWorldNews(data.slice(0, 3))).catch(() => setWorldNews([]));
    fetchSemiNews().then((data) => setSemiNews(data.slice(0, 3))).catch(() => setSemiNews([]));
    setLastUpdated(new Date());
  }, [todayDate]);

  const toggleWidget = (id) => {
    const updated = widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w);
    setWidgets(updated);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updated));
  };

  const moveWidget = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= widgets.length) return;
    const updated = [...widgets];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setWidgets(updated);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updated));
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
                      <p className="font-medium truncate">{job.company}</p>
                      <p className="text-xs text-textMuted truncate">{job.title}</p>
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
                      <p className="text-xs text-textMuted truncate">{item.source} · {item.date}</p>
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
                      <p className="text-xs text-textMuted truncate">{item.source} · {item.publishedAt || item.date}</p>
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
              <p className="text-sm leading-relaxed text-textMuted mb-2">
                국내외 방산 기업, 핵심 기술, 밸류체인, 시장가치 흐름을 확인합니다.
              </p>
              <span className="text-xs text-primary font-medium hover:underline">자세히 보기 &rarr;</span>
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
            <span className="hidden sm:flex items-center gap-1 text-xs text-textMuted">
              <Clock size={12} /> {format(lastUpdated, 'HH:mm')} 업데이트
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
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
          <h3 className="font-bold text-sm mb-3 text-primary">위젯 관리 및 순서 설정</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {widgets.map((widget, idx) => (
              <div key={widget.id} className="flex items-center justify-between bg-surface border border-border px-3 py-2 rounded-xl text-xs">
                <span className="font-semibold truncate mr-2">{widget.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      widget.enabled
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-textMuted hover:bg-background'
                    }`}
                    title={widget.enabled ? "숨기기" : "보이기"}
                  >
                    {widget.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => moveWidget(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-background disabled:opacity-30 cursor-pointer text-text"
                    title="앞으로"
                  >
                    <ChevronUp size={14} className="rotate-270 md:rotate-0" />
                  </button>
                  <button
                    onClick={() => moveWidget(idx, 1)}
                    disabled={idx === widgets.length - 1}
                    className="p-1 rounded hover:bg-background disabled:opacity-30 cursor-pointer text-text"
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

      {/* Widgets Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => renderWidget(widget))}
      </div>

      {widgets.filter(w => w.enabled).length === 0 && (
        <div className="py-20 text-center text-textMuted border border-dashed border-border rounded-2xl bg-surface/50">
          <Sliders size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">화면에 표시할 위젯이 없습니다.</p>
          <p className="text-xs mt-1">상단의 '위젯 관리' 버튼을 눌러 위젯을 활성화해보세요.</p>
        </div>
      )}
    </div>
  );
};
