import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Calendar, Dumbbell, Utensils, Moon, TrendingUp, Settings } from 'lucide-react';

const workoutSubNav = [
  { name: '대시보드', path: '/workout', icon: <BarChart3 size={18} />, end: true },
  { name: '주간일정', path: '/workout/schedule', icon: <Calendar size={18} /> },
  { name: '운동기록', path: '/workout/log', icon: <Dumbbell size={18} /> },
  { name: '식단', path: '/workout/diet', icon: <Utensils size={18} /> },
  { name: '수면', path: '/workout/sleep', icon: <Moon size={18} /> },
  { name: '통계', path: '/workout/progress', icon: <TrendingUp size={18} /> },
  { name: '설정', path: '/workout/settings', icon: <Settings size={18} /> },
];

export const WorkoutModule = () => {
  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <nav className="flex gap-1 overflow-x-auto pb-2 border-b border-border">
        {workoutSubNav.map((item) => (
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

      {/* Sub-page content */}
      <Outlet />
    </div>
  );
};
