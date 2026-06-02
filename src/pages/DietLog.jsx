import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { INITIAL_USER_SETTINGS } from '../data/mockData';
import { recommendMacros } from '../utils/calculations';
import { format } from 'date-fns';
import { Utensils, Plus, Trash2 } from 'lucide-react';

export const DietLog = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyData, setDailyData] = useState(null);
  const [settings, setSettings] = useState(INITIAL_USER_SETTINGS);
  
  const [newFood, setNewFood] = useState({
    meal: '아침',
    name: '',
    carbs: '',
    protein: '',
    fat: '',
    calories: ''
  });

  useEffect(() => {
    const savedSettings = loadData('userSettings', INITIAL_USER_SETTINGS);
    setSettings(savedSettings);

    const allData = loadData('dailyData', {});
    const today = allData[date] || { workout: [], diet: [], sleep: { duration: 0, quality: '' } };
    setDailyData(today);
  }, [date]);

  const saveDailyData = (updatedDayData) => {
    const allData = loadData('dailyData', {});
    allData[date] = updatedDayData;
    saveData('dailyData', allData);
    setDailyData(updatedDayData);
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name) return;

    const carbs = Number(newFood.carbs) || 0;
    const protein = Number(newFood.protein) || 0;
    const fat = Number(newFood.fat) || 0;
    
    // Auto calculate calories if not provided
    const calculatedCalories = (carbs * 4) + (protein * 4) + (fat * 9);
    const calories = Number(newFood.calories) || calculatedCalories;

    const foodEntry = {
      id: Date.now().toString(),
      meal: newFood.meal,
      name: newFood.name,
      carbs,
      protein,
      fat,
      calories
    };

    const updated = {
      ...dailyData,
      diet: [...dailyData.diet, foodEntry]
    };

    saveDailyData(updated);
    setNewFood({ meal: '아침', name: '', carbs: '', protein: '', fat: '', calories: '' });
  };

  const handleDelete = (id) => {
    const updated = {
      ...dailyData,
      diet: dailyData.diet.filter(d => d.id !== id)
    };
    saveDailyData(updated);
  };

  if (!dailyData) return null;

  const totalCarbs = dailyData.diet.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalProtein = dailyData.diet.reduce((acc, curr) => acc + curr.protein, 0);
  const totalFat = dailyData.diet.reduce((acc, curr) => acc + curr.fat, 0);
  const totalCalories = dailyData.diet.reduce((acc, curr) => acc + curr.calories, 0);

  const maintenanceCals = 2000; // Simplified
  const recommended = recommendMacros(settings.goal, settings.weight, maintenanceCals);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <Utensils className="text-secondary" /> 식단 기록
        </h2>
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto"
        />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-textMuted">총 칼로리</p>
          <p className="text-2xl font-bold mt-1 text-red-400">{totalCalories.toLocaleString()}</p>
          <p className="text-xs text-textMuted mt-1">/ {recommended.calories} kcal</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-textMuted">탄수화물</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">{totalCarbs}g</p>
          <p className="text-xs text-textMuted mt-1">/ {recommended.carbs}g</p>
        </Card>
        <Card className="text-center border border-secondary">
          <p className="text-sm text-secondary">단백질</p>
          <p className="text-2xl font-bold mt-1 text-secondary">{totalProtein}g</p>
          <p className="text-xs text-textMuted mt-1">/ {recommended.protein}g</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-textMuted">지방</p>
          <p className="text-2xl font-bold mt-1 text-yellow-400">{totalFat}g</p>
          <p className="text-xs text-textMuted mt-1">/ {recommended.fat}g</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold mb-4">음식 추가</h3>
        <form onSubmit={handleAddFood} className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-textMuted ml-1">식사</label>
            <select 
              className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={newFood.meal}
              onChange={e => setNewFood({...newFood, meal: e.target.value})}
            >
              <option value="아침">아침</option>
              <option value="점심">점심</option>
              <option value="저녁">저녁</option>
              <option value="간식">간식</option>
            </select>
          </div>
          <Input label="음식 이름" placeholder="닭가슴살" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} className="col-span-2 md:col-span-2" required />
          <Input label="탄수화물 (g)" type="number" placeholder="0" value={newFood.carbs} onChange={e => setNewFood({...newFood, carbs: e.target.value})} className="col-span-1" />
          <Input label="단백질 (g)" type="number" placeholder="23" value={newFood.protein} onChange={e => setNewFood({...newFood, protein: e.target.value})} className="col-span-1" />
          <Input label="지방 (g)" type="number" placeholder="1" value={newFood.fat} onChange={e => setNewFood({...newFood, fat: e.target.value})} className="col-span-1" />
          
          <div className="col-span-2 md:col-span-6 flex justify-between items-end">
            <Input label="총 칼로리 (선택, 비워두면 자동 계산)" type="number" placeholder="kcal" value={newFood.calories} onChange={e => setNewFood({...newFood, calories: e.target.value})} className="w-full md:w-1/3" />
            <Button type="submit" variant="secondary" className="flex items-center gap-2">
              <Plus size={20} /> 추가
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {['아침', '점심', '저녁', '간식'].map(mealType => {
          const meals = dailyData.diet.filter(d => d.meal === mealType);
          if (meals.length === 0) return null;
          
          return (
            <div key={mealType}>
              <h4 className="font-bold text-lg mb-2 pl-1 border-l-4 border-secondary">{mealType}</h4>
              <div className="space-y-2">
                {meals.map(food => (
                  <Card key={food.id} className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-bold text-text">{food.name}</p>
                      <p className="text-sm text-textMuted mt-1">
                        탄 {food.carbs}g | 단 <span className="text-secondary font-semibold">{food.protein}g</span> | 지 {food.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{food.calories} kcal</span>
                      <button 
                        onClick={() => handleDelete(food.id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        {dailyData.diet.length === 0 && (
          <p className="text-center text-textMuted py-8">아직 기록된 식단이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
