import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Statistics from './Statistics';
import FoodDiary from './FoodDiary';
import WaterTracker from './WaterTracker';
import RecipeDetails from './RecipeDetails';
import ExportMenu from './ExportMenu';

const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const ResultCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #666;
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  p {
    color: #4CAF50;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
`;

const HistoryContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const HistoryItem = styled.div`
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProgressContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
`;

const Progress = styled.div`
  width: ${props => props.percentage}%;
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#e0e0e0'};
  }
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 10px;
    margin: 5px 0;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
  }
`;

const MealPlanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DayCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #4CAF50;
    margin-bottom: 15px;
    text-align: center;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 5px;
  }
`;

const MealItem = styled.div`
  margin: 10px 0;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 5px;
  
  strong {
    color: #666;
    display: block;
    margin-bottom: 5px;
  }
  
  p {
    margin: 0;
    color: #333;
  }
`;

const AllergyInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Chip = styled.span`
  display: inline-block;
  padding: 5px 10px;
  background: #e0e0e0;
  border-radius: 20px;
  margin: 5px;
  cursor: pointer;
  
  &:hover {
    background: #d0d0d0;
  }
`;

const Questionnaire = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('result');
  const [diaryEntries, setDiaryEntries] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    goal: '',
    age: '',
    height: '',
    currentWeight: '',
    desiredWeight: '',
    activity: '',
    restrictions: {
      diabetes: false,
      vegan: false,
      allergies: []
    },
    allergyInput: ''
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calorieHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (data) => {
    const newHistory = [data, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('calorieHistory', JSON.stringify(newHistory));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRestrictionChange = (e) => {
    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        [e.target.name]: e.target.checked
      }
    });
  };

  const handleAddAllergy = () => {
    if (formData.allergyInput.trim() && !formData.restrictions.allergies.includes(formData.allergyInput.trim())) {
      setFormData({
        ...formData,
        restrictions: {
          ...formData.restrictions,
          allergies: [...formData.restrictions.allergies, formData.allergyInput.trim()]
        },
        allergyInput: ''
      });
    }
  };

  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        allergies: formData.restrictions.allergies.filter(a => a !== allergy)
      }
    });
  };

  // База данных рецептов
  const recipeDatabase = {
    breakfast: [
      { name: 'Овсяная каша с ягодами', calories: 350, vegan: true, allergies: [], diabetes: 'medium' },
      { name: 'Яичница с овощами', calories: 400, vegan: false, allergies: ['яйца'], diabetes: 'low' },
      { name: 'Греческий йогурт с фруктами', calories: 300, vegan: false, allergies: ['молочные'], diabetes: 'medium' },
      { name: 'Тост с авокадо', calories: 450, vegan: true, allergies: ['глютен'], diabetes: 'medium' },
      { name: 'Смузи боул', calories: 380, vegan: true, allergies: [], diabetes: 'low' },
      { name: 'Творог с зеленью', calories: 320, vegan: false, allergies: ['молочные'], diabetes: 'low' }
    ],
    lunch: [
      { name: 'Куриная грудка с гречкой', calories: 500, vegan: false, allergies: [], diabetes: 'low' },
      { name: 'Рыба на пару с овощами', calories: 450, vegan: false, allergies: ['рыба'], diabetes: 'low' },
      { name: 'Чечевичный суп', calories: 380, vegan: true, allergies: [], diabetes: 'low' },
      { name: 'Паста с овощами', calories: 550, vegan: true, allergies: ['глютен'], diabetes: 'high' },
      { name: 'Киноа с овощами и тофу', calories: 420, vegan: true, allergies: ['соя'], diabetes: 'low' },
      { name: 'Индейка с бурым рисом', calories: 480, vegan: false, allergies: [], diabetes: 'low' }
    ],
    snack: [
      { name: 'Яблоко с орехами', calories: 200, vegan: true, allergies: ['орехи'], diabetes: 'medium' },
      { name: 'Протеиновый батончик', calories: 250, vegan: false, allergies: ['орехи', 'молочные'], diabetes: 'medium' },
      { name: 'Овощные палочки с хумусом', calories: 180, vegan: true, allergies: ['кунжут'], diabetes: 'low' },
      { name: 'Груша', calories: 100, vegan: true, allergies: [], diabetes: 'medium' },
      { name: 'Греческий йогурт', calories: 150, vegan: false, allergies: ['молочные'], diabetes: 'low' },
      { name: 'Ржаные хлебцы с авокадо', calories: 220, vegan: true, allergies: ['глютен'], diabetes: 'medium' }
    ],
    dinner: [
      { name: 'Лосось с овощами гриль', calories: 520, vegan: false, allergies: ['рыба'], diabetes: 'low' },
      { name: 'Тофу с овощами', calories: 400, vegan: true, allergies: ['соя'], diabetes: 'low' },
      { name: 'Овощное рагу с нутом', calories: 380, vegan: true, allergies: [], diabetes: 'low' },
      { name: 'Курица с киноа', calories: 480, vegan: false, allergies: [], diabetes: 'low' },
      { name: 'Гречка с грибами', calories: 350, vegan: true, allergies: [], diabetes: 'low' },
      { name: 'Рыбные котлеты', calories: 420, vegan: false, allergies: ['рыба', 'яйца'], diabetes: 'low' }
    ]
  };

  // Функция для фильтрации рецептов по ограничениям
  const filterRecipesByRestrictions = (recipes, restrictions, goal) => {
    return recipes.filter(recipe => {
      // Проверка на веганство
      if (restrictions.vegan && !recipe.vegan) return false;
      
      // Проверка на аллергии
      if (recipe.allergies.some(allergy => restrictions.allergies.includes(allergy))) return false;
      
      // Проверка на диабет (для диабетиков исключаем блюда с высоким ГИ)
      if (restrictions.diabetes && recipe.diabetes === 'high') return false;
      
      // Корректировка калорийности в зависимости от цели
      if (goal === 'weightLoss' && recipe.calories > 500) return false;
      if (goal === 'weightGain' && recipe.calories < 400) return false;
      
      return true;
    });
  };

  // Генерация недельного меню
  const generateMealPlan = (restrictions, goal) => {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    const mealPlan = {};
    
    days.forEach(day => {
      // Фильтруем рецепты для каждого приема пищи
      const breakfastOptions = filterRecipesByRestrictions(recipeDatabase.breakfast, restrictions, goal);
      const lunchOptions = filterRecipesByRestrictions(recipeDatabase.lunch, restrictions, goal);
      const snackOptions = filterRecipesByRestrictions(recipeDatabase.snack, restrictions, goal);
      const dinnerOptions = filterRecipesByRestrictions(recipeDatabase.dinner, restrictions, goal);
      
      // Выбираем случайные рецепты (или первые доступные, если мало вариантов)
      mealPlan[day] = {
        breakfast: breakfastOptions.length > 0 
          ? breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)] 
          : { name: 'Базовый завтрак (нет доступных вариантов)', calories: 0 },
        lunch: lunchOptions.length > 0 
          ? lunchOptions[Math.floor(Math.random() * lunchOptions.length)] 
          : { name: 'Базовый обед (нет доступных вариантов)', calories: 0 },
        snack: snackOptions.length > 0 
          ? snackOptions[Math.floor(Math.random() * snackOptions.length)] 
          : { name: 'Базовый перекус (нет доступных вариантов)', calories: 0 },
        dinner: dinnerOptions.length > 0 
          ? dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)] 
          : { name: 'Базовый ужин (нет доступных вариантов)', calories: 0 }
      };
    });
    
    return mealPlan;
  };

  const calculateMacros = (calories, goal) => {
    let protein, fat, carbs;
    
    switch(goal) {
      case 'weightLoss':
        protein = 0.4;
        fat = 0.3;
        carbs = 0.3;
        break;
      case 'weightMaintenance':
        protein = 0.3;
        fat = 0.3;
        carbs = 0.4;
        break;
      case 'weightGain':
        protein = 0.3;
        fat = 0.2;
        carbs = 0.5;
        break;
      default:
        protein = 0.3;
        fat = 0.3;
        carbs = 0.4;
    }
    
    return {
      protein: Math.round((calories * protein) / 4),
      fat: Math.round((calories * fat) / 9),
      carbs: Math.round((calories * carbs) / 4)
    };
  };

  const getRecommendations = (goal, restrictions) => {
    const recommendations = {
      weightLoss: [
        'Увеличьте потребление белка для сохранения мышечной массы',
        'Ешьте больше овощей и клетчатки',
        'Пейте достаточно воды (30-40 мл на кг веса)',
        'Ешьте маленькими порциями 5-6 раз в день',
        'Избегайте быстрых углеводов и сахара',
        'Добавьте кардио тренировки 3-4 раза в неделю'
      ],
      weightMaintenance: [
        'Поддерживайте баланс калорий',
        'Ешьте сложные углеводы для энергии',
        'Не забывайте про полезные жиры',
        'Включайте фрукты и овощи в каждый прием пищи',
        'Поддерживайте регулярную физическую активность',
        'Спите не менее 7-8 часов'
      ],
      weightGain: [
        'Увеличьте потребление белка до 2г на кг веса',
        'Добавьте сложные углеводы в каждый прием пищи',
        'Перекусывайте орехами и сухофруктами',
        'Сосредоточьтесь на силовых тренировках',
        'Ешьте бананы и другие калорийные фрукты',
        'Принимайте пищу каждые 3-4 часа'
      ]
    };
    
    let baseRecommendations = recommendations[goal] || [];
    
    // Добавляем рекомендации на основе ограничений
    if (restrictions.diabetes) {
      baseRecommendations = baseRecommendations.concat([
        'Контролируйте уровень сахара в крови',
        'Избегайте продуктов с высоким гликемическим индексом',
        'Ешьте регулярно, не пропускайте приемы пищи'
      ]);
    }
    
    if (restrictions.vegan) {
      baseRecommendations = baseRecommendations.concat([
        'Следите за достаточным потреблением белка из растительных источников',
        'Принимайте витамин B12 дополнительно',
        'Включайте в рацион бобовые, тофу, сейтан'
      ]);
    }
    
    if (restrictions.allergies.length > 0) {
      baseRecommendations.push('Внимательно читайте состав продуктов, избегайте аллергенов');
    }
    
    return baseRecommendations;
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.currentWeight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    const activityMultipliers = {
      'low': 1.2,
      'medium': 1.375,
      'high': 1.55
    };
    
    const maintenance = bmr * (activityMultipliers[formData.activity] || 1.2);
    
    let goalCalories = maintenance;
    if (formData.goal === 'weightLoss') {
      goalCalories = maintenance - 500;
    } else if (formData.goal === 'weightGain') {
      goalCalories = maintenance + 500;
    }
    
    const macros = calculateMacros(goalCalories, formData.goal);
    
    const weightDiff = parseFloat(formData.desiredWeight) - weight;
    const progressPercentage = weightDiff > 0 
      ? (weight / formData.desiredWeight) * 100
      : (formData.desiredWeight / weight) * 100;
    
    // Генерируем меню на основе ограничений
    const newMealPlan = generateMealPlan(formData.restrictions, formData.goal);
    setMealPlan(newMealPlan);
    
    const newResult = {
      maintenance: Math.round(maintenance),
      goal: Math.round(goalCalories),
      bmr: Math.round(bmr),
      macros,
      progressPercentage,
      weightDiff,
      ...formData,
      date: new Date().toLocaleDateString()
    };
    
    setResult(newResult);
    saveToHistory(newResult);
    setStep(2);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      gender: 'male',
      goal: '',
      age: '',
      height: '',
      currentWeight: '',
      desiredWeight: '',
      activity: '',
      restrictions: {
        diabetes: false,
        vegan: false,
        allergies: []
      },
      allergyInput: ''
    });
    setResult(null);
    setMealPlan(null);
    setActiveTab('result');
  };

  const loadFromHistory = (item) => {
    setResult(item);
    setMealPlan(generateMealPlan(item.restrictions, item.goal));
    setStep(2);
    setActiveTab('result');
  };

  if (step === 2 && result) {
    const recommendations = getRecommendations(result.goal, result.restrictions);
    
    return (
      <Container>
        <Title>Результаты для {result.name}</Title>
        
        <TabContainer>
          <Tab active={activeTab === 'result'} onClick={() => setActiveTab('result')}>
            Результаты
          </Tab>
          <Tab active={activeTab === 'statistics'} onClick={() => setActiveTab('statistics')}>
            Статистика
          </Tab>
          <Tab active={activeTab === 'diary'} onClick={() => setActiveTab('diary')}>
            Дневник
          </Tab>
          <Tab active={activeTab === 'water'} onClick={() => setActiveTab('water')}>
            Вода
          </Tab>
          <Tab active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')}>
            Рецепты
          </Tab>
          <Tab active={activeTab === 'mealplan'} onClick={() => setActiveTab('mealplan')}>
            Меню
          </Tab>
          <Tab active={activeTab === 'export'} onClick={() => setActiveTab('export')}>
            Экспорт
          </Tab>
          <Tab active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')}>
            Рекомендации
          </Tab>
        </TabContainer>
        
        {activeTab === 'result' && (
          <ResultContainer>
            <h2>Ваша цель: {
              result.goal === 'weightLoss' ? 'Похудение' :
              result.goal === 'weightMaintenance' ? 'Удержание веса' : 'Набор массы'
            }</h2>
            
            <ResultGrid>
              <ResultCard>
                <h3>Поддерживающие калории</h3>
                <p>{result.maintenance} ккал</p>
              </ResultCard>
              <ResultCard>
                <h3>Целевые калории</h3>
                <p>{result.goal} ккал</p>
              </ResultCard>
              <ResultCard>
                <h3>Базовый метаболизм</h3>
                <p>{result.bmr} ккал</p>
              </ResultCard>
            </ResultGrid>
            
            <h3>БЖУ (белки/жиры/углеводы):</h3>
            <ResultGrid>
              <ResultCard>
                <h3>Белки</h3>
                <p>{result.macros.protein} г</p>
              </ResultCard>
              <ResultCard>
                <h3>Жиры</h3>
                <p>{result.macros.fat} г</p>
              </ResultCard>
              <ResultCard>
                <h3>Углеводы</h3>
                <p>{result.macros.carbs} г</p>
              </ResultCard>
            </ResultGrid>
            
            <p>Текущий вес: {result.currentWeight} кг</p>
            <p>Желаемый вес: {result.desiredWeight} кг</p>
            <p>Уровень активности: {
              result.activity === 'low' ? 'Низкая' :
              result.activity === 'medium' ? 'Средняя' : 'Высокая'
            }</p>
            
            <h3>Ваши ограничения:</h3>
            <p>
              {result.restrictions.diabetes && '⚠️ Диабет '}
              {result.restrictions.vegan && '🌱 Веган '}
              {result.restrictions.allergies.length > 0 && `🚫 Аллергии: ${result.restrictions.allergies.join(', ')}`}
              {!result.restrictions.diabetes && !result.restrictions.vegan && result.restrictions.allergies.length === 0 && 'Нет ограничений'}
            </p>
            
            <Button onClick={resetForm}>Заполнить заново</Button>
          </ResultContainer>
        )}
        
        {activeTab === 'statistics' && (
          <Statistics 
            userData={result} 
            mealPlan={mealPlan}
            diaryEntries={diaryEntries}
          />
        )}
        
        {activeTab === 'diary' && (
          <FoodDiary 
            userData={result}
            mealPlan={mealPlan}
          />
        )}
        
        {activeTab === 'water' && (
          <WaterTracker userData={result} />
        )}
        
        {activeTab === 'recipes' && (
          <RecipeDetails 
            restrictions={result.restrictions}
            goal={result.goal}
          />
        )}
        
        {activeTab === 'mealplan' && mealPlan && (
          <ResultContainer>
            <h2>Ваше персональное меню на неделю</h2>
            <p>Учтены ваши ограничения: {
              result.restrictions.vegan && 'Веганство '
            }{
              result.restrictions.diabetes && 'Диабет '
            }{
              result.restrictions.allergies.length > 0 && `Аллергии на: ${result.restrictions.allergies.join(', ')}`
            }</p>
            <MealPlanContainer>
              {Object.entries(mealPlan).map(([day, meals]) => (
                <DayCard key={day}>
                  <h3>{day}</h3>
                  <MealItem>
                    <strong>Завтрак:</strong>
                    <p>{meals.breakfast.name} ({meals.breakfast.calories} ккал)</p>
                  </MealItem>
                  <MealItem>
                    <strong>Обед:</strong>
                    <p>{meals.lunch.name} ({meals.lunch.calories} ккал)</p>
                  </MealItem>
                  <MealItem>
                    <strong>Полдник:</strong>
                    <p>{meals.snack.name} ({meals.snack.calories} ккал)</p>
                  </MealItem>
                  <MealItem>
                    <strong>Ужин:</strong>
                    <p>{meals.dinner.name} ({meals.dinner.calories} ккал)</p>
                  </MealItem>
                </DayCard>
              ))}
            </MealPlanContainer>
            <Button onClick={() => setMealPlan(generateMealPlan(result.restrictions, result.goal))}>
              Сгенерировать новое меню
            </Button>
          </ResultContainer>
        )}
        
        {activeTab === 'export' && (
          <ExportMenu 
            mealPlan={mealPlan}
            userData={result}
          />
        )}
        
        {activeTab === 'recommendations' && (
          <ResultContainer>
            <h3>Персональные рекомендации:</h3>
            <RecommendationList>
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </RecommendationList>
          </ResultContainer>
        )}
        
        {history.length > 0 && (
          <HistoryContainer>
            <h3>История расчетов</h3>
            {history.map((item, index) => (
              <HistoryItem key={index} onClick={() => loadFromHistory(item)}>
                <div>
                  <strong>{item.name}</strong> - {item.date}
                </div>
                <div>
                  {item.goal === 'weightLoss' ? ' Похудение' : 
                   item.goal === 'weightMaintenance' ? ' Поддержание' : ' Набор массы'}
                </div>
              </HistoryItem>
            ))}
          </HistoryContainer>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Title>Калькулятор калорий</Title>
      <Form onSubmit={calculateCalories}>
        <FormGroup>
          <Label>Ваше имя</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Введите ваше имя"
          />
        </FormGroup>

        <FormGroup>
          <Label>Пол</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Мужской
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Женский
            </RadioLabel>
          </RadioGroup>
        </FormGroup>

        <FormGroup>
          <Label>Ваша цель</Label>
          <Select name="goal" value={formData.goal} onChange={handleChange} required>
            <option value="">Выберите цель</option>
            <option value="weightLoss">Похудение</option>
            <option value="weightMaintenance">Удержание веса</option>
            <option value="weightGain">Набор массы</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Возраст (лет)</Label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            max="120"
            placeholder="Ваш возраст"
          />
        </FormGroup>

        <FormGroup>
          <Label>Рост (см)</Label>
          <Input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            min="100"
            max="250"
            placeholder="Ваш рост"
          />
        </FormGroup>

        <FormGroup>
          <Label>Текущий вес (кг)</Label>
          <Input
            type="number"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleChange}
            required
            min="20"
            max="300"
            step="0.1"
            placeholder="Ваш текущий вес"
          />
        </FormGroup>

        <FormGroup>
          <Label>Желаемый вес (кг)</Label>
          <Input
            type="number"
            name="desiredWeight"
            value={formData.desiredWeight}
            onChange={handleChange}
            required
            min="20"
            max="300"
            step="0.1"
            placeholder="Ваш желаемый вес"
          />
        </FormGroup>

        <FormGroup>
          <Label>Физическая активность</Label>
          <Select name="activity" value={formData.activity} onChange={handleChange} required>
            <option value="">Выберите уровень активности</option>
            <option value="low">Низкая (сидячая работа, мало движений)</option>
            <option value="medium">Средняя (тренировки 3-4 раза в неделю)</option>
            <option value="high">Высокая (интенсивные тренировки 5+ раз в неделю)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Ограничения питания</Label>
          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="diabetes"
                checked={formData.restrictions.diabetes}
                onChange={handleRestrictionChange}
              />
              Диабет
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="vegan"
                checked={formData.restrictions.vegan}
                onChange={handleRestrictionChange}
              />
              Веганство
            </CheckboxLabel>
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>Аллергии (введите продукт и нажмите Enter)</Label>
          <AllergyInput>
            <Input
              type="text"
              value={formData.allergyInput}
              onChange={(e) => setFormData({...formData, allergyInput: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
              placeholder="Например: орехи, молоко, яйца"
            />
            <Button type="button" onClick={handleAddAllergy}>Добавить</Button>
          </AllergyInput>
          <div>
            {formData.restrictions.allergies.map(allergy => (
              <Chip key={allergy} onClick={() => handleRemoveAllergy(allergy)}>
                {allergy} ✕
              </Chip>
            ))}
          </div>
        </FormGroup>

        <Button type="submit">Рассчитать калории и составить меню</Button>
      </Form>
      
      {history.length > 0 && (
        <HistoryContainer>
          <h3>Недавние расчеты</h3>
          {history.slice(0, 3).map((item, index) => (
            <HistoryItem key={index} onClick={() => loadFromHistory(item)}>
              <div>
                <strong>{item.name}</strong> - {item.date}
              </div>
              <div>
                {item.goal === 'weightLoss' ? ' Похудение' : 
                 item.goal === 'weightMaintenance' ? ' Поддержание' : ' Набор массы'}
              </div>
            </HistoryItem>
          ))}
        </HistoryContainer>
      )}
    </Container>
  );
};

export default Questionnaire;