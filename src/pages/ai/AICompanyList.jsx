import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { companies } from '../../data/aiCompanies';
import { getSegmentClasses, getSegmentLabel, SEGMENTS } from '../../utils/aiStyles';

export const AICompanyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSegment = searchParams.get('segment') || 'all';
  const initialRegion = searchParams.get('region') || 'all';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState(initialSegment);
  const [activeRegion, setActiveRegion] = useState(initialRegion);

  const handleSegmentChange = (segmentId) => {
    setActiveSegment(segmentId);
    if (segmentId === 'all') {
      searchParams.delete('segment');
    } else {
      searchParams.set('segment', segmentId);
    }
    setSearchParams(searchParams);
  };

  const handleRegionChange = (regionId) => {
    setActiveRegion(regionId);
    if (regionId === 'all') {
      searchParams.delete('region');
    } else {
      searchParams.set('region', regionId);
    }
    setSearchParams(searchParams);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchRegion = activeRegion === 'all' || company.region === activeRegion;
      const matchSegment = activeSegment === 'all' || company.segments.includes(activeSegment);
      const matchSearch =
        !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.nameKo && company.nameKo.includes(searchTerm)) ||
        company.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchRegion && matchSegment && matchSearch;
    });
  }, [activeRegion, activeSegment, searchTerm]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-text">AI 기업 목록</h2>
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="기업명, 태그 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleRegionChange('all')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeRegion === 'all' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50' : 'bg-surface text-textMuted border border-transparent hover:text-text'
            }`}
          >
            전체 지역
          </button>
          <button
            onClick={() => handleRegionChange('global')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeRegion === 'global' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50' : 'bg-surface text-textMuted border border-transparent hover:text-text'
            }`}
          >
            해외 AI
          </button>
          <button
            onClick={() => handleRegionChange('korea')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeRegion === 'korea' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50' : 'bg-surface text-textMuted border border-transparent hover:text-text'
            }`}
          >
            국내 AI
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSegmentChange('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeSegment === 'all' ? 'bg-fuchsia-600 text-white' : 'bg-surface text-textMuted hover:bg-border'
            }`}
          >
            전체 세그먼트
          </button>
          {SEGMENTS.map((segment) => (
            <button
              key={segment.id}
              onClick={() => handleSegmentChange(segment.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeSegment === segment.id
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-surface text-textMuted hover:bg-border'
              }`}
            >
              {segment.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center text-sm text-textMuted">
        총 <span className="font-bold text-fuchsia-400 mx-1">{filteredCompanies.length}</span>개의 기업이 검색되었습니다.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Link key={company.id} to={`/ai/company/${company.id}`}>
            <Card className="flex h-full flex-col justify-between transition-colors hover:border-fuchsia-500/50">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-text">{company.nameKo || company.name}</h3>
                    <p className="text-sm text-textMuted">{company.name}</p>
                  </div>
                  <span className="rounded-lg bg-surface px-2 py-1 text-xs font-bold text-textMuted border border-border">
                    {company.country}
                  </span>
                </div>
                <p className="mt-3 text-sm text-textMuted line-clamp-3">{company.description}</p>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {company.segments.map((segment) => (
                    <span key={segment} className={`rounded border px-2 py-0.5 text-xs ${getSegmentClasses(segment)}`}>
                      {getSegmentLabel(segment)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {company.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded bg-background px-1.5 py-0.5 text-[11px] text-textMuted border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="col-span-full py-12 text-center text-textMuted bg-surface rounded-xl border border-border">
            조건에 맞는 기업이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
