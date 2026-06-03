import { useEffect, useState } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { calculateBMR, recommendMacros } from '../utils/calculations';
import { INITIAL_USER_SETTINGS } from '../data/mockData';
import { Laptop, Moon, Save, Settings as SettingsIcon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(INITIAL_USER_SETTINGS);

  useEffect(() => {
    const saved = loadData('userSettings', INITIAL_USER_SETTINGS);
    setSettings(saved);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: ['height', 'weight', 'age'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    saveData('userSettings', settings);
    alert('설정이 저장되었습니다.');
  };

  const bmr = calculateBMR(settings.gender, settings.weight, settings.height, settings.age);
  const maintenanceCals = Math.round(bmr * 1.55);
  const recommendation = recommendMacros(settings.goal, settings.weight, maintenanceCals);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="flex items-center gap-2 text-3xl font-bold text-text">
          <SettingsIcon className="text-textMuted" /> 개인 설정
        </h2>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-xl font-bold">내 정보</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="키 (cm)"
                  type="number"
                  name="height"
                  value={settings.height}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="몸무게 (kg)"
                  type="number"
                  name="weight"
                  value={settings.weight}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="나이"
                  type="number"
                  name="age"
                  value={settings.age}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="ml-1 text-sm font-medium text-textMuted">성별</label>
                  <select
                    name="gender"
                    className="rounded-xl border border-border bg-background px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={settings.gender}
                    onChange={handleChange}
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="ml-1 text-sm font-medium text-textMuted">운동 목표</label>
                <select
                  name="goal"
                  className="rounded-xl border border-border bg-background px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={settings.goal}
                  onChange={handleChange}
                >
                  <option value="유지">근육 유지 및 건강</option>
                  <option value="다이어트">다이어트 (체지방 감소)</option>
                  <option value="벌크업">벌크업 (근육량 증가)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="ml-1 text-sm font-medium text-textMuted">운동 경력</label>
                <select
                  name="experience"
                  className="rounded-xl border border-border bg-background px-4 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={settings.experience}
                  onChange={handleChange}
                >
                  <option value="초보자">초보자 (1년 미만)</option>
                  <option value="중급자">중급자 (1~3년)</option>
                  <option value="고급자">고급자 (3년 이상)</option>
                </select>
              </div>

              <Button type="submit" className="flex w-full items-center justify-center gap-2">
                <Save size={20} /> 저장하기
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="mb-4 text-xl font-bold">테마 설정</h3>
            <p className="mb-4 text-sm text-textMuted">원하는 화면 테마를 선택할 수 있습니다. 모바일 기기에도 적용됩니다.</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', name: '라이트', icon: <Sun size={20} className="text-yellow-500" /> },
                { id: 'dark', name: '다크', icon: <Moon size={20} className="text-indigo-400" /> },
                { id: 'system', name: '시스템', icon: <Laptop size={20} className="text-gray-400" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    theme === item.id
                      ? 'border-primary bg-primary/5 font-bold text-primary shadow-xs'
                      : 'border-border bg-surface text-textMuted hover:text-text'
                  }`}
                >
                  {item.icon}
                  <span className="mt-1 text-xs">{item.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <h3 className="mb-4 text-xl font-bold text-primary">자동 목표 추천</h3>
          <p className="mb-6 text-sm text-textMuted">
            입력하신 신체 정보와 목표를 바탕으로 계산된 권장 목표입니다. 의학적 기준이 아닌 일반적 참고용입니다.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-textMuted">기초대사량 (BMR)</span>
              <span className="font-bold">{Math.round(bmr).toLocaleString()} kcal</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-textMuted">유지 칼로리 추정치</span>
              <span className="font-bold">{maintenanceCals.toLocaleString()} kcal</span>
            </div>

            <div className="pt-2">
              <h4 className="mb-2 font-bold">[{settings.goal}] 하루 목표 권장량</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border bg-surface p-3 text-center">
                  <p className="text-xs text-textMuted">총 칼로리</p>
                  <p className="text-lg font-bold text-red-400">{recommendation.calories} kcal</p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-3 text-center">
                  <p className="text-xs text-textMuted">단백질</p>
                  <p className="text-lg font-bold text-secondary">{recommendation.protein} g</p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-3 text-center">
                  <p className="text-xs text-textMuted">탄수화물</p>
                  <p className="text-lg font-bold text-blue-400">{recommendation.carbs} g</p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-3 text-center">
                  <p className="text-xs text-textMuted">지방</p>
                  <p className="text-lg font-bold text-yellow-400">{recommendation.fat} g</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
