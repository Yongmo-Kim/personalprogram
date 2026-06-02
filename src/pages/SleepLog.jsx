import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { format } from 'date-fns';
import { Moon, Save } from 'lucide-react';

export const SleepLog = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyData, setDailyData] = useState(null);
  const [sleepData, setSleepData] = useState({
    duration: '',
    quality: '보통',
    memo: ''
  });

  useEffect(() => {
    const allData = loadData('dailyData', {});
    const today = allData[date] || { workout: [], diet: [], sleep: { duration: 0, quality: '', memo: '' } };
    setDailyData(today);
    
    if (today.sleep && today.sleep.duration > 0) {
      setSleepData({
        duration: today.sleep.duration.toString(),
        quality: today.sleep.quality || '보통',
        memo: today.sleep.memo || ''
      });
    } else {
      setSleepData({ duration: '', quality: '보통', memo: '' });
    }
  }, [date]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!sleepData.duration) return;

    const updated = {
      ...dailyData,
      sleep: {
        duration: Number(sleepData.duration),
        quality: sleepData.quality,
        memo: sleepData.memo
      }
    };

    const allData = loadData('dailyData', {});
    allData[date] = updated;
    saveData('dailyData', allData);
    setDailyData(updated);
    
    alert('수면 기록이 저장되었습니다.');
  };

  if (!dailyData) return null;

  // Feedback logic
  let feedbackMsg = "수면 시간을 기록해주세요.";
  const dur = Number(sleepData.duration);
  if (dur > 0) {
    if (dur < 6) {
      feedbackMsg = "⚠️ 수면 시간이 6시간 미만입니다. 근성장과 회복이 지연될 수 있으니 오늘 밤은 더 일찍 주무시는 것을 권장합니다.";
    } else if (dur >= 7 && dur <= 9) {
      feedbackMsg = "✅ 아주 좋습니다! 7~9시간의 수면은 근성장과 피로 회복에 최적입니다.";
    } else if (dur > 9) {
      feedbackMsg = "충분한 수면을 취하셨네요. 다만 너무 긴 수면은 오히려 무기력증을 유발할 수 있습니다.";
    } else {
      feedbackMsg = "수면 시간이 약간 부족합니다. 7시간 이상 자는 것을 목표로 해보세요.";
    }
  }

  const hasHighIntensity = dailyData.workout.some(w => w.intensity === '웨이트 고강도');
  if (hasHighIntensity) {
    feedbackMsg += " (💡 오늘은 고강도 운동을 하셨으므로 충분한 수면이 더욱 중요합니다!)";
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <Moon className="text-indigo-400" /> 수면 기록
        </h2>
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto"
        />
      </header>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="총 수면 시간 (시간)" 
              type="number" 
              step="0.5"
              placeholder="예: 7.5" 
              value={sleepData.duration} 
              onChange={e => setSleepData({...sleepData, duration: e.target.value})} 
              required 
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-textMuted ml-1">수면 질 평가</label>
              <select 
                className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={sleepData.quality}
                onChange={e => setSleepData({...sleepData, quality: e.target.value})}
              >
                <option value="좋음">😊 좋음 (개운함)</option>
                <option value="보통">😐 보통 (그저 그럼)</option>
                <option value="나쁨">😫 나쁨 (피곤함)</option>
              </select>
            </div>
            
            <Input 
              label="메모" 
              placeholder="자다가 깼다, 꿈을 많이 꿨다 등" 
              value={sleepData.memo} 
              onChange={e => setSleepData({...sleepData, memo: e.target.value})} 
              className="md:col-span-2"
            />
          </div>
          
          <Button type="submit" className="w-full flex justify-center items-center gap-2 py-3">
            <Save size={20} /> 저장하기
          </Button>
        </form>
      </Card>

      <Card className="bg-indigo-900/20 border-indigo-500/30">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-300">
          <Moon size={24} /> 수면 피드백
        </h3>
        <p className="text-lg leading-relaxed">
          {feedbackMsg}
        </p>
      </Card>
    </div>
  );
};
