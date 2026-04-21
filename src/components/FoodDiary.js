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
  background: #F5F5F5;
  border-radius: 8px;
`;

const DateButton = styled.button`
  padding: 8px 12px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #1B5E20;
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
  background: #F5F5F5;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#2E7D32'};
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
    background: #F5F5F5;
  }
`;

const FoodName = styled.span`
  flex: 1;
`;

const FoodCalories = styled.span`
  color: #F57C00;
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

const AddFoodForm = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const FoodInput = styled.input`
  flex: 2;
  min-width: 100px;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2E7D32;
  }
`;

const CaloriesInput = styled.input`
  width: 70px;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2E7D32;
  }
`;

const AddButton = styled.button`
  padding: 8px 15px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #1B5E20;
  }
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #2E7D32 0%, #F57C00 100%);
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
  
  // Отдельное состояние для каждого приёма пищи
  const [newFoodName, setNewFoodName] = useState({
    breakfast: '',
    lunch: '',
    snack: '',
    dinner: ''
  });
  const [newFoodCalories, setNewFoodCalories] = useState({
    breakfast: '',
    lunch: '',
    snack: '',
    dinner: ''
  });

  useEffect(() => {
    const saved = loadFromLocalStorage('foodDiary');
    if (saved) {
      setDiaryEntries(saved);
    }
  }, []);

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

  const addFood = (mealType) => {
    const name = newFoodName[mealType];
    const calories = newFoodCalories[mealType];
    
    if (!name || !calories) return;

    const updated = { ...diaryEntries };
    if (!updated[currentDateKey]) {
      updated[currentDateKey] = {
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: []
      };
    }

    updated[currentDateKey][mealType].push({
      id: Date.now(),
      name: name,
      calories: parseInt(calories)
    });

    setDiaryEntries(updated);
    
    // Очищаем только поля для этого приёма пищи
    setNewFoodName({ ...newFoodName, [mealType]: '' });
    setNewFoodCalories({ ...newFoodCalories, [mealType]: '' });
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

  const calculateDailyStats = () => {
    let totalCalories = 0;
    let protein = 0, fat = 0, carbs = 0;

    Object.values(currentDayEntries).forEach(meals => {
      if (Array.isArray(meals)) {
        meals.forEach(food => {
          totalCalories += food.calories || 0;
          protein += Math.round((food.calories || 0) * 0.3 / 4);
          fat += Math.round((food.calories || 0) * 0.3 / 9);
          carbs += Math.round((food.calories || 0) * 0.4 / 4);
        });
      }
    });

    const goal = userData?.goal || 2000;
    
    return {
      total: totalCalories,
      protein,
      fat,
      carbs,
      remaining: goal - totalCalories,
      percentage: Math.round((totalCalories / goal) * 100) || 0
    };
  };

  const stats = calculateDailyStats();

  const meals = [
    { id: 'breakfast', name: 'Завтрак', color: '#FF9800', icon: '🍳' },
    { id: 'lunch', name: 'Обед', color: '#2E7D32', icon: '🍲' },
    { id: 'snack', name: 'Полдник', color: '#F57C00', icon: '🍎' },
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
          <p>{stats.remaining > 0 ? stats.remaining : 0} ккал</p>
        </SummaryItem>
        <SummaryItem>
          <h5>Выполнено</h5>
          <p>{stats.percentage}%</p>
        </SummaryItem>
      </SummaryCard>

      <MealGrid>
        {meals.map(meal => {
          const mealEntries = currentDayEntries[meal.id] || [];
          const mealTotal = mealEntries.reduce((sum, food) => sum + (food.calories || 0), 0);
          
          return (
            <MealCard key={meal.id} color={meal.color}>
              <MealTitle>
                <span>{meal.icon} {meal.name}</span>
                <span style={{ fontSize: '14px', color: '#F57C00' }}>
                  {mealTotal} ккал
                </span>
              </MealTitle>

              {mealEntries.map(food => (
                <FoodItem key={food.id}>
                  <FoodName>{food.name}</FoodName>
                  <FoodCalories>{food.calories} ккал</FoodCalories>
                  <DeleteButton onClick={() => removeFood(meal.id, food.id)}>✕</DeleteButton>
                </FoodItem>
              ))}

              <AddFoodForm>
                <FoodInput
                  type="text"
                  placeholder="Название блюда"
                  value={newFoodName[meal.id]}
                  onChange={(e) => setNewFoodName({ ...newFoodName, [meal.id]: e.target.value })}
                />
                <CaloriesInput
                  type="number"
                  placeholder="ккал"
                  value={newFoodCalories[meal.id]}
                  onChange={(e) => setNewFoodCalories({ ...newFoodCalories, [meal.id]: e.target.value })}
                />
                <AddButton onClick={() => addFood(meal.id)}>+ Добавить</AddButton>
              </AddFoodForm>
            </MealCard>
          );
        })}
      </MealGrid>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666' }}>
          <strong>БЖУ за день:</strong> Белки: {stats.protein}г, 
          Жиры: {stats.fat}г, Углеводы: {stats.carbs}г
        </p>
      </div>
    </Container>
  );
};

export default FoodDiary;