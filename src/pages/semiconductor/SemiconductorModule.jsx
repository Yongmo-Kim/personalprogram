import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, CircuitBoard, Cpu, GitBranch, Globe, Building2, Network } from 'lucide-react';

const semiSubNav = [
  { name: '대시보드', path: '/semiconductor', icon: <Cpu size={18} />, end: true },
  { name: '국내 기업', path: '/semiconductor/korea', icon: <Building2 size={18} /> },
  { name: '해외 기업', path: '/semiconductor/global', icon: <Globe size={18} /> },
  { name: '시장 가치', path: '/semiconductor/market-value', icon: <BarChart3 size={18} /> },
  { name: '밸류체인', path: '/semiconductor/value-chain', icon: <Network size={18} /> },
  { name: '로드맵', path: '/semiconductor/roadmap', icon: <GitBranch size={18} /> },
  { name: '공정 마스터', path: '/semiconductor/process', icon: <CircuitBoard size={18} /> },
];

export const SemiconductorModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Cpu className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text">반도체 인텔리전스</h1>
          <p className="text-sm text-textMuted mt-0.5">산업 동향, 기업 탐색, 시장 가치, 밸류체인 분석</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-border">
        {semiSubNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-textMuted hover:text-text hover:bg-background'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
};
