import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Cpu, Target, ShieldAlert, Zap, Activity, RefreshCw } from 'lucide-react';
import { companies } from '../../data/aiCompanies';
import { technologies } from '../../data/aiTechnologies';
import { getSegmentClasses, getSegmentLabel, getAccentClasses } from '../../utils/aiStyles';
import { Card } from '../../components/UI/Card';
import { fetchAiCompanyNews } from '../../services/aiNewsService';

export const AICompanyDetail = () => {
  const { id } = useParams();
  const company = companies.find((c) => c.id === id);

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    if (!company) return;
    
    let isMounted = true;
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const data = await fetchAiCompanyNews(company);
        if (isMounted) {
          setNews(data);
          setNewsError('');
        }
      } catch {
        if (isMounted) setNewsError('관련 뉴스를 불러오지 못했습니다.');
      } finally {
        if (isMounted) setLoadingNews(false);
      }
    };
    
    loadNews();
    return () => { isMounted = false; };
  }, [company]);

  if (!company) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-text">기업을 찾을 수 없습니다.</h2>
        <Link to="/ai/companies" className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-1" /> 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const accent = getAccentClasses(company);

  return (
    <div className="space-y-6 pb-20">
      <Link to="/ai/companies" className="inline-flex items-center text-sm text-textMuted hover:text-text">
        <ArrowLeft size={16} className="mr-1" /> 기업 목록으로 돌아가기
      </Link>

      <section className={`rounded-xl border p-6 lg:p-8 ${accent.hero}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {company.segments.map((segment) => (
                <span key={segment} className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSegmentClasses(segment)}`}>
                  {getSegmentLabel(segment)}
                </span>
              ))}
              <span className="rounded-full bg-background/50 px-2.5 py-0.5 text-xs text-textMuted border border-border">
                {company.country}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-text mb-1">{company.nameKo || company.name}</h1>
            <p className="text-lg text-textMuted mb-4">{company.name}</p>
            <p className="text-base leading-relaxed text-text max-w-3xl">{company.description}</p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                웹사이트 방문 <ExternalLink size={16} />
              </a>
            )}
            <div className={`rounded-lg border p-4 text-center ${accent.logo}`}>
              <span className="text-2xl font-black tracking-wider">{company.logoText || company.name.substring(0, 3).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text mb-4">
              <Cpu className="text-primary" size={20} />
              핵심 제품 및 서비스
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {company.products?.map((product) => (
                <li key={product} className="rounded-lg border border-border bg-surface p-3 text-sm text-text font-medium">
                  {product}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text mb-4">
              <Target className="text-primary" size={20} />
              주요 고객층
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.customers?.map((customer) => (
                <span key={customer} className="rounded-full bg-background border border-border px-3 py-1.5 text-sm text-textMuted">
                  {customer}
                </span>
              ))}
            </div>
          </Card>
          
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text mb-4">
              <Zap className="text-primary" size={20} />
              연관 핵심 기술
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {company.coreTechnologies?.map((techId) => {
                const tech = technologies.find(t => t.id === techId);
                return (
                  <Link key={techId} to={`/ai/technology/${techId}`} className="block rounded-lg border border-border bg-surface p-3 hover:border-primary/50 transition-colors">
                    <p className="font-bold text-text mb-1">{tech ? (tech.nameKo || tech.name) : techId}</p>
                    {tech && <p className="text-xs text-textMuted line-clamp-2">{tech.shortDescription}</p>}
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text mb-4">
              <ShieldAlert className="text-amber-500" size={20} />
              경쟁사
            </h3>
            <ul className="space-y-2">
              {company.competitors?.map((comp) => (
                <li key={comp} className="flex items-center gap-2 text-sm text-textMuted">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500/50" />
                  {comp}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-text mb-4">태그</h3>
            <div className="flex flex-wrap gap-1.5">
              {company.tags?.map((tag) => (
                <span key={tag} className="rounded bg-background px-2 py-1 text-xs text-textMuted border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 flex min-h-[300px] flex-col max-h-[500px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-text">
            <Activity size={18} className="text-fuchsia-400" />
            최신 관련 뉴스
          </h3>
          {news.some((item) => item.isFallback) && (
            <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-300">샘플 데이터</span>
          )}
        </div>

        {newsError && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {newsError}
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {loadingNews && news.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-textMuted gap-2">
              <RefreshCw className="animate-spin" size={16} /> 뉴스를 불러오는 중...
            </div>
          ) : news.length === 0 ? (
            <div className="grid h-40 place-items-center text-sm text-textMuted">
              검색된 관련 뉴스가 없습니다.
            </div>
          ) : (
            news.map((item) => (
              <article key={item.id} className="border-b border-border/60 pb-3 last:border-0 hover:bg-surface/50 p-2 rounded-lg transition-colors">
                <a href={item.url || '#'} target={item.url ? '_blank' : undefined} rel="noopener noreferrer" className="group block">
                  <h4 className="text-sm font-semibold leading-snug text-text group-hover:text-fuchsia-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-textMuted">
                    <span className="font-medium text-textMuted/90">{item.source || 'Google News'}</span>
                    {item.publishedAt && <span>·</span>}
                    {item.publishedAt && <span>{item.publishedAt}</span>}
                  </div>
                </a>
              </article>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
