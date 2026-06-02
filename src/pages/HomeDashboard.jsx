import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Briefcase, CalendarDays, Clock, Cpu, Globe, Shield } from 'lucide-react';
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

  useEffect(() => {
    const allEvents = loadData('calendarEvents', {});
    setCalendarEvents(allEvents[todayDate] || []);

    fetchJobs().then((data) => setJobs((data.jobs || []).slice(0, 3))).catch(() => setJobs([]));
    fetchWorldNews().then((data) => setWorldNews(data.slice(0, 3))).catch(() => setWorldNews([]));
    fetchSemiNews().then((data) => setSemiNews(data.slice(0, 3))).catch(() => setSemiNews([]));
    setLastUpdated(new Date());
  }, [todayDate]);

  const pendingEvents = calendarEvents.filter((event) => !event.completed).length;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">오늘의 대시보드</h2>
          <p className="mt-1 text-textMuted">{format(new Date(), 'yyyy년 MM월 dd일')}</p>
        </div>
        {lastUpdated && (
          <span className="flex items-center gap-1 text-xs text-textMuted">
            <Clock size={12} /> {format(lastUpdated, 'HH:mm')} 업데이트
          </span>
        )}
      </header>

      <Link to="/calendar" className="block">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/jobs" className="block">
          <Card className="h-full transition-colors hover:border-yellow-500/50">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Briefcase size={20} className="text-yellow-400" /> 취업 공고
            </h3>
            {jobs.length > 0 ? (
              <ul className="space-y-2">
                {jobs.map((job) => (
                  <li key={job.id} className="text-sm">
                    <p className="font-medium">{job.company}</p>
                    <p className="text-xs text-textMuted">{job.title}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-textMuted">표시할 공고가 없습니다.</p>
            )}
          </Card>
        </Link>

        <Link to="/world-news" className="block">
          <Card className="h-full transition-colors hover:border-blue-400/50">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Globe size={20} className="text-blue-400" /> 세계뉴스
            </h3>
            <ul className="space-y-2">
              {worldNews.map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="line-clamp-1 font-medium">{item.title}</p>
                  <p className="text-xs text-textMuted">{item.source} · {item.date}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Link>

        <Link to="/semiconductor" className="block">
          <Card className="h-full transition-colors hover:border-purple-400/50">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Cpu size={20} className="text-purple-400" /> 반도체
            </h3>
            <ul className="space-y-2">
              {semiNews.map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="line-clamp-1 font-medium">{item.title}</p>
                  <p className="text-xs text-textMuted">{item.source} · {item.publishedAt || item.date}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Link>

        <Link to="/defense" className="block">
          <Card className="h-full transition-colors hover:border-emerald-400/50">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Shield size={20} className="text-emerald-400" /> 방위산업
            </h3>
            <p className="text-sm leading-relaxed text-textMuted">
              국내외 방산 기업, 핵심 기술, 밸류체인, 시장가치 흐름을 확인합니다.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
};
