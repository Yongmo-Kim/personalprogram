import { Link } from 'react-router-dom';
import { GitBranch, Milestone, Route } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { technologies } from '../../data/semiconductorTechnologies';
import { technologyRoadmaps } from '../../data/semiconductorInsightMaps';
import { getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

const colorClasses = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200',
};

export const SemiTechnologyRoadmap = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-5">
        <div className="flex items-center gap-3 text-violet-300">
          <Route size={22} />
          <span className="text-sm font-semibold">Technology Roadmap</span>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-text">반도체 기술 로드맵</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
          기술 키워드를 시간축과 진화 방향으로 묶었습니다. 개별 기술 페이지로 이동해 작동 방식과 관련 기업을 이어서 볼 수 있습니다.
        </p>
      </section>

      <div className="space-y-5">
        {technologyRoadmaps.map((roadmap) => (
          <Card key={roadmap.id}>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch size={18} className="text-primary" />
                  <h3 className="text-xl font-bold text-text">{roadmap.title}</h3>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">{roadmap.summary}</p>
              </div>
              <span className={`w-fit rounded-lg border px-3 py-1.5 text-xs font-semibold ${colorClasses[roadmap.color] || colorClasses.blue}`}>
                {roadmap.steps.length} steps
              </span>
            </div>

            <div className="grid gap-3 xl:grid-cols-5">
              {roadmap.steps.map((step, index) => {
                const tech = technologies.find((item) => item.id === step.techId);
                return (
                  <Link key={`${roadmap.id}-${step.label}-${index}`} to={`/semiconductor/technology/${step.techId}`}>
                    <div className="relative h-full rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/60">
                      <div className="flex items-center justify-between gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-surface text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                        {tech && (
                          <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(tech.category)}`}>
                            {getSegmentLabel(tech.category)}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-4 font-bold text-text">{step.label}</h4>
                      <p className="mt-1 text-xs font-medium text-primary">{step.stage}</p>
                      <p className="mt-3 text-xs leading-relaxed text-textMuted">{step.note}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex gap-3">
          <Milestone className="mt-1 shrink-0 text-secondary" size={20} />
          <div>
            <h3 className="font-bold text-text">읽는 방법</h3>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">
              로드맵은 정확한 연도 예측표가 아니라 기술이 어떤 방향으로 이어지는지 보여주는 학습 지도입니다.
              실제 양산 시점은 기업별 수율, 고객사 채택, 장비 확보, 공급망 상황에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
