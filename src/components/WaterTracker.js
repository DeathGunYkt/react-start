import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

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

const WaterGlass = styled.div`
  width: 150px;
  height: 250px;
  border: 3px solid #4CAF50;
  border-radius: 0 0 30px 30px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  background: #e0f2e0;
`;

const WaterFill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.percentage}%;
  background: linear-gradient(180deg, #4CAF50 0%, #2196F3 100%);
  transition: height 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
  text-align: center;
`;

const StatBox = styled.div`
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  
  h4 {
    color: #666;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  p {
    color: #4CAF50;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  background: ${props => props.danger ? '#ff6b6b' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: ${props => props.danger ? '#ff5252' : '#45a049'};
  }
`;

const QuickAddContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
`;

const QuickButton = styled.button`
  padding: 10px 15px;
  background: #e0f2e0;
  border: 2px solid #4CAF50;
  border-radius: 20px;
  color: #4CAF50;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #4CAF50;
    color: white;
  }
`;

const HistoryList = styled.div`
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  span:first-child {
    color: #666;
  }
  
  span:last-child {
    color: #4CAF50;
    font-weight: bold;
  }
`;

const WaterTracker = ({ userData }) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // мл
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date().toDateString());

  useEffect(() => {
    // Загружаем данные из localStorage
    const saved = loadFromLocalStorage('waterTracker');
    if (saved) {
      // Проверяем, не новый ли день
      if (saved.date === new Date().toDateString()) {
        setWaterIntake(saved.intake);
      } else {
        // Новый день - сохраняем в историю и обнуляем
        addToHistory(saved.intake, saved.date);
        setWaterIntake(0);
      }
      setHistory(saved.history || []);
    }

    // Рассчитываем норму воды на основе веса (30-40 мл на кг)
    if (userData.currentWeight) {
      const calculatedGoal = Math.round(parseFloat(userData.currentWeight) * 35);
      setDailyGoal(calculatedGoal);
    }
  }, [userData.currentWeight]);

  // Сохраняем данные при изменении
  useEffect(() => {
    saveToLocalStorage('waterTracker', {
      intake: waterIntake,
      date: new Date().toDateString(),
      history
    });
  }, [waterIntake, history]);

  const addToHistory = (amount, date) => {
    const newHistory = [
      { date, amount, goal: dailyGoal },
      ...history
    ].slice(0, 30); // храним 30 дней
    setHistory(newHistory);
  };

  const addWater = (amount) => {
    const newIntake = waterIntake + amount;
    setWaterIntake(newIntake);
    
    // Проверяем, не достигли ли цели
    if (newIntake >= dailyGoal && waterIntake < dailyGoal) {
      alert('🎉 Поздравляем! Вы выполнили дневную норму воды!');
    }
  };

  const resetWater = () => {
    if (waterIntake > 0) {
      addToHistory(waterIntake, lastUpdated);
      setWaterIntake(0);
      setLastUpdated(new Date().toDateString());
    }
  };

  const percentage = Math.min(100, Math.round((waterIntake / dailyGoal) * 100));

  return (
    <Container>
      <Title>Трекер воды 💧</Title>

      <WaterGlass>
        <WaterFill percentage={percentage}>
          {percentage}%
        </WaterFill>
      </WaterGlass>

      <StatsContainer>
        <StatBox>
          <h4>Выпито</h4>
          <p>{waterIntake} мл</p>
        </StatBox>
        <StatBox>
          <h4>Норма</h4>
          <p>{dailyGoal} мл</p>
        </StatBox>
        <StatBox>
          <h4>Осталось</h4>
          <p>{Math.max(0, dailyGoal - waterIntake)} мл</p>
        </StatBox>
      </StatsContainer>

      <QuickAddContainer>
        <QuickButton onClick={() => addWater(100)}>+100 мл</QuickButton>
        <QuickButton onClick={() => addWater(250)}>+250 мл</QuickButton>
        <QuickButton onClick={() => addWater(500)}>+500 мл</QuickButton>
      </QuickAddContainer>

      <ButtonGroup>
        <ActionButton onClick={() => addWater(200)}>
          🥤 Добавить стакан (200 мл)
        </ActionButton>
        <ActionButton danger onClick={resetWater}>
          🔄 Новый день
        </ActionButton>
      </ButtonGroup>

      {history.length > 0 && (
        <>
          <h4>История за последние дни:</h4>
          <HistoryList>
            {history.map((item, index) => (
              <HistoryItem key={index}>
                <span>{item.date}</span>
                <span>{item.amount} мл / {item.goal} мл ({Math.round((item.amount/item.goal)*100)}%)</span>
              </HistoryItem>
            ))}
          </HistoryList>
        </>
      )}
    </Container>
  );
};

export default WaterTracker;