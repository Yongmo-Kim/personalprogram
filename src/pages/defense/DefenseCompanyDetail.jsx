import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Globe2, RefreshCw } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { DefenseLogo } from '../../components/defense/DefenseLogo';
import { defenseCompanies } from '../../data/defenseCompanies';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { fetchDefenseCompanyNews } from '../../services/newsService';
import { getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseCompanyDetail = () => {
  const { companyId } = useParams();
  const company = defenseCompanies.find((item) => item.id === companyId);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNews = useCallback(async () => {
    if (!company) return;
    setLoading(true);
    setNews(await fetchDefenseCompanyNews(company));
    setLoading(false);
  }, [company]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  if (!company) return <div className="py-20 text-center text-textMuted">기업을 찾을 수 없습니다.</div>;

  const techs = company.coreTechnologies
    .map((techId) => allDefenseTechnologies.find((tech) => tech.id === techId))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <DefenseLogo item={company} size="lg" />
            <div>
              <h2 className="text-3xl font-bold text-text">{company.nameKo}</h2>
              <p className="mt-1 text-textMuted">{company.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {company.segments.map((segment) => (
                  <span key={segment} className={`rounded border px-2 py-1 text-xs ${getDefenseSegmentClasses(segment)}`}>
                    {getDefenseSegmentLabel(segment)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 px-3 py-2 text-sm text-sky-300">
              공식 웹사이트 <ExternalLink size={14} />
            </a>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 text-lg font-bold text-text">기업 설명</h3>
            <p className="leading-relaxed text-textMuted">{company.description}</p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-bold text-text">핵심 기술/무기체계</h3>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => (
                <Link key={tech.id} to={`/defense/technology/${tech.id}`} className={`rounded-lg border px-2.5 py-1.5 text-xs ${getDefenseSegmentClasses(tech.category)}`}>
                  {tech.nameKo || tech.name}
                </Link>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-bold text-text">주요 제품</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {company.products.map((product) => (
                <div key={product} className="rounded-lg border border-border bg-background p-3 text-sm text-textMuted">{product}</div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 text-lg font-bold text-text">고객/경쟁사</h3>
            <p className="mb-2 text-xs font-bold text-textMuted">주요 고객</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {company.customers.map((item) => <span key={item} className="rounded border border-border bg-background px-2 py-1 text-xs text-textMuted">{item}</span>)}
            </div>
            <p className="mb-2 text-xs font-bold text-textMuted">경쟁사</p>
            <div className="flex flex-wrap gap-2">
              {company.competitors.map((item) => <span key={item} className="rounded border border-border bg-background px-2 py-1 text-xs text-textMuted">{item}</span>)}
            </div>
          </Card>

          <Card className="max-h-[520px] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-text">
                <Globe2 size={18} className="text-sky-300" />
                관련 뉴스
              </h3>
              <button onClick={loadNews} className="text-textMuted hover:text-sky-300">
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            {news.some((item) => item.isFallback) && <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">샘플 뉴스 표시 중입니다.</div>}
            <div className="space-y-3">
              {news.map((item) => (
                <a key={item.id} href={item.url || '#'} target={item.url ? '_blank' : undefined} rel="noopener noreferrer" className="block rounded-xl border border-border bg-background p-3">
                  <h4 className="line-clamp-2 text-sm font-bold text-text hover:text-sky-300">{item.title}</h4>
                  <p className="mt-2 text-[11px] text-textMuted">{item.source} {item.publishedAt && `· ${item.publishedAt}`}</p>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
