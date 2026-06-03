import { Link } from 'react-router-dom';
import { Network, ArrowRight } from 'lucide-react';
import { valueChainStages } from '../../data/aiInsightMaps';
import { companies } from '../../data/aiCompanies';
import { getSegmentClasses } from '../../utils/aiStyles';
import { Card } from '../../components/UI/Card';

export const AIValueChain = () => {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-xl border border-primary/25 bg-primary/10 p-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Network size={24} />
          <span className="font-semibold">Value Chain</span>
        </div>
        <h2 className="text-3xl font-bold text-text mb-2">AI 가치 사슬 (Value Chain)</h2>
        <p className="text-sm leading-relaxed text-textMuted max-w-3xl">
          AI 산업은 하드웨어 인프라부터 클라우드, 파운데이션 모델, 그리고 최종 애플리케이션으로 이어지는 거대한 생태계를 형성하고 있습니다.
        </p>
      </section>

      <div className="space-y-12">
        {valueChainStages.map((stage, index) => {
          const stageCompanies = stage.companyIds.map(id => companies.find(c => c.id === id)).filter(Boolean);
          
          return (
            <div key={stage.id} className="relative">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-text">{stage.label}</h3>
                  </div>
                  <h4 className="text-lg font-semibold text-primary">{stage.headline}</h4>
                  <p className="text-sm text-textMuted leading-relaxed">{stage.description}</p>
                  
                  <div className="pt-2">
                    <p className="text-xs font-bold text-textMuted mb-2">핵심 관전 포인트 (Watch Points)</p>
                    <ul className="space-y-1">
                      {stage.watchPoints.map((point, i) => (
                        <li key={i} className="text-sm text-text flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <Card className="h-full bg-surface border-border">
                    <p className="text-sm font-bold text-textMuted mb-4">대표 기업</p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {stageCompanies.map(company => (
                        <Link key={company.id} to={`/ai/company/${company.id}`} className={`block rounded-lg border p-3 transition-colors hover:border-primary/50 ${getSegmentClasses(stage.id)}`}>
                          <p className="font-bold mb-1">{company.nameKo || company.name}</p>
                          <p className="text-xs opacity-80 line-clamp-1">{company.shortDescription}</p>
                        </Link>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {index < valueChainStages.length - 1 && (
                <div className="hidden lg:flex justify-center my-6">
                  <ArrowRight size={32} className="text-border rotate-90 lg:rotate-0" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
