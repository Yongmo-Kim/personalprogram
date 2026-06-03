import { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Briefcase,
  CalendarDays,
  Cpu,
  Globe,
  Home,
  Laptop,
  Moon,
  Settings,
  Shield,
  Sun,
} from 'lucide-react';
import { useTheme } from '../contexts/theme';

export const Layout = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      { name: '홈', path: '/', icon: <Home size={20} /> },
      { name: '취업', path: '/jobs', icon: <Briefcase size={20} /> },
      { name: '일정표', path: '/calendar', icon: <CalendarDays size={20} /> },
      { name: '세계뉴스', path: '/world-news', icon: <Globe size={20} /> },
      { name: '반도체', path: '/semiconductor', icon: <Cpu size={20} /> },
      { name: '방위산업', path: '/defense', icon: <Shield size={20} /> },
      { name: '인공지능', path: '/ai', icon: <BrainCircuit size={20} /> },
      { name: '설정', path: '/settings', icon: <Settings size={20} /> },
    ],
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="검색"], #job-keyword-search, input[placeholder*="Search"]',
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable);

      if (isInputActive) return;

      const keyNum = Number.parseInt(event.key, 10);
      if (keyNum >= 1 && keyNum <= navItems.length) {
        event.preventDefault();
        navigate(navItems[keyNum - 1].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, navItems]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border p-5">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Wortout</h1>
          <p className="mt-0.5 text-xs text-textMuted">개인 생활 대시보드</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-textMuted hover:bg-background hover:text-text'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
              <span className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-textMuted opacity-0 transition-opacity group-hover:opacity-100">
                {index + 1}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t border-border p-4">
          <span className="text-xs font-medium text-textMuted">화면 모드</span>
          <div className="flex rounded-lg border border-border bg-background p-0.5">
            {[
              { id: 'light', icon: <Sun size={15} />, label: '라이트' },
              { id: 'dark', icon: <Moon size={15} />, label: '다크' },
              { id: 'system', icon: <Laptop size={15} />, label: '시스템' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                title={item.label}
                className={`cursor-pointer rounded-md p-1.5 transition-all ${
                  theme === item.id
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-textMuted hover:text-text'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-border bg-surface p-1.5 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex min-w-[44px] flex-col items-center rounded-lg p-1.5 ${
                isActive ? 'text-primary' : 'text-textMuted'
              }`
            }
          >
            {item.icon}
            <span className="mt-0.5 whitespace-nowrap text-[9px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
