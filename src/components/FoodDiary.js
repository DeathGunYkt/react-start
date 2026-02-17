import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDate, saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

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

const DateNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const DateButton = styled.button`
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const CurrentDate = styled.span`
  font-weight: bold;
  color: #333;
`;

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const MealCard = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#4CAF50'};
`;

const MealTitle = styled.h4`
  color: #333;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FoodItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const FoodName = styled.span`
  flex: 1;
`;

const FoodCalories = styled.span`
  color: #4CAF50;
  font-weight: bold;
  margin: 0 10px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: #ff4444;
  }
`;

const AddFoodForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const FoodInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const AddButton = styled.button`
  padding: 8px 15px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #45a049;
  }
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const SummaryItem = styled.div`
  h5 {
    font-size: 12px;
    opacity: 0.9;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }
`;

const FoodDiary = ({ userData, mealPlan }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState({});
  const [newFood, setNewFood] = useState({ meal: '', name: '', calories: '' });

  useEffect(() => {
    // Загружаем дневник из localStorage
    const saved = loadFromLocalStorage('foodDiary');
    if (saved) {
      setDiaryEntries(saved);
    }
  }, []);

  // Сохраняем дневник при изменениях
  useEffect(() => {
    saveToLocalStorage('foodDiary', diaryEntries);
  }, [diaryEntries]);

  const getDateKey = (date) => {
    return formatDate(date);
  };

  const currentDateKey = getDateKey(selectedDate);
  const currentDayEntries = diaryEntries[currentDateKey] || {
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
  };

  const addFood = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return;

    const updated = { ...diaryEntries };
    if (!updated[currentDateKey]) {
      updated[currentDateKey] = {
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: []
      };
    }

    updated[currentDateKey][newFood.meal].push({
      id: Date.now(),
      name: newFood.name,
      calories: parseInt(newFood.calories)
    });

    setDiaryEntries(updated);
    setNewFood({ meal: '', name: '', calories: '' });
  };

  const removeFood = (meal, foodId) => {
    const updated = { ...diaryEntries };
    updated[currentDateKey][meal] = updated[currentDateKey][meal].filter(
      food => food.id !== foodId
    );
    setDiaryEntries(updated);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Расчет статистики за день
  const calculateDailyStats = () => {
    let totalCalories = 0;
    let protein = 0, fat = 0, carbs = 0;

    Object.values(currentDayEntries).forEach(meals => {
      meals.forEach(food => {
        totalCalories += food.calories;
        // Упрощенный расчет БЖУ (можно усложнить позже)
        protein += Math.round(food.calories * 0.3 / 4);
        fat += Math.round(food.calories * 0.3 / 9);
        carbs += Math.round(food.calories * 0.4 / 4);
      });
    });

    return {
      total: totalCalories,
      protein,
      fat,
      carbs,
      remaining: userData.goal - totalCalories,
      percentage: Math.round((totalCalories / userData.goal) * 100) || 0
    };
  };

  const stats = calculateDailyStats();

  const meals = [
    { id: 'breakfast', name: 'Завтрак', color: '#FF9800', icon: '🍳' },
    { id: 'lunch', name: 'Обед', color: '#4CAF50', icon: '🍲' },
    { id: 'snack', name: 'Полдник', color: '#FFC107', icon: '🍎' },
    { id: 'dinner', name: 'Ужин', color: '#2196F3', icon: '🍽️' }
  ];

  return (
    <Container>
      <Title>Дневник питания</Title>

      <DateNavigation>
        <DateButton onClick={() => changeDate(-1)}>← Предыдущий</DateButton>
        <CurrentDate>{formatDate(selectedDate)}</CurrentDate>
        <DateButton onClick={() => changeDate(1)}>Следующий →</DateButton>
      </DateNavigation>

      <SummaryCard>
        <SummaryItem>
          <h5>Потреблено</h5>
          <p>{stats.total} ккал</p>
        </SummaryItem>
        <SummaryItem>
          <h5>Осталось</h5>
          <p>{stats.remaining} ккал</p>
        </SummaryItem>
        <SummaryItem>
          <h5>Выполнено</h5>
          <p>{stats.percentage}%</p>
        </SummaryItem>
      </SummaryCard>

      <MealGrid>
        {meals.map(meal => (
          <MealCard key={meal.id} color={meal.color}>
            <MealTitle>
              <span>{meal.icon} {meal.name}</span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {currentDayEntries[meal.id]?.reduce((sum, food) => sum + food.calories, 0) || 0} ккал
              </span>
            </MealTitle>

            {currentDayEntries[meal.id]?.map(food => (
              <FoodItem key={food.id}>
                <FoodName>{food.name}</FoodName>
                <FoodCalories>{food.calories} ккал</FoodCalories>
                <DeleteButton onClick={() => removeFood(meal.id, food.id)}>✕</DeleteButton>
              </FoodItem>
            ))}

            <AddFoodForm onSubmit={addFood}>
              <FoodInput
                type="text"
                placeholder="Название"
                value={newFood.meal === meal.id ? newFood.name : ''}
                onChange={(e) => setNewFood({ meal: meal.id, name: e.target.value, calories: newFood.calories })}
              />
              <FoodInput
                type="number"
                placeholder="ккал"
                style={{ width: '80px' }}
                value={newFood.meal === meal.id ? newFood.calories : ''}
                onChange={(e) => setNewFood({ meal: meal.id, name: newFood.name, calories: e.target.value })}
              />
              <AddButton type="submit">+</AddButton>
            </AddFoodForm>
          </MealCard>
        ))}
      </MealGrid>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          <strong>БЖУ за день:</strong> Белки: {stats.protein}г, 
          Жиры: {stats.fat}г, Углеводы: {stats.carbs}г
        </p>
      </div>
    </Container>
  );
};

export default FoodDiary;