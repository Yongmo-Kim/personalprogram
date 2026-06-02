import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Crosshair, Factory, Newspaper, RefreshCw, TimerReset } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { DefenseLogo } from '../../components/defense/DefenseLogo';
import { defenseCompanies } from '../../data/defenseCompanies';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { defenseValueChainStages } from '../../data/defenseInsightMaps';
import { fetchDefenseNews } from '../../services/newsService';
import { DEFENSE_SEGMENTS, getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseDashboard = () => {
  const [region, setRegion] = useState('korea');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    const data = await fetchDefenseNews();
    setNews(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const regionCompanies = useMemo(() => defenseCompanies.filter((company) => company.region === region), [region]);
  const segmentCounts = useMemo(
    () =>
      DEFENSE_SEGMENTS.map((segment) => ({
        ...segment,
        count: regionCompanies.filter((company) => company.segments.includes(segment.id)).length,
      })),
    [regionCompanies]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-300">
              <Crosshair size={22} />
              <span className="text-sm font-semibold">Defense Intelligence</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">방위산업 지도</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              방산 기업, 무기체계, 센서/플랫폼/무장/C4ISR 밸류체인, 획득 프로세스, 실제 Google News RSS 기반 뉴스를 함께 봅니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '기업', value: defenseCompanies.length },
              { label: '기술', value: allDefenseTechnologies.length },
              { label: '밸류체인', value: defenseValueChainStages.length },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-background/70 px-4 py-3 text-center">
                <p className="text-xs text-textMuted">{item.label}</p>
                <p className="text-xl font-bold text-text">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-text">분야별 탐색</h3>
              <div className="flex rounded-lg border border-border bg-background p-1">
                {[{ id: 'korea', label: '국내' }, { id: 'global', label: '해외' }].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRegion(item.id)}
                    className={`rounded-md px-3 py-1.5 text-sm ${region === item.id ? 'bg-sky-500 text-white' : 'text-textMuted'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {segmentCounts.map((segment) => (
                <Link key={segment.id} to={`/defense/${region}/${segment.id}`}>
                  <div className={`rounded-xl border p-4 transition-colors hover:border-sky-400/70 ${segment.classes}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{segment.label}</span>
                      <span className="rounded-full bg-background/60 px-2 py-0.5 text-xs">{segment.count}개</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-text">
              <Factory size={18} className="text-sky-300" />
              주요 기업
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {regionCompanies.slice(0, 8).map((company) => (
                <Link key={company.id} to={`/defense/${company.region}/${company.segments[0]}/${company.id}`}>
                  <div className="flex h-full gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-sky-400/60">
                    <DefenseLogo item={company} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-text">{company.nameKo}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-textMuted">{company.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {company.segments.slice(0, 2).map((segment) => (
                          <span key={segment} className={`rounded border px-1.5 py-0.5 text-[10px] ${getDefenseSegmentClasses(segment)}`}>
                            {getDefenseSegmentLabel(segment)}
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

        <Card className="max-h-[720px] overflow-hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-text">
                <Newspaper size={18} className="text-sky-300" />
                방산 최신 뉴스
              </h3>
              {lastUpdated && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-textMuted">
                  <TimerReset size={13} />
                  {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 갱신
                </p>
              )}
            </div>
            <button onClick={loadNews} className="text-textMuted hover:text-sky-300">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          {news.some((item) => item.isFallback) && (
            <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              외부 뉴스 연결 실패로 샘플 데이터를 표시 중입니다.
            </div>
          )}
          <div className="space-y-3 overflow-y-auto pr-1">
            {news.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-background p-4">
                <a href={item.url || '#'} target={item.url ? '_blank' : undefined} rel="noopener noreferrer">
                  <h4 className="line-clamp-2 text-sm font-bold text-text hover:text-sky-300">{item.title}</h4>
                </a>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-textMuted">
                  <Activity size={12} />
                  <span>{item.source}</span>
                  {item.publishedAt && <span>{item.publishedAt}</span>}
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
