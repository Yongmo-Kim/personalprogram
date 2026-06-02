import { useState } from 'react';
import { Factory } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { defenseAcquisitionPhases } from '../../data/defenseProcessGuide';

export const DefenseProcess = () => {
  const [selectedId, setSelectedId] = useState(defenseAcquisitionPhases[0].id);
  const selected = defenseAcquisitionPhases.find((phase) => phase.id === selectedId) || defenseAcquisitionPhases[0];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-2 text-emerald-300">
          <Factory size={22} />
          <span className="text-sm font-semibold">Defense Acquisition Masterclass</span>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-text">방산 획득/개발 프로세스</h2>
        <p className="mt-2 max-w-3xl text-sm text-textMuted">위협 분석에서 소요, 체계공학, 설계, 시제, 시험평가, 양산, MRO까지 무기체계가 만들어지는 흐름입니다.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
        <Card>
          <div className="space-y-2">
            {defenseAcquisitionPhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedId(phase.id)}
                className={`w-full rounded-xl border p-3 text-left ${selectedId === phase.id ? 'border-emerald-400 bg-emerald-500/15' : 'border-border bg-background hover:border-emerald-400/60'}`}
              >
                <p className="font-bold text-text">{phase.title}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-2xl font-bold text-text">{selected.title}</h3>
          <p className="mt-4 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-textMuted">{selected.detail}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <h4 className="mb-3 font-bold text-text">목표</h4>
              <p className="text-sm leading-relaxed text-textMuted">{selected.objective}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h4 className="mb-3 font-bold text-text">결과물</h4>
              <div className="flex flex-wrap gap-2">{selected.outputs.map((item) => <span key={item} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">{item}</span>)}</div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-2">
              <h4 className="mb-3 font-bold text-text">주요 리스크</h4>
              <div className="flex flex-wrap gap-2">{selected.risks.map((item) => <span key={item} className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">{item}</span>)}</div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
