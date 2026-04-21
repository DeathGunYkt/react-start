import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Questionnaire from './components/Questionnaire';
import Login from './components/Login';
import Register from './components/Register';
import FoodDiary from './components/FoodDiary';
import WaterTracker from './components/WaterTracker';
import Statistics from './components/Statistics';
import RecipeDetails from './components/RecipeDetails';
import ExportMenu from './components/ExportMenu';

// Стили для рекомендаций
const ResultContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #F5F5F5;
  border-radius: 8px;
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 10px;
    margin: 5px 0;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #2E7D32;
  }
`;

// База данных рецептов для генерации меню
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

// Фильтрация рецептов по ограничениям
const filterRecipesByRestrictions = (recipes, restrictions, goal) => {
  if (!restrictions) return recipes;
  return recipes.filter(recipe => {
    if (restrictions.vegan && !recipe.vegan) return false;
    if (recipe.allergies && restrictions.allergies && 
        recipe.allergies.some(allergy => restrictions.allergies.includes(allergy))) return false;
    if (restrictions.diabetes && recipe.diabetes === 'high') return false;
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
    const breakfastOptions = filterRecipesByRestrictions(recipeDatabase.breakfast, restrictions, goal);
    const lunchOptions = filterRecipesByRestrictions(recipeDatabase.lunch, restrictions, goal);
    const snackOptions = filterRecipesByRestrictions(recipeDatabase.snack, restrictions, goal);
    const dinnerOptions = filterRecipesByRestrictions(recipeDatabase.dinner, restrictions, goal);
    
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

// Функция получения рекомендаций
const getRecommendations = (goal, restrictions) => {
  if (!restrictions) restrictions = { diabetes: false, vegan: false, allergies: [] };
  
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

// Компонент шапки
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 30px',
      background: '#2E7D32',
      color: 'white'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        🍏 NutriSmart
      </Link>
      
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>👋 {user.name}</span>
          <button onClick={handleLogout} style={{
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>Выйти</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login">
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Войти</button>
          </Link>
          <Link to="/register">
            <button style={{
              padding: '8px 16px',
              background: '#F57C00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Регистрация</button>
          </Link>
        </div>
      )}
    </div>
  );
};

// Компонент для защищённых вкладок
const ProtectedTab = ({ children, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', background: '#F5F5F5', borderRadius: '15px' }}>
        <h3 style={{ color: '#F57C00' }}>🔒 Доступ ограничен</h3>
        <p>Чтобы использовать "{title}", пожалуйста, <button onClick={() => navigate('/login')} style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>войдите</button> или <button onClick={() => navigate('/register')} style={{ color: '#F57C00', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>зарегистрируйтесь</button></p>
      </div>
    );
  }

  return children;
};

// Главный компонент
const MainPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calculator');
  const [result, setResult] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  // Вкладки
  const tabs = [
    { id: 'calculator', name: '📊 Калькулятор', protected: false },
    { id: 'result', name: '📈 Результаты', protected: false },
    { id: 'recommendations', name: '💡 Рекомендации', protected: false }
  ];

  const protectedTabs = [
    { id: 'diary', name: '📔 Дневник', protected: true },
    { id: 'water', name: '💧 Вода', protected: true },
    { id: 'statistics', name: '📊 Статистика', protected: true },
    { id: 'recipes', name: '🍳 Рецепты', protected: true },
    { id: 'mealplan', name: '📅 Меню', protected: true },
    { id: 'export', name: '📥 Экспорт', protected: true }
  ];

  const allTabs = [...tabs, ...protectedTabs];

  const TabButton = ({ tab }) => {
    const isProtected = tab.protected && !user;
    
    return (
      <button
        onClick={() => !isProtected && setActiveTab(tab.id)}
        style={{
          padding: '10px 20px',
          background: activeTab === tab.id ? '#2E7D32' : '#f0f0f0',
          color: activeTab === tab.id ? 'white' : '#333',
          border: 'none',
          borderRadius: '8px',
          cursor: isProtected ? 'not-allowed' : 'pointer',
          opacity: isProtected ? 0.5 : 1,
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
      >
        {tab.name} {isProtected && '🔒'}
      </button>
    );
  };

  // Функция обновления меню
  const handleRegenerateMealPlan = () => {
    if (result) {
      const newMealPlan = generateMealPlan(result.restrictions, result.goal);
      setMealPlan(newMealPlan);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Логотип */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <span style={{ fontSize: '48px' }}>🍏🥗</span>
          <h2 style={{ color: '#2E7D32', margin: '10px 0 5px', fontSize: '28px' }}>
            NutriSmart
          </h2>
          <p style={{ color: '#F57C00', fontSize: '14px', margin: 0 }}>
            Персональный AI-помощник по питанию
          </p>
        </div>

        {/* Вкладки */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {allTabs.map(tab => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </div>

        {/* Контент вкладок */}
        {activeTab === 'calculator' && (
          <Questionnaire 
            onResultCalculated={(res, plan) => {
              setResult(res);
              setMealPlan(plan);
              setActiveTab('result');
            }}
            isLoggedIn={!!user}
          />
        )}

        {activeTab === 'result' && result && (
          <ResultContainer>
            <h2 style={{ textAlign: 'center', color: '#2E7D32' }}>Ваши результаты</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div style={{ background: '#F5F5F5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>Поддерживающие калории</h3>
                <p style={{ fontSize: '24px', color: '#F57C00', fontWeight: 'bold' }}>{result?.maintenance || 0} ккал</p>
              </div>
              <div style={{ background: '#F5F5F5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>Целевые калории</h3>
                <p style={{ fontSize: '24px', color: '#F57C00', fontWeight: 'bold' }}>{result?.goal || 0} ккал</p>
              </div>
              <div style={{ background: '#F5F5F5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>Базовый метаболизм</h3>
                <p style={{ fontSize: '24px', color: '#F57C00', fontWeight: 'bold' }}>{result?.bmr || 0} ккал</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('calculator')} style={{ padding: '10px 20px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Заполнить заново</button>
          </ResultContainer>
        )}

        {activeTab === 'recommendations' && result && (
          <ResultContainer>
            <h3>Персональные рекомендации:</h3>
            <RecommendationList>
              {getRecommendations(result.goal, result.restrictions).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </RecommendationList>
          </ResultContainer>
        )}

        {activeTab === 'diary' && (
          <ProtectedTab title="Дневник питания">
            <FoodDiary userData={result} mealPlan={mealPlan} />
          </ProtectedTab>
        )}

        {activeTab === 'water' && (
          <ProtectedTab title="Трекер воды">
            <WaterTracker userData={result} />
          </ProtectedTab>
        )}

        {activeTab === 'statistics' && (
          <ProtectedTab title="Статистика">
            <Statistics userData={result} mealPlan={mealPlan} />
          </ProtectedTab>
        )}

        {activeTab === 'recipes' && (
          <ProtectedTab title="Рецепты">
            <RecipeDetails restrictions={result?.restrictions} goal={result?.goal} />
          </ProtectedTab>
        )}

        {activeTab === 'mealplan' && (
          <ProtectedTab title="Меню">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {mealPlan ? (
                <div>
                  <h2 style={{ color: '#2E7D32', textAlign: 'center' }}>🍽️ Ваше персональное меню на неделю</h2>
                  {result && (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                      Учтены ваши ограничения: {
                        result.restrictions?.vegan && '🌱 Веганство '
                      }
                      {result.restrictions?.diabetes && '🩺 Диабет '}
                      {result.restrictions?.allergies?.length > 0 && `🚫 Аллергии: ${result.restrictions.allergies.join(', ')}`}
                      {!result.restrictions?.vegan && !result.restrictions?.diabetes && result.restrictions?.allergies?.length === 0 && 'Нет ограничений'}
                    </p>
                  )}
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '20px',
                    marginTop: '20px'
                  }}>
                    {Object.entries(mealPlan).map(([day, meals]) => (
                      <div key={day} style={{
                        background: '#F5F5F5',
                        padding: '15px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <h3 style={{
                          color: '#2E7D32',
                          textAlign: 'center',
                          borderBottom: '2px solid #F57C00',
                          paddingBottom: '8px',
                          marginBottom: '15px',
                          textTransform: 'capitalize'
                        }}>{day}</h3>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong style={{ color: '#F57C00' }}>🍳 Завтрак:</strong>
                          <p style={{ margin: '5px 0 0 10px' }}>{meals.breakfast?.name} ({meals.breakfast?.calories} ккал)</p>
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong style={{ color: '#F57C00' }}>🍲 Обед:</strong>
                          <p style={{ margin: '5px 0 0 10px' }}>{meals.lunch?.name} ({meals.lunch?.calories} ккал)</p>
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong style={{ color: '#F57C00' }}>🍎 Полдник:</strong>
                          <p style={{ margin: '5px 0 0 10px' }}>{meals.snack?.name} ({meals.snack?.calories} ккал)</p>
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong style={{ color: '#F57C00' }}>🍽️ Ужин:</strong>
                          <p style={{ margin: '5px 0 0 10px' }}>{meals.dinner?.name} ({meals.dinner?.calories} ккал)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleRegenerateMealPlan}
                    style={{
                      marginTop: '30px',
                      padding: '12px 24px',
                      background: '#F57C00',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🔄 Сгенерировать новое меню
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px', background: '#F5F5F5', borderRadius: '15px' }}>
                  <h3 style={{ color: '#F57C00' }}>📋 Нет меню</h3>
                  <p>Сначала рассчитайте калории, чтобы сгенерировать меню</p>
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    style={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Перейти к калькулятору
                  </button>
                </div>
              )}
            </div>
          </ProtectedTab>
        )}

        {activeTab === 'export' && (
          <ProtectedTab title="Экспорт">
            <ExportMenu mealPlan={mealPlan} userData={result} />
          </ProtectedTab>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '14px', borderTop: '1px solid #e0e0e0', marginTop: '40px' }}>
        © 2026 NutriSmart — Ваш путь к здоровому питанию
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<MainPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;