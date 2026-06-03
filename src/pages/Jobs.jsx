import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Newspaper,
  Plus,
  RefreshCw,
  SearchX,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { createPlannerId, loadPlannerItems, savePlannerItems } from '../services/calendarService';
import {
  fetchJobs,
  getJobIndustry,
  JOB_INDUSTRIES,
  JOB_STATUS_OPTIONS,
  JOB_TYPES,
} from '../services/jobsService';
import { fetchHiringNews, getHiringCompanies } from '../services/hiringDiscoveryService';

const STATUS_COLORS = {
  interested: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  saved: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  applied: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  done: 'bg-primary/10 text-primary dark:bg-primary/20',
  rejected: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
};

const INDUSTRY_COLORS = {
  semiconductor: 'bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  defense: 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
  ai: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
  electronics: 'bg-sky-50 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  mobility: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300',
  battery: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  communications: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  robotics: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
  embedded: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
  rnd: 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
};

const TYPE_COLORS = {
  intern: 'bg-lime-50 text-lime-600 dark:bg-lime-500/20 dark:text-lime-300',
  newgrad: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300',
  entry: 'bg-primary/10 text-primary dark:bg-primary/20',
  experienced: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
};

const FAVORITES_KEY = 'favoriteHiringCompanies';
const MANUAL_JOBS_KEY = 'manualJobWatchList';

const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadStatuses = () => loadJson('jobStatuses', {});
const saveStatuses = (statuses) => saveJson('jobStatuses', statuses);

const initialManualJob = {
  company: '',
  title: '',
  url: '',
  deadline: '',
};

const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const addJobDeadlineToCalendar = (job) => {
  if (!job.deadline) return;

  const items = loadPlannerItems();
  const exists = items.some((item) => item.sourceUrl && item.sourceUrl === job.url);
  if (exists) return;

  savePlannerItems([
    ...items,
    {
      id: createPlannerId(),
      title: `[채용마감] ${job.company} ${job.title}`,
      description: job.url,
      date: job.deadline,
      startTime: '',
      endTime: '',
      category: 'career',
      importance: 'high',
      urgency: 'high',
      status: 'planned',
      repeat: 'none',
      estimatedMinutes: 30,
      actualMinutes: 0,
      memo: '취업 페이지에서 저장한 관심 공고입니다.',
      sourceUrl: job.url,
      createdAt: new Date().toISOString(),
    },
  ]);
};

