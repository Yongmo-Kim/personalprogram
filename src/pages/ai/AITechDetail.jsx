import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Building2, Activity, RefreshCw } from 'lucide-react';
import { technologies } from '../../data/aiTechnologies';
import { companies } from '../../data/aiCompanies';
import { getSegmentClasses, getSegmentLabel } from '../../utils/aiStyles';
import { Card } from '../../components/UI/Card';
import { fetchAiTechnologyNews } from '../../services/aiNewsService';

export const AITechDetail = () => {
  const { id } = useParams();
  const tech = technologies.find((t) => t.id === id);

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    if (!tech) return;
    
    let isMounted = true;
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const data = await fetchAiTechnologyNews(tech);
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
  }, [tech]);

  if (!tech) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-text">기술을 찾을 수 없습니다.</h2>
        <Link to="/ai/process" className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-1" /> 돌아가기
        </Link>
      </div>
    );
  }

  const relatedComps = tech.relatedCompanies?.map(cId => companies.find(c => c.id === cId)).filter(Boolean) || [];

  return (
    <div className="space-y-6 pb-20">
      <Link to="/ai" className="inline-flex items-center text-sm text-textMuted hover:text-text">
        <ArrowLeft size={16} className="mr-1" /> 대시보드로 돌아가기
      </Link>

      <section className="rounded-xl border border-border bg-surface p-6 lg:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          <BookOpen size={16} /> AI 핵심 기술
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-text mb-2">{tech.nameKo || tech.name}</h1>
        <p className="text-xl text-textMuted mb-6">{tech.name}</p>
        <p className="text-lg leading-relaxed text-text max-w-4xl">{tech.description}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-xl font-bold text-text mb-4">
            <Lightbulb className="text-amber-500" size={24} />
            왜 중요한가요?
          </h3>
          <p className="text-base leading-relaxed text-textMuted">{tech.whyImportant}</p>
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 text-xl font-bold text-text mb-4">
            <Building2 className="text-primary" size={24} />
            관련 핵심 기업
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedComps.map((company) => (
              <Link key={company.id} to={`/ai/company/${company.id}`} className="block rounded-lg border border-border bg-background p-3 hover:border-primary/50 transition-colors">
                <p className="font-bold text-text mb-1">{company.nameKo || company.name}</p>
                <div className="flex flex-wrap gap-1">
                  {company.segments.slice(0, 2).map((seg) => (
                    <span key={seg} className={`rounded px-1.5 py-0.5 text-[10px] ${getSegmentClasses(seg)}`}>
                      {getSegmentLabel(seg)}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Card>
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
