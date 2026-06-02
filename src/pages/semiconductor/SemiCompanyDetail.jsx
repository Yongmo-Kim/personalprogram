import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Activity, AlertCircle, Building2, ExternalLink, GitBranch, Globe2, Network, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { CompanyLogo } from '../../components/semiconductor/CompanyLogo';
import { fetchCompanyNews } from '../../services/newsService';
import { companies } from '../../data/semiconductorCompanies';
import { technologies } from '../../data/semiconductorTechnologies';
import { getCompanyIntelligence, getNewsImpactTags, getTechnologyProcessLinks } from '../../data/semiconductorIntelligence';
import { loadData, saveData } from '../../utils/storage';
import { getAccentClasses, getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

const NOTES_KEY = 'semiconductorCompanyNotes';
const REFRESH_INTERVAL = 5 * 60 * 1000;

const findCompetitor = (name) =>
  companies.find(
    (company) =>
      company.name?.toLowerCase() === name.toLowerCase() ||
      company.nameKo?.toLowerCase() === name.toLowerCase()
  );

export const SemiCompanyDetail = () => {
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [note, setNote] = useState(() => loadData(NOTES_KEY, {})[companyId] || '');
  const intervalRef = useRef(null);

  const company = companies.find((item) => item.id === companyId);
  const accent = getAccentClasses(company);

  const loadNews = useCallback(async () => {
    if (!company) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchCompanyNews(company);
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || '회사 뉴스를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [company]);

  useEffect(() => {
    if (activeTab === 'news' && news.length === 0) {
      loadNews();
    }
  }, [activeTab, loadNews, news.length]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    intervalRef.current = setInterval(loadNews, REFRESH_INTERVAL);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [autoRefresh, loadNews]);

  if (!company) {
    return <div className="py-20 text-center text-textMuted">회사를 찾을 수 없습니다.</div>;
  }

  const companyTechs = (company.coreTechnologies || [])
    .map((techId) => technologies.find((technology) => technology.id === techId))
    .filter(Boolean);
  const intelligence = getCompanyIntelligence(company, companyTechs);

  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'tech', label: '핵심 기술' },
    { id: 'products', label: '제품/사업' },
    { id: 'competitors', label: '경쟁사' },
    { id: 'news', label: '관련 뉴스' },
    { id: 'notes', label: '개인 메모' },
  ];

  const handleSaveNote = () => {
    const notes = loadData(NOTES_KEY, {});
    saveData(NOTES_KEY, { ...notes, [company.id]: note });
  };

  return (
    <div className="space-y-6">
      <section className={`rounded-xl border p-5 ${accent.hero}`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <CompanyLogo company={company} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-text">{company.nameKo || company.name}</h1>
                <span className="rounded bg-background/70 px-2 py-1 text-xs font-bold text-textMuted">{company.logoText}</span>
              </div>
              <p className="mt-1 text-textMuted">{company.name}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-text">
                  <Globe2 size={16} className="text-textMuted" />
                  {company.country}
                </span>
                <span className="flex items-center gap-1.5 text-text">
                  <Building2 size={16} className="text-textMuted" />
                  {company.region === 'korea' ? '국내' : '해외'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {company.segments.map((segment) => (
                  <span key={segment} className={`rounded border px-2 py-1 text-xs ${getSegmentClasses(segment)}`}>
                    {getSegmentLabel(segment)}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.tags?.slice(0, 6).map((tag) => (
                  <span key={tag} className="rounded border border-border bg-background/60 px-2 py-1 text-xs text-textMuted">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                공식 웹사이트 <ExternalLink size={16} />
              </div>
            </a>
          )}
        </div>
      </section>

      <nav className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-surface text-primary' : 'text-textMuted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <Card>
              <h3 className="mb-3 text-lg font-bold">회사 소개</h3>
              <p className="leading-relaxed text-textMuted">{company.description}</p>
            </Card>
            <div className="space-y-4">
              <Card>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-textMuted">주요 고객군</h3>
                <ul className="space-y-2">
                  {company.customers?.map((customer) => (
                    <li key={customer} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {customer}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <div className="mb-3 flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <h3 className="font-bold text-text">경쟁력 판단</h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-textMuted">{intelligence.position}</p>
              <div className="flex flex-wrap gap-2">
                {intelligence.moat.map((item) => (
                  <span key={item} className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
                    {item}
                  </span>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-2 text-secondary">
                <Activity size={18} />
                <h3 className="font-bold text-text">계속 봐야 할 신호</h3>
              </div>
              <ul className="space-y-2">
                {intelligence.watch.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-textMuted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-2 text-amber-300">
                <AlertCircle size={18} />
                <h3 className="font-bold text-text">리스크 체크</h3>
              </div>
              <ul className="space-y-2">
                {intelligence.risks.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-textMuted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <div className="mb-3 flex items-center gap-2 text-primary">
                <GitBranch size={18} />
                <h3 className="font-bold text-text">공정-기술 연결</h3>
              </div>
              {intelligence.processLinks.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {intelligence.processLinks.map((link) => (
                    <div key={link.id} className="rounded-xl border border-border bg-background p-3">
                      <p className="text-xs font-medium text-textMuted">{link.stage}</p>
                      <p className="mt-1 font-bold text-text">{link.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-textMuted">연결된 공정 데이터가 아직 없습니다.</p>
              )}
            </Card>

            <Card>
              <h3 className="mb-3 font-bold text-text">데이터 상태</h3>
              <div className="grid gap-2">
                {intelligence.dataProfile.map((item) => (
                  <div key={item.label} className={`rounded-lg border px-3 py-2 text-xs ${item.tone}`}>
                    <span className="font-bold">{item.label}</span>
                    <span className="ml-2 text-textMuted">{item.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tech' && (
        <div className="grid gap-4 md:grid-cols-2">
          {companyTechs.map((tech) => (
            <Link key={tech.id} to={`/semiconductor/technology/${tech.id}`}>
              <Card className="h-full rounded-xl transition-colors hover:border-primary/50">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-text">{tech.nameKo || tech.name}</h3>
                    <p className="text-sm font-medium text-textMuted">{tech.name}</p>
                  </div>
                  <span className={`rounded border px-2 py-1 text-xs ${getSegmentClasses(tech.category)}`}>
                    {getSegmentLabel(tech.category)}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-textMuted">{tech.shortDescription}</p>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-textMuted">{tech.whyImportant}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {getTechnologyProcessLinks(tech).slice(0, 3).map((link) => (
                    <span key={link.id} className="rounded border border-border bg-background px-2 py-1 text-[10px] text-textMuted">
                      {link.stage} · {link.label}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <Card>
          <h3 className="mb-4 text-lg font-bold">주요 제품 및 사업</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {company.products?.map((product) => (
              <div key={product} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                <Network className="text-primary opacity-80" size={20} />
                <span className="text-sm font-medium">{product}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'competitors' && (
        <div className="grid gap-3 md:grid-cols-2">
          {company.competitors?.map((competitor) => {
            const linkedCompany = findCompetitor(competitor);
            const content = (
              <Card className="flex items-center justify-between rounded-xl transition-colors hover:border-primary/50">
                <div>
                  <p className="font-bold text-text">{competitor}</p>
                  <p className="mt-1 text-xs text-textMuted">
                    {linkedCompany ? '앱에 등록된 경쟁사입니다.' : '외부 경쟁사'}
                  </p>
                </div>
                {linkedCompany && <CompanyLogo company={linkedCompany} size="sm" />}
              </Card>
            );

            return linkedCompany ? (
              <Link key={competitor} to={`/semiconductor/${linkedCompany.region}/${linkedCompany.segments[0]}/${linkedCompany.id}`}>
                {content}
              </Link>
            ) : (
              <div key={competitor}>{content}</div>
            );
          })}
        </div>
      )}

      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-textMuted">회사 키워드 기반 Google News RSS 검색 결과입니다.</p>
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
              <button onClick={loadNews} className="text-textMuted transition-colors hover:text-primary">
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
            <div className="py-20 text-center text-textMuted">뉴스를 불러오는 중...</div>
          ) : news.length > 0 ? (
            <div className="grid gap-4">
              {news.map((item) => (
                <Card key={item.id}>
                  <h3 className="mb-2 text-lg font-bold text-text">{item.title}</h3>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-textMuted">
                    <span>{item.source}</span>
                    {item.publishedAt && <span>·</span>}
                    {item.publishedAt && <span>{item.publishedAt}</span>}
                    <span className={`rounded border px-1.5 py-0.5 ${getSegmentClasses(company.segments[0])}`}>
                      {getSegmentLabel(company.segments[0])}
                    </span>
                    {getNewsImpactTags(item, company.newsKeywords || []).map((tag) => (
                      <span key={tag} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                      원문 보기 <ExternalLink size={14} />
                    </a>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center py-12 text-center text-textMuted">
              <AlertCircle size={32} className="mb-3 opacity-50" />
              <p>관련 뉴스를 찾을 수 없습니다.</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">개인 메모</h3>
            <Button onClick={handleSaveNote} className="inline-flex items-center gap-2">
              <Save size={16} />
              저장
            </Button>
          </div>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={`${company.nameKo || company.name}에 대해 기억할 점을 적어두세요.`}
            className="min-h-48 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-text outline-none transition-colors focus:border-primary"
          />
        </Card>
      )}
    </div>
  );
};
