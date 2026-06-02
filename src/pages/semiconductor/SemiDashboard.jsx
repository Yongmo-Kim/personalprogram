import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Cpu, RefreshCw, Target, TimerReset } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { CompanyLogo } from '../../components/semiconductor/CompanyLogo';
import { companies } from '../../data/semiconductorCompanies';
import { technologies } from '../../data/semiconductorTechnologies';
import { fetchSemiconductorNews } from '../../services/newsService';
import { getSegmentClasses, getSegmentLabel, SEGMENTS } from '../../utils/semiconductorStyles';

const REFRESH_INTERVAL = 5 * 60 * 1000;

export const SemiDashboard = () => {
  const [region, setRegion] = useState('korea');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSemiconductorNews();
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || '뉴스를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    intervalRef.current = setInterval(loadNews, REFRESH_INTERVAL);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [autoRefresh, loadNews]);

  const regionCompanies = useMemo(
    () => companies.filter((company) => company.region === region),
    [region]
  );

  const segmentCounts = useMemo(
    () =>
      SEGMENTS.map((segment) => ({
        ...segment,
        count: regionCompanies.filter((company) => company.segments.includes(segment.id)).length,
      })),
    [regionCompanies]
  );

  const kpis = [
    { label: '국내 기업', value: companies.filter((company) => company.region === 'korea').length },
    { label: '해외 기업', value: companies.filter((company) => company.region === 'global').length },
    { label: '산업 분류', value: SEGMENTS.length },
    { label: '기술 키워드', value: technologies.length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/25 bg-primary/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Cpu size={22} />
              <span className="text-sm font-semibold">Semiconductor Intelligence</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">반도체 산업 지도</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-textMuted">
              국내/해외 기업을 산업 분류와 핵심 기술 기준으로 탐색하고, 실제 Google News RSS 기반 뉴스를 함께 확인합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {lastUpdated && (
              <span className="flex items-center gap-1.5 text-textMuted">
                <TimerReset size={15} />
                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 업데이트
              </span>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-textMuted">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(event) => setAutoRefresh(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              5분 자동 갱신
            </label>
            <button
              onClick={loadNews}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-text transition-colors hover:border-primary/50 hover:text-primary"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              새로고침
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((item) => (
            <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3">
              <p className="text-xs text-textMuted">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-lg font-bold text-text">
                <Target size={18} className="text-primary" />
                산업 분류별 탐색
              </h3>
              <div className="flex rounded-lg border border-border bg-surface p-1">
                {[
                  { id: 'korea', label: '국내' },
                  { id: 'global', label: '해외' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRegion(item.id)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      region === item.id ? 'bg-primary text-white' : 'text-textMuted hover:text-text'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {segmentCounts.map((segment) => (
                <Link key={segment.id} to={`/semiconductor/${region}/${segment.id}`}>
                  <div
                    className={`rounded-xl border p-4 transition-colors hover:border-primary/60 hover:bg-surface ${segment.classes}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{segment.label}</span>
                      <span className="rounded-full bg-background/60 px-2 py-0.5 text-xs">{segment.count}개</span>
                    </div>
                    <p className="mt-2 text-xs opacity-80">
                      {region === 'korea' ? '국내' : '해외'} {segment.label} 기업 보기
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Card>
            <h3 className="mb-4 text-lg font-bold text-text">주요 기업 미리보기</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {regionCompanies.slice(0, 8).map((company) => (
                <Link key={company.id} to={`/semiconductor/${company.region}/${company.segments[0]}/${company.id}`}>
                  <div className="flex h-full gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/50">
                    <CompanyLogo company={company} size="sm" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-text">{company.nameKo || company.name}</span>
                        <span className="text-xs text-textMuted">{company.country}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-textMuted">{company.shortDescription}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {company.segments.slice(0, 3).map((segment) => (
                          <span key={segment} className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(segment)}`}>
                            {getSegmentLabel(segment)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex max-h-[680px] flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-text">
              <Activity size={18} className="text-primary" />
              실시간 주요 뉴스
            </h3>
            {news.some((item) => item.isFallback) && (
              <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-300">샘플 데이터</span>
            )}
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {loading && news.length === 0 ? (
              <p className="py-10 text-center text-sm text-textMuted">뉴스를 불러오는 중...</p>
            ) : (
              news.map((item) => (
                <article key={item.id} className="border-b border-border/60 pb-3 last:border-0">
                  <a href={item.url || '#'} target={item.url ? '_blank' : undefined} rel="noopener noreferrer" className="group block">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-text group-hover:text-primary">
                      {item.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-textMuted">
                      <span>{item.source || 'Google News'}</span>
                      {item.publishedAt && <span>·</span>}
                      {item.publishedAt && <span>{item.publishedAt}</span>}
                      {item.segment && (
                        <span className={`rounded border px-1.5 py-0.5 ${getSegmentClasses(item.segment)}`}>
                          {getSegmentLabel(item.segment)}
                        </span>
                      )}
                    </div>
                  </a>
                </article>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};
