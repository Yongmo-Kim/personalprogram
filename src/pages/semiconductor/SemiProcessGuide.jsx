import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, CircuitBoard, Factory, Microscope, PackageCheck } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { backendPhases, processPhases, waferEightProcesses } from '../../data/semiconductorProcessGuide';
import { companies } from '../../data/semiconductorCompanies';
import { technologies } from '../../data/semiconductorTechnologies';
import { getProcessIntelligence } from '../../data/semiconductorIntelligence';
import { getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

const PillList = ({ items, tone = 'primary' }) => {
  const classes = tone === 'secondary'
    ? 'border-secondary/30 bg-secondary/10 text-secondary'
    : 'border-primary/30 bg-primary/10 text-primary';
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${classes}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

const DetailBlock = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <h4 className="mb-3 font-bold text-text">{title}</h4>
    {children}
  </div>
);

const StepList = ({ items }) => (
  <ol className="space-y-2">
    {items.map((item, index) => (
      <li key={item} className="flex gap-3 text-sm leading-relaxed text-textMuted">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {index + 1}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

const ProcessIntelLinks = ({ intelligence }) => (
  <div className="mt-4 grid gap-4 lg:grid-cols-2">
    <DetailBlock title="연결 기술">
      {intelligence.techs.length > 0 ? (
        <div className="grid gap-2">
          {intelligence.techs.slice(0, 6).map((tech) => (
            <Link key={tech.id} to={`/semiconductor/technology/${tech.id}`} className="rounded-lg border border-border bg-surface px-3 py-2 transition-colors hover:border-primary/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-text">{tech.nameKo || tech.name}</span>
                <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(tech.category)}`}>
                  {getSegmentLabel(tech.category)}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-textMuted">{tech.shortDescription}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-textMuted">아직 연결된 기술 데이터가 없습니다.</p>
      )}
    </DetailBlock>

    <DetailBlock title="관련 기업">
      {intelligence.companies.length > 0 ? (
        <div className="grid gap-2">
          {intelligence.companies.slice(0, 6).map((company) => (
            <Link key={company.id} to={`/semiconductor/${company.region}/${company.segments[0]}/${company.id}`} className="rounded-lg border border-border bg-surface px-3 py-2 transition-colors hover:border-primary/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-text">{company.nameKo || company.name}</span>
                <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(company.segments[0])}`}>
                  {getSegmentLabel(company.segments[0])}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-textMuted">{company.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-textMuted">아직 직접 연결된 기업 데이터가 없습니다.</p>
      )}
    </DetailBlock>
  </div>
);

const ProcessVisual = () => (
  <svg viewBox="0 0 760 220" className="h-full w-full" role="img" aria-label="semiconductor process overview">
    <defs>
      <linearGradient id="processLine" x1="0" x2="1">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="760" height="220" rx="22" fill="#0f172a" />
    <path d="M80 110 H680" stroke="url(#processLine)" strokeWidth="8" strokeLinecap="round" />
    {[
      ['설계', 92, '#60a5fa'],
      ['RTL', 190, '#38bdf8'],
      ['검증', 288, '#22c55e'],
      ['Tape-out', 386, '#a78bfa'],
      ['8대공정', 494, '#f59e0b'],
      ['EDS', 596, '#fb7185'],
      ['패키징', 680, '#f97316'],
    ].map(([label, x, color]) => (
      <g key={label}>
        <circle cx={x} cy="110" r="24" fill="#111827" stroke={color} strokeWidth="4" />
        <text x={x} y="154" fill="#e5e7eb" fontSize="13" fontWeight="700" textAnchor="middle">{label}</text>
      </g>
    ))}
    <text x="380" y="54" fill="#f8fafc" fontSize="18" fontWeight="800" textAnchor="middle">
      Idea → Circuit → Silicon → Package → Product
    </text>
  </svg>
);

export const SemiProcessGuide = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState(processPhases[1].id);
  const [selectedWaferId, setSelectedWaferId] = useState(waferEightProcesses[2].id);
  const selectedPhase = useMemo(
    () => processPhases.find((phase) => phase.id === selectedPhaseId) || processPhases[0],
    [selectedPhaseId]
  );
  const selectedWafer = useMemo(
    () => waferEightProcesses.find((step) => step.id === selectedWaferId) || waferEightProcesses[0],
    [selectedWaferId]
  );
  const selectedPhaseIntel = useMemo(
    () => getProcessIntelligence(selectedPhase.id, technologies, companies),
    [selectedPhase.id]
  );
  const selectedWaferIntel = useMemo(
    () => getProcessIntelligence(selectedWafer.id, technologies, companies),
    [selectedWafer.id]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300">
              <CircuitBoard size={22} />
              <span className="text-sm font-semibold">Semiconductor Process Masterclass</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">반도체 전체 공정 마스터</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              제품 기획과 RTL 설계에서 시작해 검증, 합성, 물리 설계, tape-out, 웨이퍼 8대 공정, EDS, 패키징, 최종 테스트까지 한 번에 연결해 보는 공정 해설입니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">설계 단계</p>
              <p className="text-xl font-bold text-text">{processPhases.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">8대 공정</p>
              <p className="text-xl font-bold text-text">{waferEightProcesses.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 px-4 py-3">
              <p className="text-xs text-textMuted">후공정</p>
              <p className="text-xl font-bold text-text">{backendPhases.length}</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-3 sm:p-4">
        <div className="aspect-[3.4/1] min-h-44 overflow-hidden rounded-xl border border-border bg-background">
          <ProcessVisual />
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h3 className="font-bold text-text">설계에서 Tape-out까지</h3>
          </div>
          <div className="space-y-2">
            {processPhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                  selectedPhaseId === phase.id ? 'border-primary bg-primary/15' : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div>
                  <p className="font-bold text-text">{phase.title}</p>
                  <p className="mt-1 text-xs text-textMuted">{phase.subtitle}</p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-textMuted" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-2xl font-bold text-text">{selectedPhase.title}</h3>
          <p className="mt-1 text-sm font-medium text-primary">{selectedPhase.subtitle}</p>
          <p className="mt-4 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-textMuted">
            {selectedPhase.objective}
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <DetailBlock title="무슨 일이 일어나나">
              <StepList items={selectedPhase.whatHappens} />
            </DetailBlock>
            <div className="space-y-4">
              <DetailBlock title="입력">
                <PillList items={selectedPhase.inputs} />
              </DetailBlock>
              <DetailBlock title="결과물">
                <PillList items={selectedPhase.outputs} tone="secondary" />
              </DetailBlock>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <DetailBlock title="도구">
              <PillList items={selectedPhase.tools} />
            </DetailBlock>
            <DetailBlock title="핵심 지표">
              <PillList items={selectedPhase.keyMetrics} tone="secondary" />
            </DetailBlock>
            <DetailBlock title="자주 터지는 문제">
              <ul className="space-y-2">
                {selectedPhase.failureModes.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-textMuted">· {item}</li>
                ))}
              </ul>
            </DetailBlock>
          </div>
          <ProcessIntelLinks intelligence={selectedPhaseIntel} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Factory size={18} className="text-secondary" />
            <h3 className="font-bold text-text">웨이퍼 전공정 8대 공정</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {waferEightProcesses.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedWaferId(step.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  selectedWaferId === step.id ? 'border-secondary bg-secondary/15' : 'border-border bg-background hover:border-secondary/50'
                }`}
              >
                <p className="font-bold text-text">{step.title}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-textMuted">{step.goal}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-text">{selectedWafer.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">{selectedWafer.goal}</p>
          </div>
          <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-textMuted">
            {selectedWafer.detail}
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <DetailBlock title="세부 순서">
              <StepList items={selectedWafer.substeps} />
            </DetailBlock>
            <div className="space-y-4">
              <DetailBlock title="주요 장비">
                <PillList items={selectedWafer.equipment} />
              </DetailBlock>
              <DetailBlock title="주요 소재">
                <PillList items={selectedWafer.materials} tone="secondary" />
              </DetailBlock>
            </div>
          </div>
          <div className="mt-4">
            <DetailBlock title="관리 지표">
              <PillList items={selectedWafer.metrics} />
            </DetailBlock>
          </div>
          <ProcessIntelLinks intelligence={selectedWaferIntel} />
        </Card>
      </section>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <PackageCheck size={18} className="text-amber-300" />
          <h3 className="text-xl font-bold text-text">EDS부터 패키징, 최종 테스트까지</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {backendPhases.map((phase) => (
            <div key={phase.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <Microscope size={16} className="text-amber-300" />
                <h4 className="font-bold text-text">{phase.title}</h4>
              </div>
              <p className="min-h-24 text-sm leading-relaxed text-textMuted">{phase.detail}</p>
              <h5 className="mb-2 mt-4 text-xs font-bold uppercase text-textMuted">세부 단계</h5>
              <ul className="space-y-1.5">
                {phase.steps.map((step) => (
                  <li key={step} className="text-xs leading-relaxed text-textMuted">· {step}</li>
                ))}
              </ul>
              <h5 className="mb-2 mt-4 text-xs font-bold uppercase text-textMuted">지표</h5>
              <PillList items={phase.metrics} tone="secondary" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
