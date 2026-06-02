import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { calculateWorkoutVolume } from '../utils/calculations';
import { format } from 'date-fns';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';

export const WorkoutLog = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyData, setDailyData] = useState(null);
  
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    weight: '',
    reps: '',
    sets: '',
    duration: '',
    intensity: '웨이트 중강도',
    memo: ''
  });

  useEffect(() => {
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

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.weight || !newWorkout.reps || !newWorkout.sets) return;

    const workoutEntry = {
      id: Date.now().toString(),
      name: newWorkout.name,
      weight: Number(newWorkout.weight),
      reps: Number(newWorkout.reps),
      sets: Number(newWorkout.sets),
      duration: Number(newWorkout.duration) || 0,
      intensity: newWorkout.intensity,
      memo: newWorkout.memo,
      volume: calculateWorkoutVolume(Number(newWorkout.weight), Number(newWorkout.reps), Number(newWorkout.sets))
    };

    const updated = {
      ...dailyData,
      workout: [...dailyData.workout, workoutEntry]
    };

    saveDailyData(updated);
    setNewWorkout({ name: '', weight: '', reps: '', sets: '', duration: '', intensity: '웨이트 중강도', memo: '' });
  };

  const handleDelete = (id) => {
    const updated = {
      ...dailyData,
      workout: dailyData.workout.filter(w => w.id !== id)
    };
    saveDailyData(updated);
  };

  if (!dailyData) return null;

  const totalVolume = dailyData.workout.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <Dumbbell className="text-primary" /> 운동 기록
        </h2>
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto"
        />
      </header>

      <Card>
        <h3 className="text-xl font-bold mb-4">새 운동 추가</h3>
        <form onSubmit={handleAddWorkout} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="운동 이름" placeholder="예: 벤치프레스" value={newWorkout.name} onChange={e => setNewWorkout({...newWorkout, name: e.target.value})} className="col-span-2 md:col-span-1" required />
          <Input label="무게 (kg)" type="number" placeholder="60" value={newWorkout.weight} onChange={e => setNewWorkout({...newWorkout, weight: e.target.value})} required />
          <Input label="반복 횟수" type="number" placeholder="10" value={newWorkout.reps} onChange={e => setNewWorkout({...newWorkout, reps: e.target.value})} required />
          <Input label="세트 수" type="number" placeholder="4" value={newWorkout.sets} onChange={e => setNewWorkout({...newWorkout, sets: e.target.value})} required />
          
          <Input label="운동 시간 (분)" type="number" placeholder="15" value={newWorkout.duration} onChange={e => setNewWorkout({...newWorkout, duration: e.target.value})} />
          <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <label className="text-sm font-medium text-textMuted ml-1">운동 강도</label>
            <select 
              className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={newWorkout.intensity}
              onChange={e => setNewWorkout({...newWorkout, intensity: e.target.value})}
            >
              <option value="웨이트 저강도">웨이트 저강도</option>
              <option value="웨이트 중강도">웨이트 중강도</option>
              <option value="웨이트 고강도">웨이트 고강도</option>
              <option value="유산소 걷기">유산소 걷기</option>
              <option value="러닝">러닝</option>
              <option value="자전거">자전거</option>
            </select>
          </div>
          <Input label="메모" placeholder="느낀점 등" value={newWorkout.memo} onChange={e => setNewWorkout({...newWorkout, memo: e.target.value})} className="col-span-2 md:col-span-2" />
          
          <div className="col-span-2 md:col-span-4 flex justify-end mt-2">
            <Button type="submit" className="flex items-center gap-2">
              <Plus size={20} /> 추가하기
            </Button>
          </div>
        </form>
      </Card>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold">오늘의 기록</h3>
        <div className="text-primary font-bold bg-primary/10 px-4 py-2 rounded-xl">
          총 볼륨: {totalVolume.toLocaleString()} kg
        </div>
      </div>

      <div className="space-y-3">
        {dailyData.workout.length === 0 ? (
          <p className="text-center text-textMuted py-8">아직 기록된 운동이 없습니다.</p>
        ) : (
          dailyData.workout.map(workout => (
            <Card key={workout.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-primary">{workout.name}</h4>
                <p className="text-textMuted text-sm mt-1">
                  {workout.weight}kg × {workout.reps}회 × {workout.sets}세트 = <span className="font-semibold text-text">{workout.volume.toLocaleString()}kg</span>
                </p>
                {(workout.duration > 0 || workout.memo) && (
                  <p className="text-xs text-textMuted mt-1">
                    {workout.duration > 0 && `${workout.duration}분 (${workout.intensity})`}
                    {workout.duration > 0 && workout.memo && ' | '}
                    {workout.memo}
                  </p>
                )}
              </div>
              <button 
                onClick={() => handleDelete(workout.id)}
                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