const JobCard = ({ job, currentStatus, onStatusChange }) => (
  <Card className="flex flex-col justify-between gap-4 transition-colors hover:border-primary/50">
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${INDUSTRY_COLORS[job.industryId] || 'bg-slate-500/20 text-slate-300'}`}>
          {job.industry}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[job.typeId] || 'bg-slate-500/20 text-slate-300'}`}>
          {job.type}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[currentStatus] || STATUS_COLORS.interested}`}>
          {JOB_STATUS_OPTIONS.find((status) => status.value === currentStatus)?.label || currentStatus}
        </span>
        {job.source && (
          <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-textMuted">
            {job.source}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-textMuted">{job.company}</p>
        <h3 className="mt-0.5 text-lg font-bold leading-snug text-text">{job.title}</h3>
      </div>

      {job.description && <p className="line-clamp-2 text-sm text-textMuted">{job.description}</p>}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-textMuted">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {job.location}
          </span>
        )}
        {job.deadline && (
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {job.deadline}
          </span>
        )}
        {job.postingDate && <span>게시 {job.postingDate}</span>}
      </div>

      {job.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.keywords.slice(0, 8).map((kw) => (
            <span key={kw} className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs text-textMuted">
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>

    <div className="flex items-center gap-3 border-t border-border pt-2">
      <label htmlFor={`status-${job.id}`} className="sr-only">상태 변경</label>
      <select
        id={`status-${job.id}`}
        value={currentStatus}
        onChange={(event) => onStatusChange(job.id, event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {JOB_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {job.url && (
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex">
          <Button variant="outline" className="flex items-center gap-1.5 py-1.5 text-sm">
            <ExternalLink size={14} />
            공고 보기
          </Button>
        </a>
      )}
    </div>
  </Card>
);

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [industry, setIndustry] = useState('semiconductor');
  const [type, setType] = useState('entry');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [statuses, setStatuses] = useState(loadStatuses);
  const [favorites, setFavorites] = useState(() => loadJson(FAVORITES_KEY, []));
  const [manualJobs, setManualJobs] = useState(() => loadJson(MANUAL_JOBS_KEY, []));
  const [manualJob, setManualJob] = useState(initialManualJob);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [hiringNews, setHiringNews] = useState([]);
  const [hiringNewsLoading, setHiringNewsLoading] = useState(false);
  const [hiringNewsError, setHiringNewsError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 350);
    return () => clearTimeout(timer);
  }, [keyword]);

  const visibleIndustry = useMemo(() => getJobIndustry(industry), [industry]);

  const hiringCompanies = useMemo(
    () => getHiringCompanies({ industry, keyword: debouncedKeyword }),
    [debouncedKeyword, industry]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const sortedHiringCompanies = useMemo(
    () => [...hiringCompanies].sort((a, b) => Number(favoriteSet.has(b.id)) - Number(favoriteSet.has(a.id))),
    [favoriteSet, hiringCompanies]
  );

  const selectedCompany = useMemo(
    () => sortedHiringCompanies.find((company) => company.id === selectedCompanyId) || sortedHiringCompanies[0],
    [selectedCompanyId, sortedHiringCompanies]
  );

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchJobs({ industry, type, keyword: debouncedKeyword });
      setJobs(result.jobs);
      setMeta(result.meta);
    } catch (err) {
      setJobs([]);
      setMeta({});
      setError(err.message || '실제 채용 공고를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, industry, type]);

  const loadHiringNews = useCallback(async () => {
    if (!selectedCompany) {
      setHiringNews([]);
      return;
    }

    setHiringNewsLoading(true);
    setHiringNewsError('');
    try {
      const news = await fetchHiringNews({ company: selectedCompany, type, limit: 8 });
      setHiringNews(news);
    } catch (err) {
      setHiringNews([]);
      setHiringNewsError(err.message || '채용 소식을 불러오지 못했습니다.');
    } finally {
      setHiringNewsLoading(false);
    }
  }, [selectedCompany, type]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    loadHiringNews();
  }, [loadHiringNews]);

  const handleStatusChange = (jobId, newStatus) => {
    setStatuses((prev) => {
      const updated = { ...prev, [jobId]: newStatus };
      saveStatuses(updated);
      return updated;
    });
  };

  const toggleFavorite = (companyId) => {
    setFavorites((prev) => {
      const updated = prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId];
      saveJson(FAVORITES_KEY, updated);
      return updated;
    });
  };

  const handleManualSave = (event) => {
    event.preventDefault();
    const url = normalizeUrl(manualJob.url);
    if (!manualJob.company.trim() || !manualJob.title.trim() || !url) return;

    const savedJob = {
      id: `manual-job-${Date.now()}`,
      company: manualJob.company.trim(),
      title: manualJob.title.trim(),
      url,
      deadline: manualJob.deadline,
      savedAt: new Date().toISOString(),
    };

    const updated = [savedJob, ...manualJobs].slice(0, 40);
    setManualJobs(updated);
    saveJson(MANUAL_JOBS_KEY, updated);
    addJobDeadlineToCalendar(savedJob);
    setManualJob(initialManualJob);
  };

  const removeManualJob = (jobId) => {
    const updated = manualJobs.filter((job) => job.id !== jobId);
    setManualJobs(updated);
    saveJson(MANUAL_JOBS_KEY, updated);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/15 bg-primary/5 p-5 dark:border-primary/25 dark:bg-primary/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Briefcase size={26} />
              <span className="text-sm font-semibold">전자공학 커리어 보드</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-text">취업 공고</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              API 키가 있으면 실제 공고를 자동 조회하고, 키가 없을 때는 반도체·방산·AI 기업의 공식 채용관과 Google News 채용 소식으로 추적합니다.
            </p>
          </div>
          <button
            onClick={() => {
              loadJobs();
              loadHiringNews();
            }}
            disabled={loading || hiringNewsLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-border disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading || hiringNewsLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: Building2, label: '선택 산업', value: visibleIndustry.label },
            { icon: GraduationCap, label: '공고 유형', value: JOB_TYPES.find((item) => item.id === type)?.label || '전체' },
            { icon: Briefcase, label: 'API 공고', value: `${jobs.length}개` },
            { icon: ClipboardList, label: '채용관 기업', value: `${hiringCompanies.length}개` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3">
              <div className="flex items-center gap-2 text-textMuted">
                <item.icon size={16} />
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="mt-1 truncate text-lg font-bold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <div className="grid gap-4 lg:grid-cols-[220px_180px_1fr]">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-textMuted">산업 분야</span>
            <select
              value={industry}
              onChange={(event) => {
                setIndustry(event.target.value);
                setSelectedCompanyId('');
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {JOB_INDUSTRIES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-textMuted">인턴 / 신입</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {JOB_TYPES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>

          <Input
            id="job-keyword-search"
            label="키워드 검색"
            placeholder="회사명, 직무, 기술 키워드: 삼성, FPGA, 임베디드, 회로설계..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <p className="mt-3 text-xs text-textMuted">
          API 공고는 사람인/공공데이터 키가 있어야 표시됩니다. 아래 공식 채용관과 채용 뉴스는 API 키 없이 사용할 수 있습니다.
        </p>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Building2 size={20} />
                <span className="text-sm font-semibold">공식 채용관</span>
              </div>
              <h2 className="mt-1 text-xl font-bold text-text">관심 기업 채용 페이지</h2>
              <p className="mt-1 text-sm text-textMuted">반도체 시장가치 기업과 주요 방산 기업을 클릭 기반으로 추적합니다.</p>
            </div>
            <p className="text-xs text-textMuted">관심기업 {favorites.length}개</p>
          </div>

          <div className="mt-4 grid max-h-[640px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
            {sortedHiringCompanies.map((company) => {
              const active = selectedCompany?.id === company.id;
              const favorite = favoriteSet.has(company.id);

              return (
                <div
                  key={company.id}
                  className={`rounded-xl border p-3 transition-colors ${active ? 'border-primary/70 bg-primary/10' : 'border-border bg-background/70 hover:border-primary/40'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCompanyId(company.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-bold text-text">{company.displayName}</p>
                      <p className="mt-0.5 truncate text-xs text-textMuted">{company.name}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(company.id)}
                      className={`rounded-lg p-1.5 ${favorite ? 'text-amber-400' : 'text-textMuted hover:text-amber-400'}`}
                      aria-label="관심기업 전환"
                    >
                      <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-textMuted">{company.segmentLabel}</span>
                    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-textMuted">{company.region === 'korea' ? '국내' : '해외'}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={company.careerUrl || company.officialSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text hover:border-primary/60"
                    >
                      <ExternalLink size={13} />
                      {company.careerUrl ? '공식 채용' : '채용 검색'}
                    </a>
                    <a
                      href={company.newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text hover:border-primary/60"
                    >
                      <Newspaper size={13} />
                      뉴스 검색
                    </a>
                    <a
                      href={company.saraminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text hover:border-primary/60"
                    >
                      사람인
                    </a>
                    <a
                      href={company.jobkoreaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text hover:border-primary/60"
                    >
                      잡코리아
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <Newspaper size={20} />
                  <span className="text-sm font-semibold">실시간 채용 소식</span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-text">{selectedCompany?.displayName || '기업 선택'}</h2>
                <p className="mt-1 text-sm text-textMuted">Google News RSS 기반 채용/인턴/신입 소식을 최신순으로 가져옵니다.</p>
              </div>
              <button
                type="button"
                onClick={loadHiringNews}
                disabled={hiringNewsLoading || !selectedCompany}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text hover:bg-border disabled:opacity-50"
              >
                <RefreshCw size={14} className={hiringNewsLoading ? 'animate-spin' : ''} />
                갱신
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {hiringNewsLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-textMuted">
                  <Loader2 size={20} className="animate-spin text-primary" />
                  채용 소식을 불러오는 중입니다.
                </div>
              ) : hiringNewsError ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                  {hiringNewsError}
                </div>
              ) : hiringNews.length ? (
                hiringNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-border bg-background/70 p-3 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-text">{item.title}</h3>
                      <ExternalLink size={14} className="mt-0.5 shrink-0 text-primary" />
                    </div>
                    <p className="mt-2 text-xs text-textMuted">{item.source} · {item.publishedAt || '날짜 없음'}</p>
                  </a>
                ))
              ) : (
                <div className="rounded-lg border border-border bg-background/70 p-4 text-sm text-textMuted">
                  선택한 조건의 채용 소식이 아직 없습니다. 공식 채용 페이지와 사람인/잡코리아 검색을 같이 확인하세요.
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-primary">
              <Bookmark size={20} />
              <span className="text-sm font-semibold">관심 공고 저장</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-text">공고 URL 직접 기록</h2>
            <p className="mt-1 text-sm text-textMuted">공식 사이트에서 찾은 공고를 저장하면 마감일이 일정표에 같이 등록됩니다.</p>

            <form onSubmit={handleManualSave} className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id="manual-job-company"
                  label="회사"
                  placeholder="삼성전자"
                  value={manualJob.company}
                  onChange={(event) => setManualJob((prev) => ({ ...prev, company: event.target.value }))}
                />
                <Input
                  id="manual-job-deadline"
                  label="마감일"
                  type="date"
                  value={manualJob.deadline}
                  onChange={(event) => setManualJob((prev) => ({ ...prev, deadline: event.target.value }))}
                />
              </div>
              <Input
                id="manual-job-title"
                label="공고 제목"
                placeholder="DS부문 신입 채용"
                value={manualJob.title}
                onChange={(event) => setManualJob((prev) => ({ ...prev, title: event.target.value }))}
              />
              <Input
                id="manual-job-url"
                label="공고 URL"
                placeholder="https://..."
                value={manualJob.url}
                onChange={(event) => setManualJob((prev) => ({ ...prev, url: event.target.value }))}
              />
              <Button type="submit" className="inline-flex items-center justify-center gap-2">
                <Plus size={16} />
                저장하고 일정표에 연결
              </Button>
            </form>

            <div className="mt-5 space-y-2">
              {manualJobs.length ? (
                manualJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-text">{job.company} · {job.title}</p>
                      <p className="mt-0.5 text-xs text-textMuted">{job.deadline ? `마감 ${job.deadline}` : '마감일 미등록'}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-primary hover:bg-primary/10" aria-label="공고 열기">
                        <LinkIcon size={16} />
                      </a>
                      <button type="button" onClick={() => removeManualJob(job.id)} className="rounded-lg p-2 text-textMuted hover:bg-red-500/10 hover:text-red-400" aria-label="공고 삭제">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-border bg-background/70 p-4 text-sm text-textMuted">
                  아직 저장한 관심 공고가 없습니다.
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">API 실제 공고</h2>
            <p className="mt-1 text-sm text-textMuted">사람인/공공데이터 키가 연결되면 이 영역에 구조화된 실제 공고가 표시됩니다.</p>
          </div>
          {meta.lastUpdated && <p className="text-xs text-textMuted">마지막 업데이트: {meta.lastUpdated}</p>}
        </div>

        {error && (
          <Card>
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-300" />
              <div>
                <p className="font-bold text-amber-100">실제 채용 API 연결 대기 중</p>
                <p className="mt-1 text-sm text-amber-100/80">{error}</p>
                <p className="mt-2 text-xs text-amber-100/70">
                  Vercel 환경변수에 `SARAMIN_ACCESS_KEY`, `PUBLIC_RECRUITMENT_SERVICE_KEY`, `PUBLIC_DATA_SERVICE_KEY` 중 하나를 넣으면 실제 공고가 표시됩니다.
                </p>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-textMuted">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm">실제 채용 공고를 불러오는 중입니다.</p>
          </div>
        ) : !error && jobs.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-textMuted">
              <SearchX size={42} className="opacity-50" />
              <p className="text-lg font-medium">현재 조건에 맞는 실제 API 공고가 없습니다.</p>
              <p className="text-sm">공식 채용관과 채용 뉴스 영역을 먼저 활용하세요.</p>
            </div>
          </Card>
        ) : !error ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-textMuted">
                총 <span className="font-bold text-text">{jobs.length}</span>개의 실제 공고
                {meta.total ? <span className="ml-2">API 전체 결과 {meta.total}개</span> : null}
              </p>
              {meta.source && <p className="text-xs text-textMuted">출처: {meta.source}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  currentStatus={statuses[job.id] || 'interested'}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
};
