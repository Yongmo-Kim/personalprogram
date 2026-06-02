import { Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { DEFENSE_SEGMENTS, getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseTechnologyList = () => (
  <div className="space-y-6">
    <section className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-5">
      <h2 className="text-3xl font-bold text-text">방산 기술/무기체계 백과</h2>
      <p className="mt-2 max-w-3xl text-sm text-textMuted">센서, 미사일, 항공, 해양, 지상, C4ISR, 사이버/우주 기술을 산업 분석 관점으로 정리합니다.</p>
    </section>
    {DEFENSE_SEGMENTS.map((segment) => {
      const techs = allDefenseTechnologies.filter((tech) => tech.category === segment.id);
      if (!techs.length) return null;
      return (
        <Card key={segment.id}>
          <h3 className="mb-4 text-lg font-bold text-text">{segment.label}</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {techs.map((tech) => (
              <Link key={tech.id} to={`/defense/technology/${tech.id}`}>
                <div className="h-full rounded-xl border border-border bg-background p-4 transition-colors hover:border-rose-400/60">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="font-bold text-text">{tech.nameKo || tech.name}</h4>
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getDefenseSegmentClasses(tech.category)}`}>
                      {getDefenseSegmentLabel(tech.category)}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-textMuted">{tech.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      );
    })}
  </div>
);
