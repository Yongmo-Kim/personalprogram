import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Briefcase, CalendarDays, Globe, Cpu, Settings, Shield, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Layout = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { name: '홈', path: '/', icon: <Home size={20} /> },
    { name: '취업', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: '일정표', path: '/calendar', icon: <CalendarDays size={20} /> },
    { name: '세계뉴스', path: '/world-news', icon: <Globe size={20} /> },
    { name: '반도체', path: '/semiconductor', icon: <Cpu size={20} /> },
    { name: '방위산업', path: '/defense', icon: <Shield size={20} /> },
    { name: '설정', path: '/settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Ctrl + K -> 검색 포커스
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"], input[placeholder*="검색"], #job-keyword-search, input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 입력 중일 때는 숫자 네비게이션 단축키 무시
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable);

      if (isInputActive) return;

      // 2. 숫자 1 ~ 7 -> 해당 메뉴로 이동
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= navItems.length) {
        e.preventDefault();
        const targetPath = navItems[keyNum - 1].path;
        navigate(targetPath);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, navItems.length]);

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-surface flex-shrink-0">
        <div className="p-5 border-b border-border">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Wortout</h1>
          <p className="text-xs text-textMuted mt-0.5">개인 생활 대시보드</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm group ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-textMuted hover:bg-background hover:text-text'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
              <span className="ml-auto text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-textMuted font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {idx + 1}
              </span>
            </NavLink>
          ))}
        </nav>
        {/* Desktop Theme Toggle */}
        <div className="p-4 border-t border-border mt-auto flex justify-between items-center">
          <span className="text-xs text-textMuted font-medium">화면 모드</span>
          <div className="flex bg-background rounded-lg p-0.5 border border-border">
            {[
              { id: 'light', icon: <Sun size={15} />, label: '라이트' },
              { id: 'dark', icon: <Moon size={15} />, label: '다크' },
              { id: 'system', icon: <Laptop size={15} />, label: '시스템' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  theme === t.id
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-textMuted hover:text-text'
                }`}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </div>
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
