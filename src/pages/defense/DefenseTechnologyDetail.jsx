import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Crosshair, RefreshCw } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { DefenseLogo } from '../../components/defense/DefenseLogo';
import { defenseCompanies } from '../../data/defenseCompanies';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { fetchDefenseTechnologyNews } from '../../services/newsService';
import { getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseTechnologyDetail = () => {
  const { techId } = useParams();
  const tech = allDefenseTechnologies.find((item) => item.id === techId);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const relatedCompanies = useMemo(
    () => (tech?.relatedCompanies || []).map((id) => defenseCompanies.find((company) => company.id === id)).filter(Boolean),
    [tech]
  );

  const loadNews = useCallback(async () => {
    if (!tech) return;
    setLoading(true);
    setNews(await fetchDefenseTechnologyNews(tech));
    setLoading(false);
  }, [tech]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  if (!tech) return <div className="py-20 text-center text-textMuted">기술을 찾을 수 없습니다.</div>;

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-rose-400">
        <div className="mb-4 flex items-center gap-3">
          <Crosshair className="h-8 w-8 text-rose-300" />
          <div>
            <h2 className="text-3xl font-bold text-text">{tech.nameKo || tech.name}</h2>
            <p className="mt-1 text-textMuted">{tech.name}</p>
          </div>
          <span className={`rounded border px-2 py-1 text-xs ${getDefenseSegmentClasses(tech.category)}`}>
            {getDefenseSegmentLabel(tech.category)}
          </span>
        </div>
        <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-textMuted">{tech.description}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 font-bold text-text">어떻게 작동하나</h3>
            <ol className="space-y-2">
              {tech.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-textMuted">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-300">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 font-bold text-text">공부 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {tech.keywords.map((keyword) => <span key={keyword} className="rounded border border-border bg-surface px-2 py-1 text-xs text-textMuted">#{keyword}</span>)}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <h3 className="mb-4 text-lg font-bold text-text">관련 기업</h3>
          <div className="space-y-3">
            {relatedCompanies.map((company) => (
              <Link key={company.id} to={`/defense/${company.region}/${company.segments[0]}/${company.id}`}>
                <div className="flex gap-3 rounded-xl border border-border bg-background p-3 hover:border-rose-400/60">
                  <DefenseLogo item={company} size="sm" />
                  <div>
                    <p className="font-bold text-text">{company.nameKo}</p>
                    <p className="text-xs text-textMuted">{company.name}</p>
                  </div>
                </div>
              </Link>
            ))}
            {!relatedCompanies.length && <p className="text-sm text-textMuted">관련 기업은 추후 보강 예정입니다.</p>}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text">관련 최신 뉴스</h3>
            <button onClick={loadNews} className="text-textMuted hover:text-rose-300"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button>
          </div>
          <div className="grid gap-3">
            {news.map((item) => (
              <a key={item.id} href={item.url || '#'} target={item.url ? '_blank' : undefined} rel="noopener noreferrer" className="rounded-xl border border-border bg-background p-3">
                <h4 className="text-sm font-bold text-text hover:text-rose-300">{item.title}</h4>
                <p className="mt-2 text-[11px] text-textMuted">{item.source} {item.publishedAt && `· ${item.publishedAt}`}</p>
              </a>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
