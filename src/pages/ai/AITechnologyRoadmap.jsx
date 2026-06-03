import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import { technologyRoadmaps } from '../../data/aiInsightMaps';
import { ACCENT_CLASSES } from '../../utils/aiStyles';

export const AITechnologyRoadmap = () => {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-xl border border-primary/25 bg-primary/10 p-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <GitBranch size={24} />
          <span className="font-semibold">Technology Roadmap</span>
        </div>
        <h2 className="text-3xl font-bold text-text mb-2">AI 기술 발전 로드맵</h2>
        <p className="text-sm leading-relaxed text-textMuted max-w-3xl">
          과거의 단순한 모델에서부터 현재의 멀티모달, 미래의 인공일반지능(AGI)으로 이어지는 핵심 기술의 진화 과정을 한눈에 파악합니다.
        </p>
      </section>

      <div className="space-y-12">
        {technologyRoadmaps.map((roadmap) => {
          const colorClass = ACCENT_CLASSES[roadmap.color] || ACCENT_CLASSES.blue;
          
          return (
            <div key={roadmap.id} className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-2xl font-bold text-text">{roadmap.title}</h3>
                <p className="mt-2 text-sm text-textMuted">{roadmap.summary}</p>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50 md:left-1/2 md:-translate-x-1/2" />
                
                <div className="space-y-8">
                  {roadmap.steps.map((step, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div key={step.label} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8`}>
                        <div className="hidden md:block md:w-1/2" />
                        
                        <div className="absolute left-4 w-4 h-4 rounded-full border-4 border-background bg-primary md:left-1/2 md:-translate-x-1/2 transform -translate-y-1/2 top-6" />
                        
                        <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                          <Link to={`/ai/technology/${step.techId}`}>
                            <div className={`rounded-xl border p-5 transition-colors hover:border-primary/50 ${colorClass.hero}`}>
                              <span className="inline-block rounded-full bg-background/50 px-2 py-1 text-xs font-bold text-textMuted mb-2">
                                {step.stage}
                              </span>
                              <h4 className="text-xl font-bold text-text mb-2">{step.label}</h4>
                              <p className="text-sm text-textMuted">{step.note}</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
