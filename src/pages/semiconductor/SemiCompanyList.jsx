import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { CompanyLogo } from '../../components/semiconductor/CompanyLogo';
import { companies } from '../../data/semiconductorCompanies';
import { Building2, MapPin } from 'lucide-react';
import { getSegmentClasses, getSegmentLabel } from '../../utils/semiconductorStyles';

export const SemiCompanyList = () => {
  const { region, segment } = useParams();
  const [keyword, setKeyword] = useState('');

  const filteredCompanies = useMemo(() => {
    let list = companies;
    
    if (region && region !== 'global' && region !== 'korea') {
      // region params handling
    } else if (region) {
      list = list.filter(c => c.region === region);
    }

    if (segment) {
      list = list.filter(c => c.segments.includes(segment));
    }

    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(kw)) ||
        (c.nameKo && c.nameKo.toLowerCase().includes(kw)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(kw)))
      );
    }

    return list;
  }, [region, segment, keyword]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Building2 size={24} className="text-primary" />
            {region === 'korea' ? '국내 기업' : region === 'global' ? '해외 기업' : '전체 기업'}
            {segment && <span className="text-textMuted text-sm font-normal ml-2">/ {segment}</span>}
          </h2>
        </div>
        <div className="w-full sm:w-64">
          <Input 
            placeholder="회사명, 태그 검색..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <Link key={company.id} to={`/semiconductor/${company.region}/${company.segments[0]}/${company.id}`}>
              <Card className="group flex h-full flex-col justify-between rounded-xl transition-colors hover:border-primary/50">
                <div>
                  <div className="mb-3 flex items-start gap-3">
                    <CompanyLogo company={company} size="md" />
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-text transition-colors group-hover:text-primary">
                        {company.nameKo || company.name}
                      </h3>
                      {company.nameKo && <p className="text-xs text-textMuted">{company.name}</p>}
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-textMuted">
                        <MapPin size={14} /> {company.country}
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-textMuted">
                    {company.shortDescription}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {company.segments.slice(0, 3).map((segment) => (
                      <span key={segment} className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(segment)}`}>
                        {getSegmentLabel(segment)}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {company.tags?.slice(0, 4).map(tag => (
                      <span key={tag} className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-textMuted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-textMuted">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
