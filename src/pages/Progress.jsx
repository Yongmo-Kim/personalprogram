import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { loadData } from '../utils/storage';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const Progress = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const allData = loadData('dailyData', {});
    
    // Generate last 7 days including today
    const endDate = new Date();
    const startDate = subDays(endDate, 6);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const formattedData = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = allData[dateStr] || { workout: [], diet: [], sleep: { duration: 0 } };
      
      const volume = dayData.workout.reduce((acc, curr) => acc + curr.volume, 0);
      const calories = dayData.diet.reduce((acc, curr) => acc + curr.calories, 0);
      const protein = dayData.diet.reduce((acc, curr) => acc + curr.protein, 0);
      const sleep = dayData.sleep.duration || 0;

      return {
        date: format(date, 'MM/dd'),
        볼륨: volume,
        칼로리: calories,
        단백질: protein,
        수면: sleep
      };
    });

    setChartData(formattedData);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
          <p className="text-text font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()} {entry.name === '수면' ? 'hr' : entry.name === '볼륨' ? 'kg' : entry.name === '단백질' ? 'g' : 'kcal'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-text flex items-center gap-2">
          <TrendingUp className="text-emerald-400" /> 주간 진행 상황
        </h2>
        <p className="text-textMuted mt-1">최근 7일간의 변화를 확인하세요.</p>
      </header>

      <div className="grid gap-6">
        <Card>
          <h3 className="text-lg font-bold mb-4">운동 볼륨 변화 (kg)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="볼륨" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4">섭취 칼로리 (kcal)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="칼로리" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold mb-4">단백질 섭취량 (g)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="단백질" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-bold mb-4">수면 시간 (hr)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="step" dataKey="수면" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
