import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  CircleDollarSign,
  RefreshCw,
  TimerReset,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { buildMarketCapSeries, fetchMarketValueData } from '../../services/marketValueService';
import { getSegmentClasses, getSegmentLabel, SEGMENTS } from '../../utils/aiStyles';

const REFRESH_INTERVAL = 30 * 1000;

const formatUsd = (value) => {
  if (!Number.isFinite(value)) return '-';
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  return `$${(value / 1_000_000_000).toFixed(1)}B`;
};

const formatBillions = (value) => `$${Number(value || 0).toFixed(0)}B`;

const formatPrice = (value, currency) =>
  new Intl.NumberFormat(currency === 'KRW' ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(value || 0);

const rankCompanies = (companies) =>
  companies
    .map((company) => ({
      ...company,
      previousMarketCapUsd:
        company.previousPrice && company.price
          ? company.marketCapUsd * (company.previousPrice / company.price)
          : company.marketCapUsd,
    }))
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .map((company, index, list) => ({
      ...company,
      rank: index + 1,
      previousRank:
        [...list].sort((a, b) => b.previousMarketCapUsd - a.previousMarketCapUsd).findIndex((item) => item.companyId === company.companyId) + 1,
    }));

export const AIMarketValue = () => {
  const [marketData, setMarketData] = useState({ companies: [], usdKrw: 1350, fxRates: { KRW: 1350 }, hasFallback: false });
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedIds, setSelectedIds] = useState([
    'microsoft',
    'nvidia',
    'alphabet',
    'amazon',
    'meta',
    'palantir',
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const loadMarketData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMarketValueData();
      
      // Filter only AI related companies for this dashboard
      const aiCompanies = ['nvidia', 'microsoft', 'alphabet', 'amazon', 'meta', 'apple', 'tesla', 'oracle', 'palantir', 'snowflake', 'databricks', 'crowdstrike', 'broadcom', 'amd', 'intel', 'naver', 'kakao', 'sk-hynix', 'samsung-electronics'];
      data.companies = data.companies.filter(c => aiCompanies.includes(c.companyId));
      
      setMarketData(data);
      setLastUpdated(new Date(data.lastUpdated));
    } catch (err) {
      setError(err.message || '시장 가치 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    intervalRef.current = setInterval(loadMarketData, REFRESH_INTERVAL);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [autoRefresh, loadMarketData]);

  const filteredCompanies = useMemo(
    () =>
      marketData.companies.filter((company) => {
        const regionOk = selectedRegion === 'all' || company.region === selectedRegion;
        const segmentOk = selectedSegment === 'all' || company.segment === selectedSegment;
        return regionOk && segmentOk;
      }),
    [marketData.companies, selectedRegion, selectedSegment]
  );

  const rankedCompanies = useMemo(() => rankCompanies(filteredCompanies), [filteredCompanies]);
  const chartCompanies = useMemo(
    () => marketData.companies.filter((company) => selectedIds.includes(company.companyId)),
    [marketData.companies, selectedIds]
  );
  const chartData = useMemo(
    () => buildMarketCapSeries(marketData.companies, selectedIds, marketData.fxRates || marketData.usdKrw),
    [marketData.companies, marketData.fxRates, marketData.usdKrw, selectedIds]
  );

  const totalMarketCap = filteredCompanies.reduce((sum, company) => sum + company.marketCapUsd, 0);
  const koreaMarketCap = marketData.companies
    .filter((company) => company.region === 'korea')
    .reduce((sum, company) => sum + company.marketCapUsd, 0);
  const globalMarketCap = marketData.companies
    .filter((company) => company.region === 'global')
    .reduce((sum, company) => sum + company.marketCapUsd, 0);
  const gainers = filteredCompanies.filter((company) => company.changePercent >= 0).length;
  const losers = Math.max(filteredCompanies.length - gainers, 0);
  
  const segmentStats = useMemo(
    () =>
      SEGMENTS.map((segment) => {
        const group = marketData.companies.filter((company) => {
          const regionOk = selectedRegion === 'all' || company.region === selectedRegion;
          return regionOk && company.segment === segment.id;
        });
        const total = group.reduce((sum, company) => sum + company.marketCapUsd, 0);
        const averageChange = group.length
          ? group.reduce((sum, company) => sum + company.changePercent, 0) / group.length
          : 0;
        const leader = [...group].sort((a, b) => b.marketCapUsd - a.marketCapUsd)[0];
        return {
          ...segment,
          count: group.length,
          total,
          averageChange,
          leader,
        };
      })
        .filter((segment) => segment.count > 0)
        .sort((a, b) => b.total - a.total),
    [marketData.companies, selectedRegion]
  );

  const toggleCompany = (companyId) => {
    setSelectedIds((current) => {
      if (current.includes(companyId)) {
        return current.length > 1 ? current.filter((id) => id !== companyId) : current;
      }
      return [...current, companyId].slice(-8);
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <section className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-fuchsia-300">
              <CircleDollarSign size={22} />
              <span className="text-sm font-semibold">AI Market Value Intelligence</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-text">인공지능 시장 가치</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              Yahoo Finance 1일 차트 가격을 기준으로 AI 산업을 주도하는 주요 상장 기업들의 시장 가치 흐름을 추적합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {lastUpdated && (
              <span className="flex items-center gap-1.5 text-textMuted">
                <TimerReset size={15} />
                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 갱신
              </span>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-textMuted">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(event) => setAutoRefresh(event.target.checked)}
                className="h-4 w-4 accent-fuchsia-400"
              />
              30초 자동 갱신
            </label>
            <button
              onClick={loadMarketData}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-text transition-colors hover:border-fuchsia-400/60 hover:text-fuchsia-300"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              새로고침
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: '선택 범위 가치', value: formatUsd(totalMarketCap) },
            { label: '국내 합산', value: formatUsd(koreaMarketCap) },
            { label: '해외 합산', value: formatUsd(globalMarketCap) },
            { label: '상승 기업', value: `${gainers}개` },
            { label: '하락 기업', value: `${losers}개` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3">
              <p className="text-xs text-textMuted">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {(marketData.hasFallback || error) && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          {error || '일부 금융 데이터 연결에 실패해 해당 기업은 샘플 가격 흐름으로 표시 중입니다. (비상장 기업 포함)'}
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-text">산업군별 모멘텀</h3>
          <p className="mt-1 text-sm text-textMuted">선택한 지역 기준으로 산업군의 시장가치와 평균 등락률을 비교합니다.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {segmentStats.map((segment) => {
            const isUp = segment.averageChange >= 0;
            return (
              <div key={segment.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`rounded border px-2 py-1 text-xs ${getSegmentClasses(segment.id)}`}>
                      {segment.label}
                    </span>
                    <p className="mt-3 text-2xl font-bold text-text">{formatUsd(segment.total)}</p>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${isUp ? 'bg-fuchsia-500/15 text-fuchsia-300' : 'bg-red-500/15 text-red-300'}`}>
                    {isUp ? '+' : ''}{segment.averageChange.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-3 text-xs leading-relaxed text-textMuted">
                  <p>{segment.count}개 기업 추적</p>
                  {segment.leader && <p className="mt-1">대표: {segment.leader.nameKo}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="min-h-[480px]">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-text">
                <BarChart3 size={18} className="text-fuchsia-300" />
                실시간 시장 가치 라인
              </h3>
              <p className="mt-1 text-xs text-textMuted">단위: USD Billion, 최대 8개 기업 비교</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: '전체' },
                { id: 'korea', label: '국내' },
                { id: 'global', label: '해외' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedRegion(item.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedRegion === item.id
                      ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200'
                      : 'border-border text-textMuted hover:text-text'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[330px]">
            {loading && !chartData.length ? (
              <div className="grid h-full place-items-center text-sm text-textMuted">시장 데이터를 불러오는 중...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 20, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                  <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} minTickGap={28} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={formatBillions} width={62} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(148, 163, 184, 0.28)',
                      borderRadius: 8,
                      color: '#f8fafc',
                    }}
                    formatter={(value, name) => {
                      const company = chartCompanies.find((item) => item.companyId === name);
                      return [formatBillions(value), company?.nameKo || name];
                    }}
                  />
                  {chartCompanies.map((company) => (
                    <Line
                      key={company.companyId}
                      type="monotone"
                      dataKey={company.companyId}
                      stroke={company.color}
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive
                      animationDuration={600}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {marketData.companies.map((company) => (
              <button
                key={company.companyId}
                onClick={() => toggleCompany(company.companyId)}
                className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                  selectedIds.includes(company.companyId)
                    ? 'border-fuchsia-400/60 bg-fuchsia-500/15 text-text'
                    : 'border-border text-textMuted hover:text-text'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: company.color }} />
                {company.nameKo}
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-h-[480px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-text">시장 가치 순위</h3>
              <p className="mt-1 text-xs text-textMuted">전일 종가 기준 순위 변동 추정</p>
            </div>
            <select
              value={selectedSegment}
              onChange={(event) => setSelectedSegment(event.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-text"
            >
              <option value="all">전체 산업</option>
              {SEGMENTS.map((segment) => (
                <option key={segment.id} value={segment.id}>{segment.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {rankedCompanies.map((company) => {
              const rankDelta = company.previousRank - company.rank;
              const isUp = company.changePercent >= 0;

              return (
                <button
                  key={company.companyId}
                  onClick={() => toggleCompany(company.companyId)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-fuchsia-400/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface text-sm font-bold text-text">
                          {company.rank}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-text">{company.nameKo}</p>
                          <p className="text-xs text-textMuted">{company.symbol} · {company.exchange}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getSegmentClasses(company.segment)}`}>
                          {getSegmentLabel(company.segment)}
                        </span>
                        {rankDelta !== 0 && (
                          <span className={`text-[10px] ${rankDelta > 0 ? 'text-fuchsia-300' : 'text-red-300'}`}>
                            순위 {rankDelta > 0 ? `+${rankDelta}` : rankDelta}
                          </span>
                        )}
                        {company.isFallback && (
                          <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-200">
                            샘플
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-text">{formatUsd(company.marketCapUsd)}</p>
                      <p className="mt-0.5 text-xs text-textMuted">{formatPrice(company.price, company.currency)}</p>
                      <p className={`mt-1 inline-flex items-center justify-end gap-1 text-xs font-semibold ${isUp ? 'text-fuchsia-300' : 'text-red-300'}`}>
                        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
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

      <Card>
        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <h3 className="text-lg font-bold text-text">세그먼트별 시장 규모</h3>
            <p className="mt-1 text-sm text-textMuted">선택한 기업군의 시장 가치 합산입니다.</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SEGMENTS.map((segment) => ({
                  name: segment.label,
                  value:
                    marketData.companies
                      .filter((company) => company.segment === segment.id)
                      .reduce((sum, company) => sum + company.marketCapUsd, 0) / 1_000_000_000,
                })).filter((item) => item.value > 0)}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={formatBillions} width={62} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(148, 163, 184, 0.28)',
                    borderRadius: 8,
                    color: '#f8fafc',
                  }}
                  formatter={(value) => [formatBillions(value), '시장 가치']}
                />
                <Area type="monotone" dataKey="value" stroke="#d946ef" fill="rgba(217, 70, 239, 0.18)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
