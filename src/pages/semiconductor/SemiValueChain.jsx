import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Network, Search, Sparkles } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { CompanyLogo } from '../../components/semiconductor/CompanyLogo';
import { companies } from '../../data/semiconductorCompanies';
import { technologies } from '../../data/semiconductorTechnologies';
import { valueChainStages } from '../../data/semiconductorInsightMaps';
import { getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

const findCompanies = (ids) => ids.map((id) => companies.find((company) => company.id === id)).filter(Boolean);
const findTechs = (ids) => ids.map((id) => technologies.find((technology) => technology.id === id)).filter(Boolean);

export const SemiValueChain = () => {
  const [selectedStageId, setSelectedStageId] = useState(valueChainStages[0].id);
  const selectedStage = valueChainStages.find((stage) => stage.id === selectedStageId) || valueChainStages[0];
  const selectedCompanies = useMemo(() => findCompanies(selectedStage.companyIds), [selectedStage]);
  const selectedTechs = useMemo(() => findTechs(selectedStage.techIds), [selectedStage]);

  const totals = {
    stages: valueChainStages.length,
    companies: new Set(valueChainStages.flatMap((stage) => stage.companyIds)).size,
    technologies: new Set(valueChainStages.flatMap((stage) => stage.techIds)).size,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-300">
              <Network size={22} />
              <span className="text-sm font-semibold">Semiconductor Value Chain</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">반도체 밸류체인 지도</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              소재에서 장비, 설계, 제조, 메모리, 패키징, 최종 수요까지 이어지는 산업 구조를 한눈에 보는 지도입니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">단계</p>
              <p className="text-xl font-bold text-text">{totals.stages}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">기업</p>
              <p className="text-xl font-bold text-text">{totals.companies}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">기술</p>
              <p className="text-xl font-bold text-text">{totals.technologies}</p>
            </div>
          </div>
        </div>
      </section>

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {valueChainStages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`min-h-32 rounded-xl border p-4 text-left transition-colors ${
                selectedStageId === stage.id
                  ? 'border-blue-400 bg-blue-500/15'
                  : 'border-border bg-background hover:border-blue-400/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-sm font-bold text-blue-300">
                  {index + 1}
                </span>
                {index < valueChainStages.length - 1 && <ArrowRight size={16} className="text-textMuted" />}
              </div>
              <h3 className="mt-3 font-bold text-text">{stage.label}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-textMuted">{stage.headline}</p>
            </button>
          ))}
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/15 p-3 text-blue-300">
              <Factory size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text">{selectedStage.label}</h3>
              <p className="mt-1 text-sm font-medium text-blue-200">{selectedStage.headline}</p>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">{selectedStage.description}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Search size={17} />
                <h4 className="font-bold text-text">봐야 할 포인트</h4>
              </div>
              <ul className="space-y-2">
                {selectedStage.watchPoints.map((point) => (
                  <li key={point} className="text-sm leading-relaxed text-textMuted">· {point}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-secondary">
                <Sparkles size={17} />
                <h4 className="font-bold text-text">핵심 기술</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTechs.map((tech) => (
                  <Link
                    key={tech.id}
                    to={`/semiconductor/technology/${tech.id}`}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors hover:border-primary ${getSegmentClasses(tech.category)}`}
                  >
                    {tech.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold text-text">대표 기업</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedCompanies.map((company) => (
              <Link key={company.id} to={`/semiconductor/${company.region}/${company.segments[0]}/${company.id}`}>
                <div className="flex h-full gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/60">
                  <CompanyLogo company={company} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-text">{company.nameKo || company.name}</p>
                    <p className="mt-0.5 text-xs text-textMuted">{company.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {company.segments.slice(0, 2).map((segment) => (
                        <span key={segment} className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(segment)}`}>
                          {getSegmentLabel(segment)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
