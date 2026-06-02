import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { fetchTechnologyNews } from '../../services/newsService';
import { technologies } from '../../data/semiconductorTechnologies';
import { getTechnologyKnowledge } from '../../data/technologyKnowledge';
import { getNewsImpactTags, getSegmentPlaybook, getTechnologyProcessLinks } from '../../data/semiconductorIntelligence';
import { companies } from '../../data/semiconductorCompanies';
import { BookOpen, ExternalLink, Gauge, GitBranch, Layers, Lightbulb, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { CompanyLogo } from '../../components/semiconductor/CompanyLogo';
import { TechnologyVisual } from '../../components/semiconductor/TechnologyVisual';
import { getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

const REFRESH_INTERVAL = 5 * 60 * 1000;

export const SemiTechDetail = () => {
  const { techId } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const tech = technologies.find(t => t.id === techId);

  const loadNews = useCallback(async () => {
    if (!tech) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchTechnologyNews(tech);
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || '기술 뉴스를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [tech]);

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

  if (!tech) {
    return <div className="text-center py-20">기술을 찾을 수 없습니다.</div>;
  }

  const relatedComps = (tech.relatedCompanies || []).map(cId => 
    companies.find(c => c.id === cId)
  ).filter(Boolean);
  const knowledge = getTechnologyKnowledge(tech);
  const processLinks = getTechnologyProcessLinks(tech);
  const segmentIntel = getSegmentPlaybook(tech.category);

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-secondary">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="text-secondary w-8 h-8" />
          <h1 className="text-3xl font-bold text-text">{tech.name}</h1>
          <span className={`rounded border px-2 py-1 text-xs font-bold ${getSegmentClasses(tech.category)}`}>
            {getSegmentLabel(tech.category)}
          </span>
        </div>
        <p className="text-lg font-medium text-textMuted mb-4">{tech.nameKo}</p>

        <div className="mb-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <TechnologyVisual type={knowledge.visualType} />
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-2 flex items-center gap-2 text-secondary">
                <Lightbulb size={17} />
                <h3 className="font-bold text-text">핵심 개념</h3>
              </div>
              <p className="text-sm leading-relaxed text-textMuted">{knowledge.coreIdea}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <BookOpen size={17} />
                <h3 className="font-bold text-text">쉽게 비유하면</h3>
              </div>
              <p className="text-sm leading-relaxed text-textMuted">{knowledge.analogy}</p>
            </div>
          </div>
        </div>

        <p className="text-text leading-relaxed bg-surface p-4 rounded-xl border border-border mb-4">
          {tech.description}
        </p>

        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <GitBranch size={17} />
              <h3 className="font-bold text-text">가치사슬 연결</h3>
            </div>
            {processLinks.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {processLinks.slice(0, 6).map((link) => (
                  <div key={link.id} className="rounded-lg border border-border bg-surface px-3 py-2">
                    <p className="text-[11px] font-medium text-textMuted">{link.stage}</p>
                    <p className="mt-1 text-sm font-bold text-text">{link.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-textMuted">연결된 공정 데이터가 아직 없습니다.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-2 font-bold text-text">산업군에서 보는 의미</h3>
            <p className="text-sm leading-relaxed text-textMuted">{segmentIntel.position}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {segmentIntel.watch.slice(0, 4).map((item) => (
                <span key={item} className="rounded-lg border border-secondary/30 bg-secondary/10 px-2.5 py-1.5 text-xs font-medium text-secondary">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-secondary">
              <Layers size={17} />
              <h3 className="font-bold text-text">어떻게 작동하나</h3>
            </div>
            <ol className="space-y-2">
              {knowledge.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-textMuted">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary/15 text-xs font-bold text-secondary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Gauge size={17} />
              <h3 className="font-bold text-text">볼 때 중요한 지표</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {knowledge.keyMetrics.map((metric) => (
                <span key={metric} className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
                  {metric}
                </span>
              ))}
            </div>

            <h4 className="mb-2 mt-5 text-sm font-bold text-text">주로 쓰이는 곳</h4>
            <div className="flex flex-wrap gap-2">
              {knowledge.whereUsed.map((item) => (
                <span key={item} className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-textMuted">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">왜 중요한가요?</h3>
          <p className="text-textMuted text-sm leading-relaxed">{tech.whyImportant}</p>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 font-bold text-text">오해하기 쉬운 점</h3>
            <ul className="space-y-2">
              {knowledge.commonMisunderstandings.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-textMuted">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 font-bold text-text">공부 순서</h3>
            <ol className="space-y-2">
              {knowledge.learningOrder.map((item, index) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-textMuted">
                  <span className="text-secondary">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {tech.keywords?.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">공부할 키워드</h3>
            <div className="flex flex-wrap gap-1.5">
              {tech.keywords.map((keyword) => (
                <span key={keyword} className="rounded border border-border bg-background px-2 py-1 text-xs text-textMuted">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-lg">최신 기술 동향</h3>
              {lastUpdated && (
                <p className="mt-1 text-xs text-textMuted">
                  마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-textMuted">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(event) => setAutoRefresh(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                5분 자동 갱신
              </label>
              <button onClick={loadNews} className="text-textMuted hover:text-primary transition-colors">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
          )}
          {news.some((item) => item.isFallback) && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              외부 뉴스 연결 실패로 샘플 데이터를 표시 중입니다.
            </div>
          )}
          
          {loading && news.length === 0 ? (
            <div className="text-center py-10 text-textMuted">뉴스를 불러오는 중...</div>
          ) : news.length > 0 ? (
            <div className="grid gap-3">
              {news.map(item => (
                <Card key={item.id} className="p-4">
                  <h4 className="font-bold text-text mb-2 text-sm">{item.title}</h4>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {getNewsImpactTags(item, tech.keywords || []).map((tag) => (
                      <span key={tag} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-[11px] text-textMuted">
                      {item.source} {item.publishedAt && `· ${item.publishedAt}`}
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 text-textMuted flex flex-col items-center">
              <AlertCircle size={32} className="opacity-50 mb-3" />
              <p>관련 뉴스를 찾을 수 없습니다.</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-4">관련 기업</h3>
            <div className="space-y-3">
              {relatedComps.map(c => (
                <Link key={c.id} to={`/semiconductor/${c.region}/${c.segments[0]}/${c.id}`} className="block">
                  <div className="p-3 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CompanyLogo company={c} size="sm" />
                      <div>
                        <div className="font-bold text-sm text-text">{c.nameKo || c.name}</div>
                        <div className="text-xs text-textMuted mt-1">{c.name}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {relatedComps.length === 0 && <p className="text-sm text-textMuted">관련 기업 정보가 없습니다.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
