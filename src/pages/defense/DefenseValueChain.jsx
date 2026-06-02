import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Search } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { DefenseLogo } from '../../components/defense/DefenseLogo';
import { defenseCompanies } from '../../data/defenseCompanies';
import { allDefenseTechnologies } from '../../data/defenseTechnologies';
import { defenseValueChainStages } from '../../data/defenseInsightMaps';
import { getDefenseSegmentClasses } from '../../utils/defenseStyles';

export const DefenseValueChain = () => {
  const [selectedId, setSelectedId] = useState(defenseValueChainStages[0].id);
  const selected = defenseValueChainStages.find((stage) => stage.id === selectedId) || defenseValueChainStages[0];
  const stageCompanies = useMemo(() => selected.companyIds.map((id) => defenseCompanies.find((company) => company.id === id)).filter(Boolean), [selected]);
  const stageTechs = useMemo(() => selected.techIds.map((id) => allDefenseTechnologies.find((tech) => tech.id === id)).filter(Boolean), [selected]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-5">
        <div className="flex items-center gap-2 text-violet-300">
          <GitBranch size={22} />
          <span className="text-sm font-semibold">Defense Value Chain</span>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-text">방위산업 밸류체인</h2>
        <p className="mt-2 max-w-3xl text-sm text-textMuted">소요, 센서, 플랫폼, 무장, 네트워크, 체계종합, MRO까지 방산 산업의 흐름을 연결합니다.</p>
      </section>

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {defenseValueChainStages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setSelectedId(stage.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${selectedId === stage.id ? 'border-violet-400 bg-violet-500/15' : 'border-border bg-background hover:border-violet-400/60'}`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-sm font-bold text-violet-300">{index + 1}</span>
              <h3 className="mt-3 font-bold text-text">{stage.label}</h3>
              <p className="mt-2 line-clamp-2 text-xs text-textMuted">{stage.headline}</p>
            </button>
          ))}
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <h3 className="text-2xl font-bold text-text">{selected.label}</h3>
          <p className="mt-2 text-sm font-medium text-violet-200">{selected.headline}</p>
          <p className="mt-4 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-textMuted">{selected.description}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-text"><Search size={16} className="text-violet-300" />봐야 할 포인트</h4>
              <ul className="space-y-2">{selected.watchPoints.map((point) => <li key={point} className="text-sm text-textMuted">· {point}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h4 className="mb-3 font-bold text-text">핵심 기술</h4>
              <div className="flex flex-wrap gap-2">
                {stageTechs.map((tech) => (
                  <Link key={tech.id} to={`/defense/technology/${tech.id}`} className={`rounded border px-2 py-1 text-xs ${getDefenseSegmentClasses(tech.category)}`}>
                    {tech.nameKo || tech.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold text-text">대표 기업</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {stageCompanies.map((company) => (
              <Link key={company.id} to={`/defense/${company.region}/${company.segments[0]}/${company.id}`}>
                <div className="flex gap-3 rounded-xl border border-border bg-background p-3 hover:border-violet-400/60">
                  <DefenseLogo item={company} size="sm" />
                  <div>
                    <p className="font-bold text-text">{company.nameKo}</p>
                    <p className="text-xs text-textMuted">{company.name}</p>
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
