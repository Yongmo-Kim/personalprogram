import { Link, useParams } from 'react-router-dom';
import { DefenseLogo } from '../../components/defense/DefenseLogo';
import { Card } from '../../components/UI/Card';
import { defenseCompanies } from '../../data/defenseCompanies';
import { getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

export const DefenseCompanyList = () => {
  const { region, segment } = useParams();
  const filtered = defenseCompanies.filter((company) => {
    const regionOk = !region || company.region === region;
    const segmentOk = !segment || company.segments.includes(segment);
    return regionOk && segmentOk;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-text">{region === 'korea' ? '국내 방산 기업' : '해외 방산 기업'}</h2>
        <p className="mt-1 text-sm text-textMuted">{segment ? getDefenseSegmentLabel(segment) : '전체'} 기준 {filtered.length}개 기업</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((company) => (
          <Link key={company.id} to={`/defense/${company.region}/${company.segments[0]}/${company.id}`}>
            <Card className="h-full transition-colors hover:border-sky-400/60">
              <div className="flex gap-3">
                <DefenseLogo item={company} />
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-text">{company.nameKo}</h3>
                  <p className="text-xs text-textMuted">{company.name}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-textMuted">{company.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {company.segments.map((item) => (
                  <span key={item} className={`rounded border px-1.5 py-0.5 text-[10px] ${getDefenseSegmentClasses(item)}`}>
                    {getDefenseSegmentLabel(item)}
                  </span>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
