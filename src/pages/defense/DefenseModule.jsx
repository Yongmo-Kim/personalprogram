import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Building2, Crosshair, Factory, GitBranch, Globe, Radar, Route } from 'lucide-react';

const defenseSubNav = [
  { name: '대시보드', path: '/defense', icon: <Radar size={18} />, end: true },
  { name: '국내 기업', path: '/defense/korea', icon: <Building2 size={18} /> },
  { name: '해외 기업', path: '/defense/global', icon: <Globe size={18} /> },
  { name: '기술/무기체계', path: '/defense/technologies', icon: <Crosshair size={18} /> },
  { name: '밸류체인', path: '/defense/value-chain', icon: <GitBranch size={18} /> },
  { name: '시장 가치', path: '/defense/market-value', icon: <BarChart3 size={18} /> },
  { name: '획득 프로세스', path: '/defense/process', icon: <Factory size={18} /> },
  { name: '로드맵', path: '/defense/roadmap', icon: <Route size={18} /> },
];

export const DefenseModule = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 border-b border-border pb-4">
      <Radar className="h-8 w-8 text-sky-300" />
      <div>
        <h1 className="text-2xl font-bold text-text">방위산업 인텔리전스</h1>
        <p className="mt-0.5 text-sm text-textMuted">기업, 무기체계, 획득 프로세스, 시장 가치 추적</p>
      </div>
    </div>

    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-2">
      {defenseSubNav.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-sky-500/15 text-sky-300' : 'text-textMuted hover:bg-background hover:text-text'
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
