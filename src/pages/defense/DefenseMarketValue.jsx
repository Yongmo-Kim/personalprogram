import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { buildDefenseMarketSeries, fetchDefenseMarketData } from '../../services/defenseMarketService';
import { getDefenseSegmentClasses, getDefenseSegmentLabel } from '../../utils/defenseStyles';

const formatUsd = (value) => {
  if (!Number.isFinite(value)) return '-';
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  return `$${(value / 1_000_000_000).toFixed(1)}B`;
};

const formatBillions = (value) => `$${Number(value || 0).toFixed(0)}B`;

export const DefenseMarketValue = () => {
  const [marketData, setMarketData] = useState({ companies: [], hasFallback: false });
  const [selectedIds, setSelectedIds] = useState(['lockheed-martin', 'rtx', 'northrop-grumman', 'hanwha-aerospace', 'lig-nex1']);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchDefenseMarketData();
    setMarketData(data);
    setLastUpdated(new Date(data.lastUpdated));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 45_000);
    return () => clearInterval(id);
  }, [loadData]);

  const chartData = useMemo(() => buildDefenseMarketSeries(marketData.companies, selectedIds), [marketData.companies, selectedIds]);
  const chartCompanies = marketData.companies.filter((company) => selectedIds.includes(company.companyId));
  const total = marketData.companies.reduce((sum, company) => sum + company.marketCapUsd, 0);

  const toggle = (companyId) => {
    setSelectedIds((current) => current.includes(companyId) ? current.filter((id) => id !== companyId) : [...current, companyId].slice(-8));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-300">
              <BarChart3 size={22} />
              <span className="text-sm font-semibold">Defense Market Value</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">방산 시장 가치</h2>
            <p className="mt-2 max-w-3xl text-sm text-textMuted">Yahoo Finance 가격 데이터와 기준 주식 수로 주요 방산 기업 시장 가치를 추정합니다.</p>
          </div>
          <button onClick={loadData} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-text hover:border-sky-400/60">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background/70 p-3">
            <p className="text-xs text-textMuted">추적 기업 합산</p>
            <p className="mt-1 text-2xl font-bold text-text">{formatUsd(total)}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-3">
            <p className="text-xs text-textMuted">기업 수</p>
            <p className="mt-1 text-2xl font-bold text-text">{marketData.companies.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 p-3">
            <p className="text-xs text-textMuted">최근 갱신</p>
            <p className="mt-1 text-2xl font-bold text-text">{lastUpdated ? lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
          </div>
        </div>
      </section>

      {marketData.hasFallback && <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">일부 기업은 금융 데이터 연결 실패로 샘플 흐름을 표시 중입니다.</div>}

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <h3 className="mb-4 text-lg font-bold text-text">실시간 시장 가치 라인</h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={28} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={formatBillions} width={62} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(148, 163, 184, 0.28)', borderRadius: 8, color: '#f8fafc' }}
                  formatter={(value, name) => [formatBillions(value), chartCompanies.find((company) => company.companyId === name)?.nameKo || name]}
                />
                {chartCompanies.map((company) => (
                  <Line key={company.companyId} type="monotone" dataKey={company.companyId} stroke={company.color} strokeWidth={2.5} dot={false} isAnimationActive />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {marketData.companies.map((company) => (
              <button key={company.companyId} onClick={() => toggle(company.companyId)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${selectedIds.includes(company.companyId) ? 'border-sky-400 bg-sky-500/15 text-text' : 'border-border text-textMuted'}`}>
                {company.nameKo}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold text-text">시장 가치 순위</h3>
          <div className="space-y-2">
            {marketData.companies.map((company, index) => {
              const up = company.changePercent >= 0;
              return (
                <button key={company.companyId} onClick={() => toggle(company.companyId)} className="w-full rounded-xl border border-border bg-background p-3 text-left hover:border-sky-400/60">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-bold text-text">{index + 1}. {company.nameKo}</p>
                      <p className="mt-1 text-xs text-textMuted">{company.symbol}</p>
                      <span className={`mt-2 inline-block rounded border px-1.5 py-0.5 text-[10px] ${getDefenseSegmentClasses(company.segment)}`}>{getDefenseSegmentLabel(company.segment)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text">{formatUsd(company.marketCapUsd)}</p>
                      <p className={`mt-1 inline-flex items-center gap-1 text-xs ${up ? 'text-emerald-300' : 'text-red-300'}`}>
                        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {company.changePercent >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
};
