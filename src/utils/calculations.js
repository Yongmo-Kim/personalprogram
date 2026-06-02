export const calculateWorkoutVolume = (weight, reps, sets) => {
  return weight * reps * sets;
};

// 기초대사량(BMR) 계산 - Mifflin-St Jeor 공식
export const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

// 운동 강도별 1시간당 대략적인 칼로리 소모량 (몸무게 기반 추정치)
// MET(Metabolic Equivalent of Task) 활용 추정
const MET_VALUES = {
  '웨이트 저강도': 3.0,
  '웨이트 중강도': 4.5,
  '웨이트 고강도': 6.0,
  '유산소 걷기': 3.8,
  '러닝': 7.0,
  '자전거': 6.0,
};

export const calculateExerciseCalories = (type, durationMinutes, weight) => {
  const met = MET_VALUES[type] || 4.0;
  // 칼로리 소모 = MET * 체중(kg) * 시간(시간)
  const durationHours = durationMinutes / 60;
  return Math.round(met * weight * durationHours);
};

export const recommendMacros = (goal, weight, maintenanceCalories) => {
  let targetCalories = maintenanceCalories;
  
  if (goal === '벌크업') {
    targetCalories += 400; // 유지 칼로리 + 400kcal
  } else if (goal === '다이어트') {
    targetCalories -= 400; // 유지 칼로리 - 400kcal
  }
  
  // 단백질: 몸무게 kg당 1.8g (일반적인 추천량)
  const targetProtein = Math.round(weight * 1.8);
  
  // 지방: 총 칼로리의 25%
  const targetFat = Math.round((targetCalories * 0.25) / 9);
  
  // 탄수화물: 나머지 칼로리
  const remainingCalories = targetCalories - (targetProtein * 4) - (targetFat * 9);
  const targetCarbs = Math.round(remainingCalories / 4);
  
  return {
    calories: Math.round(targetCalories),
    protein: targetProtein,
    fat: targetFat,
    carbs: targetCarbs
  };
};
