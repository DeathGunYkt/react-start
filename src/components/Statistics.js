import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDate, getDaysOfWeek, calculateProgress } from '../utils/helpers';

const Container = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h4 {
    font-size: 14px;
    margin-bottom: 10px;
    opacity: 0.9;
  }
  
  p {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
  
  small {
    font-size: 12px;
    opacity: 0.8;
  }
`;

const ChartContainer = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  margin: 20px 0;
  padding: 10px;
  background: white;
  border-radius: 8px;
`;

const Bar = styled.div`
  width: 40px;
  background: ${props => props.color || '#4CAF50'};
  height: ${props => props.height}px;
  border-radius: 5px 5px 0 0;
  transition: height 0.3s ease;
  position: relative;
  
  &:hover::after {
    content: '${props => props.value}';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 3px 6px;
    border-radius: 3px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const PieChart = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${props => props.gradient};
  margin: 20px auto;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  
  span {
    width: 12px;
    height: 12px;
    background: ${props => props.color};
    border-radius: 3px;
  }
`;

const DateSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const DateButton = styled.button`
  padding: 5px 10px;
  background: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#e0e0e0'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const Statistics = ({ userData, mealPlan, diaryEntries }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [weightHistory, setWeightHistory] = useState([]);

  useEffect(() => {
    // Загружаем историю веса из localStorage
    const savedWeight = localStorage.getItem('weightHistory');
    if (savedWeight) {
      setWeightHistory(JSON.parse(savedWeight));
    } else {
      // Инициализируем с текущим весом
      const initial = [{
        date: new Date().toISOString(),
        weight: parseFloat(userData?.currentWeight || 0)
      }];
      setWeightHistory(initial);
      localStorage.setItem('weightHistory', JSON.stringify(initial));
    }
  }, [userData?.currentWeight]);

  // Добавление новой записи веса
  const addWeightEntry = (weight) => {
    const newEntry = {
      date: new Date().toISOString(),
      weight: parseFloat(weight)
    };
    const updated = [newEntry, ...weightHistory].slice(0, 30); // храним 30 записей
    setWeightHistory(updated);
    localStorage.setItem('weightHistory', JSON.stringify(updated));
  };

  // Расчет статистики
  const calculateStats = () => {
    if (!weightHistory || weightHistory.length === 0) return null;
    
    const firstWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
    const lastWeight = weightHistory[0]?.weight || 0;
    const totalLoss = firstWeight - lastWeight;
    const averageLoss = weightHistory.length > 1 ? totalLoss / weightHistory.length : 0;
    
    const targetDiff = parseFloat(userData?.currentWeight || 0) - parseFloat(userData?.desiredWeight || 0);
    const progress = targetDiff !== 0 ? calculateProgress(
      Math.abs(totalLoss),
      Math.abs(targetDiff)
    ) : 0;
    
    return {
      startWeight: firstWeight.toFixed(1),
      currentWeight: lastWeight.toFixed(1),
      totalLoss: totalLoss.toFixed(1),
      averageLoss: averageLoss.toFixed(2),
      progress,
      daysPassed: weightHistory.length
    };
  };

  // Расчет калорий по дням из дневника питания
  const getCaloriesByDay = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const calories = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDate(date);
      
      let dayCalories = 0;
      
      // Проверяем, есть ли записи для этой даты в дневнике
      if (diaryEntries && diaryEntries[dateKey]) {
        const dayMeals = diaryEntries[dateKey];
        // Суммируем калории из всех приемов пищи
        Object.values(dayMeals).forEach(meals => {
          if (Array.isArray(meals)) {
            meals.forEach(food => {
              dayCalories += food.calories || 0;
            });
          }
        });
      }
      
      calories.push({
        day: days[i],
        calories: dayCalories,
        target: userData?.goal || 2000
      });
    }
    
    return calories;
  };

  const stats = calculateStats();
  const weeklyCalories = getCaloriesByDay();
  const maxCalories = Math.max(...weeklyCalories.map(c => c.calories), userData?.goal || 2000);

  // Данные для круговой диаграммы БЖУ
  const macros = userData?.macros || {
    protein: 0,
    fat: 0,
    carbs: 0
  };
  
  const total = (macros.protein || 0) + (macros.fat || 0) + (macros.carbs || 0);
  const proteinPercentage = total > 0 ? ((macros.protein || 0) / total) * 100 : 33;
  const fatPercentage = total > 0 ? ((macros.fat || 0) / total) * 100 : 33;
  const carbsPercentage = total > 0 ? ((macros.carbs || 0) / total) * 100 : 34;

  const pieGradient = `conic-gradient(
    #4CAF50 0% ${proteinPercentage}%,
    #FFC107 ${proteinPercentage}% ${proteinPercentage + fatPercentage}%,
    #2196F3 ${proteinPercentage + fatPercentage}% 100%
  )`;

  return (
    <Container>
      <Title>Детальная статистика</Title>
      
      <DateSelector>
        <DateButton 
          active={timeRange === 'week'} 
          onClick={() => setTimeRange('week')}
        >
          Неделя
        </DateButton>
        <DateButton 
          active={timeRange === 'month'} 
          onClick={() => setTimeRange('month')}
        >
          Месяц
        </DateButton>
        <DateButton 
          active={timeRange === 'all'} 
          onClick={() => setTimeRange('all')}
        >
          Всё время
        </DateButton>
      </DateSelector>

      <StatsGrid>
        <StatCard>
          <h4>Текущий вес</h4>
          <p>{stats?.currentWeight || userData?.currentWeight || 0} кг</p>
          <small>Цель: {userData?.desiredWeight || 0} кг</small>
        </StatCard>
        
        <StatCard>
          <h4>Потеряно всего</h4>
          <p>{stats?.totalLoss || 0} кг</p>
          <small>За {stats?.daysPassed || 0} дней</small>
        </StatCard>
        
        <StatCard>
          <h4>Прогресс к цели</h4>
          <p>{stats?.progress || 0}%</p>
          <small>Осталось: {Math.abs((userData?.currentWeight || 0) - (userData?.desiredWeight || 0))} кг</small>
        </StatCard>
        
        <StatCard>
          <h4>Средняя потеря</h4>
          <p>{stats?.averageLoss || 0} кг/день</p>
          <small>≈ {((stats?.averageLoss || 0) * 7).toFixed(1)} кг/неделю</small>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <h4>Динамика веса</h4>
        <BarChart>
          {weightHistory.slice(0, 7).reverse().map((entry, index) => {
            const weights = weightHistory.map(w => w.weight);
            const minWeight = Math.min(...weights);
            const maxWeight = Math.max(...weights);
            const height = maxWeight > minWeight 
              ? ((entry.weight - minWeight) / (maxWeight - minWeight)) * 150 + 30
              : 100;
            
            return (
              <div key={index} style={{ textAlign: 'center' }}>
                <Bar 
                  height={height} 
                  value={`${entry.weight} кг`}
                  color="#4CAF50"
                />
                <DayLabel>{formatDate(entry.date).slice(0, 5)}</DayLabel>
              </div>
            );
          })}
        </BarChart>
      </ChartContainer>

      <ChartContainer>
        <h4>Потребление калорий по дням</h4>
        <BarChart>
          {weeklyCalories.map((day, index) => {
            const height = maxCalories > 0 ? (day.calories / maxCalories) * 150 : 0;
            
            return (
              <div key={index} style={{ textAlign: 'center' }}>
                <Bar 
                  height={height} 
                  value={`${day.calories} ккал`}
                  color={day.calories > day.target ? '#ff6b6b' : '#4CAF50'}
                />
                <DayLabel>{day.day}</DayLabel>
              </div>
            );
          })}
        </BarChart>
        <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          Целевая норма: {userData?.goal || 2000} ккал
        </p>
      </ChartContainer>

      <ChartContainer>
        <h4>Соотношение БЖУ</h4>
        <PieChart gradient={pieGradient} />
        <Legend>
          <LegendItem color="#4CAF50">
            <span /> Белки: {macros.protein || 0}г ({Math.round(proteinPercentage)}%)
          </LegendItem>
          <LegendItem color="#FFC107">
            <span /> Жиры: {macros.fat || 0}г ({Math.round(fatPercentage)}%)
          </LegendItem>
          <LegendItem color="#2196F3">
            <span /> Углеводы: {macros.carbs || 0}г ({Math.round(carbsPercentage)}%)
          </LegendItem>
        </Legend>
      </ChartContainer>

      <ChartContainer>
        <h4>Прогноз достижения цели</h4>
        {stats && (
          <>
            <p>Текущий вес: {stats.currentWeight} кг</p>
            <p>Целевой вес: {userData?.desiredWeight || 0} кг</p>
            <p>Средняя потеря в день: {stats.averageLoss} кг</p>
            <p>
              <strong>
                Осталось дней: {Math.ceil(
                  Math.abs((userData?.currentWeight || 0) - (userData?.desiredWeight || 0)) / 
                  Math.abs(parseFloat(stats.averageLoss) || 0.1)
                )}
              </strong>
            </p>
            <ProgressBar>
              <div 
                style={{
                  width: `${stats.progress}%`,
                  height: '20px',
                  background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }}
              />
            </ProgressBar>
          </>
        )}
      </ChartContainer>

      {/* Кнопка для добавления нового веса */}
      <Button onClick={() => {
        const newWeight = prompt('Введите текущий вес (кг):', userData?.currentWeight);
        if (newWeight) addWeightEntry(newWeight);
      }}>
        📝 Добавить запись веса
      </Button>
    </Container>
  );
};

export default Statistics;