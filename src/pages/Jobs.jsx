import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  RefreshCw,
  SearchX,
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import {
  fetchJobs,
  getJobIndustry,
  JOB_INDUSTRIES,
  JOB_STATUS_OPTIONS,
  JOB_TYPES,
} from '../services/jobsService';

const STATUS_COLORS = {
  interested: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300',
  saved: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
  applied: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  done: 'bg-primary/10 dark:bg-primary/20 text-primary',
  rejected: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300',
};

const INDUSTRY_COLORS = {
  semiconductor: 'bg-violet-50 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300',
  defense: 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300',
  electronics: 'bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
  mobility: 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300',
  battery: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  communications: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300',
  robotics: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300',
  embedded: 'bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300',
  rnd: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
};

const TYPE_COLORS = {
  intern: 'bg-lime-50 dark:bg-lime-500/20 text-lime-600 dark:text-lime-300',
  newgrad: 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300',
  entry: 'bg-primary/10 dark:bg-primary/20 text-primary',
  experienced: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300',
};

const loadStatuses = () => {
  try {
    const raw = localStorage.getItem('jobStatuses');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStatuses = (statuses) => {
  localStorage.setItem('jobStatuses', JSON.stringify(statuses));
};

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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 350);
    return () => clearTimeout(timer);
  }, [keyword]);

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

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleStatusChange = (jobId, newStatus) => {
    setStatuses((prev) => {
      const updated = { ...prev, [jobId]: newStatus };
      saveStatuses(updated);
      return updated;
    });
  };

  const visibleIndustry = useMemo(() => getJobIndustry(industry), [industry]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/15 dark:border-primary/25 bg-primary/5 dark:bg-primary/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Briefcase size={26} />
              <span className="text-sm font-semibold">전자공학 커리어 보드</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-text">취업 공고</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              전자공학부가 갈 수 있는 산업체를 나누고, 공공데이터 API 우선 기반으로 인턴/신입 공고를 확인합니다.
            </p>
          </div>
          <button
            onClick={loadJobs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-border disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: Building2, label: '선택 산업', value: visibleIndustry.label },
            { icon: GraduationCap, label: '공고 유형', value: JOB_TYPES.find((item) => item.id === type)?.label || '전체' },
            { icon: Briefcase, label: '표시 공고', value: `${jobs.length}개` },
            { icon: Calendar, label: '출처', value: meta.source || '채용 API' },
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
              onChange={(event) => setIndustry(event.target.value)}
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
          실제 공고만 표시합니다. API 키가 없거나 외부 연결이 실패하면 샘플 공고를 대신 보여주지 않습니다.
        </p>
      </Card>

      {error && (
        <Card>
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <p className="font-bold text-amber-100">실제 채용 API 연결 필요</p>
              <p className="mt-1 text-sm text-amber-100/80">{error}</p>
              <p className="mt-2 text-xs text-amber-100/70">
                공공데이터는 `PUBLIC_RECRUITMENT_SERVICE_KEY` 또는 `PUBLIC_DATA_SERVICE_KEY`, 사람인은 `SARAMIN_ACCESS_KEY`를 `.env`에 넣으면 실제 공고가 표시됩니다.
              </p>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-textMuted">
          <Loader2 size={36} className="animate-spin text-primary" />
          <p className="text-sm">실제 채용 공고를 불러오는 중입니다.</p>
        </div>
      ) : !error && jobs.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-textMuted">
            <SearchX size={48} className="opacity-50" />
            <p className="text-lg font-medium">현재 조건에 맞는 실제 공고가 없습니다.</p>
            <p className="text-sm">산업 분야나 키워드를 바꿔 다시 검색해보세요.</p>
          </div>
        </Card>
      ) : !error ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-textMuted">
              총 <span className="font-bold text-text">{jobs.length}</span>개의 실제 공고
              {meta.total ? <span className="ml-2">API 전체 결과 {meta.total}개</span> : null}
            </p>
            {meta.lastUpdated && <p className="text-xs text-textMuted">마지막 업데이트: {meta.lastUpdated}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {jobs.map((job) => {
              const currentStatus = statuses[job.id] || 'interested';
              return (
                <Card key={job.id} className="flex flex-col justify-between gap-4 transition-colors hover:border-primary/50">
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
                      onChange={(event) => handleStatusChange(job.id, event.target.value)}
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
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};
