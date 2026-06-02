import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { loadData, saveData } from '../utils/storage';
import { DEFAULT_WEEKLY_SCHEDULE } from '../data/mockData';
import { Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_LABELS = {
  Monday: '월요일',
  Tuesday: '화요일',
  Wednesday: '수요일',
  Thursday: '목요일',
  Friday: '금요일',
  Saturday: '토요일',
  Sunday: '일요일'
};

export const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState(DEFAULT_WEEKLY_SCHEDULE);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = loadData('weeklySchedule', DEFAULT_WEEKLY_SCHEDULE);
    setSchedule(saved);
  }, []);

  const handleChange = (day, value) => {
    setSchedule(prev => ({ ...prev, [day]: value }));
  };

  const handleSave = () => {
    saveData('weeklySchedule', schedule);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <Calendar className="text-primary" /> 주간 운동 일정
        </h2>
        {isEditing ? (
          <Button onClick={handleSave} variant="secondary">저장하기</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>수정하기</Button>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {DAYS.map(day => (
          <Card key={day} className={isEditing ? 'border-primary' : ''}>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg text-primary">{DAY_LABELS[day]}</label>
              {isEditing ? (
                <Input
                  value={schedule[day]}
                  onChange={(e) => handleChange(day, e.target.value)}
                  placeholder="예: 가슴, 등, 휴식 등"
                />
              ) : (
                <p className="text-text py-2 px-1 text-lg bg-background rounded-lg border border-border mt-1">
                  {schedule[day] || '휴식'}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
