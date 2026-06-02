import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { format } from 'date-fns';
import { loadData } from '../utils/storage';
import { DEFAULT_WEEKLY_SCHEDULE, INITIAL_USER_SETTINGS } from '../data/mockData';
import { recommendMacros } from '../utils/calculations';
import { Flame, Dumbbell, Utensils, Moon, Activity } from 'lucide-react';

export const Dashboard = () => {
  const [todayData, setTodayData] = useState(null);
  const [settings, setSettings] = useState(INITIAL_USER_SETTINGS);
  const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);

  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const dayOfWeek = format(new Date(), 'EEEE');
  const todayWorkoutPart = schedule[dayOfWeek];

  useEffect(() => {
    const savedSettings = loadData('userSettings', INITIAL_USER_SETTINGS);
    setSettings(savedSettings);

    const savedSchedule = loadData('weeklySchedule', DEFAULT_WEEKLY_SCHEDULE);
    setSchedule(savedSchedule);

    const savedData = loadData('dailyData', {});
    const today = savedData[todayDate] || {
      workout: [],
      diet: [],
      sleep: { duration: 0, quality: '' }
    };
    setTodayData(today);
  }, [todayDate]);

  if (!todayData) return null;

  // Calculate summaries
  const totalVolume = todayData.workout.reduce((acc, curr) => acc + (curr.weight * curr.reps * curr.sets), 0);
  const totalCalories = todayData.diet.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = todayData.diet.reduce((acc, curr) => acc + curr.protein, 0);
  const sleepDuration = todayData.sleep.duration;

  // Recommendations
  const maintenanceCals = 2000; // Simplified for now, real calculation would use BMR
  const recommended = recommendMacros(settings.goal, settings.weight, maintenanceCals);

  // Generate Feedback
  let feedback = [];
  if (totalProtein < recommended.protein) {
    feedback.push(`오늘 단백질 섭취가 목표(${recommended.protein}g)보다 부족합니다.`);
  } else {
    feedback.push(`훌륭합니다! 단백질 목표를 달성했습니다.`);
  }

  if (sleepDuration > 0 && sleepDuration < 7) {
    feedback.push('수면이 7시간 미만입니다. 근성장과 회복을 위해 더 주무시는 것을 권장합니다.');
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-text">오늘의 요약</h2>
          <p className="text-textMuted mt-1">{format(new Date(), 'yyyy년 MM월 dd일')} ({dayOfWeek})</p>
        </div>
        <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Dumbbell size={20} /> {todayWorkoutPart}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition-transform">
          <Activity className="text-primary mb-2" size={32} />
          <h3 className="text-sm text-textMuted">운동 볼륨</h3>
          <p className="text-2xl font-bold mt-1">{totalVolume.toLocaleString()} kg</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition-transform">
          <Flame className="text-red-500 mb-2" size={32} />
          <h3 className="text-sm text-textMuted">섭취 칼로리</h3>
          <p className="text-2xl font-bold mt-1">{totalCalories.toLocaleString()} kcal</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition-transform">
          <Utensils className="text-secondary mb-2" size={32} />
          <h3 className="text-sm text-textMuted">단백질</h3>
          <p className="text-2xl font-bold mt-1">{totalProtein} g</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:-translate-y-1 transition-transform">
          <Moon className="text-indigo-400 mb-2" size={32} />
          <h3 className="text-sm text-textMuted">수면 시간</h3>
          <p className="text-2xl font-bold mt-1">{sleepDuration} hr</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity size={24} className="text-primary" /> AI 피드백
        </h3>
        <ul className="space-y-3">
          {feedback.length > 0 ? (
            feedback.map((msg, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-background p-3 rounded-xl border border-border">
                <span className="text-secondary">💡</span>
                <span className="text-sm">{msg}</span>
              </li>
            ))
          ) : (
            <li className="text-textMuted text-sm">데이터를 더 입력하시면 맞춤 피드백이 제공됩니다. (의학적 진단이 아닙니다)</li>
          )}
        </ul>
      </Card>
    </div>
  );
};
