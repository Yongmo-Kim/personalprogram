import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BrainCircuit, Cpu, GitBranch, Building2, Network, BookOpen } from 'lucide-react';

const aiSubNav = [
  { name: '대시보드', path: '/ai', icon: <BrainCircuit size={18} />, end: true },
  { name: '주요 기업', path: '/ai/companies', icon: <Building2 size={18} /> },
  { name: '시장 가치', path: '/ai/market-value', icon: <BarChart3 size={18} /> },
  { name: '밸류체인', path: '/ai/value-chain', icon: <Network size={18} /> },
  { name: '기술 로드맵', path: '/ai/roadmap', icon: <GitBranch size={18} /> },
  { name: 'AI 프로세스', path: '/ai/process', icon: <Cpu size={18} /> },
  { name: 'AI 이론 백과', path: '/ai/theory', icon: <BookOpen size={18} /> },
];

export const AIModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text">인공지능(AI) 인텔리전스</h1>
          <p className="text-sm text-textMuted mt-0.5">AI 산업 동향, 빅테크/스타트업 탐색, 가치사슬 분석</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-border">
        {aiSubNav.map((item) => (
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
