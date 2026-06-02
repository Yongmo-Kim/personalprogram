import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { calculateBMR, recommendMacros } from '../utils/calculations';
import { INITIAL_USER_SETTINGS } from '../data/mockData';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export const Settings = () => {
  const [settings, setSettings] = useState(INITIAL_USER_SETTINGS);

  useEffect(() => {
    const saved = loadData('userSettings', INITIAL_USER_SETTINGS);
    setSettings(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: ['height', 'weight', 'age'].includes(name) ? Number(value) : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveData('userSettings', settings);
    alert('설정이 저장되었습니다.');
  };

  // Calculate recommendation preview
  const bmr = calculateBMR(settings.gender, settings.weight, settings.height, settings.age);
  const maintenanceCals = Math.round(bmr * 1.55); // Assuming moderate activity level
  const recommendation = recommendMacros(settings.goal, settings.weight, maintenanceCals);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <SettingsIcon className="text-textMuted" /> 개인 설정
        </h2>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-4">내 정보</h3>
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
                <label className="text-sm font-medium text-textMuted ml-1">성별</label>
                <select 
                  name="gender"
                  className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={settings.gender}
                  onChange={handleChange}
                >
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-textMuted ml-1">운동 목표</label>
              <select 
                name="goal"
                className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={settings.goal}
                onChange={handleChange}
              >
                <option value="유지">근육 유지 및 건강</option>
                <option value="다이어트">다이어트 (체지방 감소)</option>
                <option value="벌크업">벌크업 (근육량 증가)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-textMuted ml-1">운동 경력</label>
              <select 
                name="experience"
                className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={settings.experience}
                onChange={handleChange}
              >
                <option value="초보자">초보자 (1년 미만)</option>
                <option value="중급자">중급자 (1~3년)</option>
                <option value="고급자">고급자 (3년 이상)</option>
              </select>
            </div>

            <Button type="submit" className="w-full flex justify-center items-center gap-2">
              <Save size={20} /> 저장하기
            </Button>
          </form>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <h3 className="text-xl font-bold mb-4 text-primary">자동 목표 추천</h3>
          <p className="text-sm text-textMuted mb-6">입력하신 신체 정보와 목표를 바탕으로 계산된 권장 목표입니다. (의학적 기준이 아닌 일반적 참고용)</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-textMuted">기초대사량 (BMR)</span>
              <span className="font-bold">{Math.round(bmr).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-textMuted">유지 칼로리 추정치</span>
              <span className="font-bold">{maintenanceCals.toLocaleString()} kcal</span>
            </div>
            
            <div className="pt-2">
              <h4 className="font-bold mb-2">[{settings.goal}] 하루 목표 권장량</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-surface p-3 rounded-lg text-center border border-border">
                  <p className="text-xs text-textMuted">총 칼로리</p>
                  <p className="text-lg font-bold text-red-400">{recommendation.calories} kcal</p>
                </div>
                <div className="bg-surface p-3 rounded-lg text-center border border-border">
                  <p className="text-xs text-textMuted">단백질</p>
                  <p className="text-lg font-bold text-secondary">{recommendation.protein} g</p>
                </div>
                <div className="bg-surface p-3 rounded-lg text-center border border-border">
                  <p className="text-xs text-textMuted">탄수화물</p>
                  <p className="text-lg font-bold text-blue-400">{recommendation.carbs} g</p>
                </div>
                <div className="bg-surface p-3 rounded-lg text-center border border-border">
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
