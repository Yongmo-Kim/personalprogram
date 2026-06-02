import { NavLink, Outlet } from 'react-router-dom';
import { Home, Briefcase, CalendarDays, Globe, Cpu, Settings, Shield } from 'lucide-react';

export const Layout = () => {
  const navItems = [
    { name: '홈', path: '/', icon: <Home size={20} /> },
    { name: '취업', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: '일정표', path: '/calendar', icon: <CalendarDays size={20} /> },
    { name: '세계뉴스', path: '/world-news', icon: <Globe size={20} /> },
    { name: '반도체', path: '/semiconductor', icon: <Cpu size={20} /> },
    { name: '방위산업', path: '/defense', icon: <Shield size={20} /> },
    { name: '설정', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-surface flex-shrink-0">
        <div className="p-5 border-b border-border">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Wortout</h1>
          <p className="text-xs text-textMuted mt-0.5">개인 생활 대시보드</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-textMuted hover:bg-background hover:text-text'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around p-1.5 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center p-1.5 rounded-lg min-w-[44px] ${
                isActive ? 'text-primary' : 'text-textMuted'
              }`
            }
          >
            {item.icon}
            <span className="text-[9px] mt-0.5 whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
