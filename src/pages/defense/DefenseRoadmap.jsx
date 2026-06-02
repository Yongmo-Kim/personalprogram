import { Link } from 'react-router-dom';
import { Route } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { defenseRoadmaps } from '../../data/defenseInsightMaps';
import { getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseRoadmap = () => (
  <div className="space-y-6">
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        <Route size={22} />
        <span className="text-sm font-semibold">Defense Roadmap</span>
      </div>
      <h2 className="mt-2 text-3xl font-bold text-text">방산 기술 로드맵</h2>
      <p className="mt-2 max-w-3xl text-sm text-textMuted">방공, 항공, 해양, 지상 전력이 어떤 기술 흐름으로 진화하는지 정리합니다.</p>
    </section>
    {defenseRoadmaps.map((roadmap) => (
      <Card key={roadmap.id}>
        <h3 className="text-xl font-bold text-text">{roadmap.title}</h3>
        <p className="mt-2 text-sm text-textMuted">{roadmap.summary}</p>
        <div className="mt-5 grid gap-3 xl:grid-cols-5">
          {roadmap.steps.map((step, index) => {
            const tech = allDefenseTechnologies.find((item) => item.id === step.techId);
            return (
              <Link key={`${roadmap.id}-${step.label}`} to={`/defense/technology/${step.techId}`}>
                <div className="h-full rounded-xl border border-border bg-background p-4 hover:border-cyan-400/60">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-surface text-sm font-bold text-cyan-300">{index + 1}</span>
                  <h4 className="mt-4 font-bold text-text">{step.label}</h4>
                  <p className="mt-1 text-xs font-medium text-cyan-300">{step.stage}</p>
                  <p className="mt-3 text-xs leading-relaxed text-textMuted">{step.note}</p>
                  {tech && <span className={`mt-3 inline-block rounded border px-1.5 py-0.5 text-[10px] ${getDefenseSegmentClasses(tech.category)}`}>{getDefenseSegmentLabel(tech.category)}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    ))}
  </div>
);
