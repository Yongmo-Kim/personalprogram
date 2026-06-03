import { Cpu, ArrowRight } from 'lucide-react';
import { processPhases, aiDevelopmentProcesses } from '../../data/aiProcessGuide';
import { getProcessIntelligence } from '../../data/aiIntelligence';
import { Card } from '../../components/UI/Card';

export const AIProcessGuide = () => {
  const intelligence = getProcessIntelligence();

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-xl border border-primary/25 bg-primary/10 p-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Cpu size={24} />
          <span className="font-semibold">Process Master</span>
        </div>
        <h2 className="text-3xl font-bold text-text mb-2">AI 개발 프로세스 가이드</h2>
        <p className="text-sm leading-relaxed text-textMuted max-w-3xl">
          데이터 준비부터 모델 학습, 파인튜닝, 그리고 실제 서비스 추론까지 AI 모델이 만들어지고 서비스되는 전체 생명주기를 이해합니다.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {processPhases.map((phase, index) => {
          const phaseIntelligence = intelligence.find(i => i.id === phase.id);
          const steps = aiDevelopmentProcesses.filter(p => p.phaseId === phase.id);

          return (
            <div key={phase.id} className="relative">
              <Card className="h-full flex flex-col bg-surface border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-text">{phase.title}</h3>
                </div>
                
                {phaseIntelligence && (
                  <div className="mb-4 text-sm text-textMuted bg-background p-3 rounded-lg border border-border/50">
                    <p className="font-semibold text-text mb-1">{phaseIntelligence.summary}</p>
                    <p className="text-xs">{phaseIntelligence.impact}</p>
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  {steps.map(step => (
                    <div key={step.id} className="border-l-2 border-primary/30 pl-3 py-1">
                      <h4 className="font-semibold text-text text-sm mb-1">{step.name}</h4>
                      <p className="text-xs text-textMuted">{step.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              {index < processPhases.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight size={24} className="text-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
