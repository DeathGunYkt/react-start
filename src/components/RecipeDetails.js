import React, { useState } from 'react';
import styled from 'styled-components';

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

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RecipeCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RecipeImage = styled.div`
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const RecipeInfo = styled.div`
  padding: 15px;
`;

const RecipeName = styled.h4`
  color: #333;
  margin-bottom: 10px;
`;

const RecipeMeta = styled.div`
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Tag = styled.span`
  padding: 3px 8px;
  background: ${props => props.color || '#e0f2e0'};
  color: ${props => props.textColor || '#4CAF50'};
  border-radius: 12px;
  font-size: 12px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Section = styled.div`
  margin: 20px 0;
  
  h5 {
    color: #4CAF50;
    margin-bottom: 10px;
    font-size: 18px;
  }
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 5px 0;
    border-bottom: 1px dashed #eee;
    display: flex;
    justify-content: space-between;
  }
`;

const InstructionList = styled.ol`
  padding-left: 20px;
  
  li {
    margin: 10px 0;
    line-height: 1.6;
  }
`;

const NutritionTable = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 15px 0;
`;

const NutritionItem = styled.div`
  text-align: center;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  
  span {
    display: block;
    
    &:first-child {
      color: #666;
      font-size: 14px;
    }
    
    &:last-child {
      color: #4CAF50;
      font-weight: bold;
      font-size: 18px;
    }
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  
  &:hover {
    background: #45a049;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

// Расширенная база рецептов
const recipeDatabase = [
  {
    id: 1,
    name: 'Овсяная каша с ягодами',
    image: '🥣',
    calories: 350,
    protein: 12,
    fat: 8,
    carbs: 58,
    time: 15,
    difficulty: 'Легко',
    vegan: true,
    allergies: [],
    diabetes: 'medium',
    ingredients: [
      'Овсяные хлопья - 50г',
      'Молоко (или растительное) - 200мл',
      'Ягоды (свежие или замороженные) - 100г',
      'Мед - 1 ч.л.',
      'Корица - по вкусу'
    ],
    instructions: [
      'В кастрюлю налейте молоко и доведите до кипения',
      'Всыпьте овсяные хлопья, уменьшите огонь и варите 5-7 минут, помешивая',
      'Добавьте ягоды и варите еще 2-3 минуты',
      'Подавайте с медом и корицей'
    ]
  },
  {
    id: 2,
    name: 'Куриная грудка с гречкой',
    image: '🍗',
    calories: 500,
    protein: 40,
    fat: 15,
    carbs: 55,
    time: 40,
    difficulty: 'Средне',
    vegan: false,
    allergies: [],
    diabetes: 'low',
    ingredients: [
      'Куриная грудка - 200г',
      'Гречка - 100г',
      'Лук - 1 шт',
      'Морковь - 1 шт',
      'Растительное масло - 1 ст.л.',
      'Соль, перец - по вкусу'
    ],
    instructions: [
      'Гречку промойте и залейте водой (1:2), варите 20 минут',
      'Куриную грудку нарежьте кубиками, обжарьте на масле 5-7 минут',
      'Добавьте мелко нарезанные лук и морковь, жарьте еще 5 минут',
      'Смешайте с готовой гречкой, посолите, поперчите'
    ]
  },
  {
    id: 3,
    name: 'Смузи боул с гранолой',
    image: '🥥',
    calories: 380,
    protein: 10,
    fat: 15,
    carbs: 55,
    time: 10,
    difficulty: 'Легко',
    vegan: true,
    allergies: ['орехи'],
    diabetes: 'low',
    ingredients: [
      'Банан - 1 шт',
      'Замороженные ягоды - 100г',
      'Растительное молоко - 100мл',
      'Гранола - 30г',
      'Семена чиа - 1 ст.л.',
      'Кокосовая стружка - для украшения'
    ],
    instructions: [
      'В блендере смешайте банан, ягоды и молоко до однородной массы',
      'Перелейте в миску',
      'Сверху посыпьте гранолой, семенами чиа и кокосовой стружкой',
      'Подавайте сразу'
    ]
  },
  {
    id: 4,
    name: 'Лосось с овощами гриль',
    image: '🐟',
    calories: 520,
    protein: 35,
    fat: 28,
    carbs: 30,
    time: 25,
    difficulty: 'Средне',
    vegan: false,
    allergies: ['рыба'],
    diabetes: 'low',
    ingredients: [
      'Филе лосося - 200г',
      'Кабачок - 1 шт',
      'Болгарский перец - 1 шт',
      'Спаржа - 100г',
      'Оливковое масло - 2 ст.л.',
      'Лимон, соль, перец - по вкусу'
    ],
    instructions: [
      'Рыбу посолите, поперчите, сбрызните лимонным соком',
      'Овощи нарежьте крупными кусками, сбрызните маслом',
      'Обжарьте на гриле или сковороде рыбу по 4-5 минут с каждой стороны',
      'Овощи жарьте до готовности (около 10 минут)',
      'Подавайте с долькой лимона'
    ]
  },
  {
    id: 5,
    name: 'Тофу с овощами в азиатском стиле',
    image: '🥢',
    calories: 400,
    protein: 25,
    fat: 22,
    carbs: 35,
    time: 20,
    difficulty: 'Средне',
    vegan: true,
    allergies: ['соя', 'кунжут'],
    diabetes: 'low',
    ingredients: [
      'Тофу твердый - 200г',
      'Брокколи - 150г',
      'Морковь - 1 шт',
      'Соевый соус - 2 ст.л.',
      'Кунжутное масло - 1 ч.л.',
      'Кунжут - для посыпки',
      'Имбирь, чеснок - по вкусу'
    ],
    instructions: [
      'Тофу нарежьте кубиками, обжарьте до золотистой корочки',
      'Овощи нарежьте и обжарьте 5-7 минут',
      'Смешайте соевый соус, масло, имбирь и чеснок',
      'Залейте соусом овощи с тофу, тушите 3 минуты',
      'Посыпьте кунжутом перед подачей'
    ]
  }
];

const RecipeDetails = ({ restrictions, goal }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(recipeDatabase);

  // Фильтрация рецептов по ограничениям и поиску
  const filterRecipes = () => {
    let filtered = recipeDatabase;

    // Фильтр по веганству
    if (restrictions?.vegan) {
      filtered = filtered.filter(r => r.vegan);
    }

    // Фильтр по аллергиям
    if (restrictions?.allergies?.length) {
      filtered = filtered.filter(r => 
        !r.allergies.some(allergy => restrictions.allergies.includes(allergy))
      );
    }

    // Фильтр по диабету
    if (restrictions?.diabetes) {
      filtered = filtered.filter(r => r.diabetes !== 'high');
    }

    // Фильтр по калориям в зависимости от цели
    if (goal === 'weightLoss') {
      filtered = filtered.filter(r => r.calories < 450);
    } else if (goal === 'weightGain') {
      filtered = filtered.filter(r => r.calories > 450);
    }

    // Поиск по названию
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  };

  React.useEffect(() => {
    filterRecipes();
  }, [restrictions, goal, searchTerm]);

  return (
    <Container>
      <Title>Рецепты с деталями 🍳</Title>

      <SearchBar
        type="text"
        placeholder="🔍 Поиск рецептов..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <RecipeGrid>
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} onClick={() => setSelectedRecipe(recipe)}>
            <RecipeImage>{recipe.image}</RecipeImage>
            <RecipeInfo>
              <RecipeName>{recipe.name}</RecipeName>
              <RecipeMeta>
                <span>⏱️ {recipe.time} мин</span>
                <span>🔥 {recipe.calories} ккал</span>
                <span>📊 {recipe.difficulty}</span>
              </RecipeMeta>
              <TagContainer>
                {recipe.vegan && <Tag color="#e0f2e0" textColor="#4CAF50">🌱 Веган</Tag>}
                {recipe.allergies.map(allergy => (
                  <Tag key={allergy} color="#ffebee" textColor="#f44336">
                    🚫 {allergy}
                  </Tag>
                ))}
                {recipe.diabetes === 'low' && <Tag color="#e3f2fd" textColor="#2196F3">✅ Для диабетиков</Tag>}
                {recipe.diabetes === 'medium' && <Tag color="#fff3e0" textColor="#FF9800">⚠️ С осторожностью</Tag>}
              </TagContainer>
            </RecipeInfo>
          </RecipeCard>
        ))}
      </RecipeGrid>

      {filteredRecipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>😕 Нет рецептов, соответствующих вашим ограничениям</p>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {selectedRecipe && (
        <Modal onClick={() => setSelectedRecipe(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedRecipe(null)}>×</CloseButton>
            
            <div style={{ textAlign: 'center', fontSize: '64px', marginBottom: '20px' }}>
              {selectedRecipe.image}
            </div>
            
            <h2 style={{ textAlign: 'center', color: '#333' }}>{selectedRecipe.name}</h2>
            
            <NutritionTable>
              <NutritionItem>
                <span>Калории</span>
                <span>{selectedRecipe.calories} ккал</span>
              </NutritionItem>
              <NutritionItem>
                <span>Белки</span>
                <span>{selectedRecipe.protein}г</span>
              </NutritionItem>
              <NutritionItem>
                <span>Жиры</span>
                <span>{selectedRecipe.fat}г</span>
              </NutritionItem>
              <NutritionItem>
                <span>Углеводы</span>
                <span>{selectedRecipe.carbs}г</span>
              </NutritionItem>
              <NutritionItem>
                <span>Время</span>
                <span>{selectedRecipe.time} мин</span>
              </NutritionItem>
              <NutritionItem>
                <span>Сложность</span>
                <span>{selectedRecipe.difficulty}</span>
              </NutritionItem>
            </NutritionTable>

            <Section>
              <h5>📝 Ингредиенты:</h5>
              <IngredientList>
                {selectedRecipe.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </IngredientList>
            </Section>

            <Section>
              <h5>👨‍🍳 Приготовление:</h5>
              <InstructionList>
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </InstructionList>
            </Section>

            <TagContainer>
              {selectedRecipe.vegan && <Tag color="#e0f2e0" textColor="#4CAF50">🌱 Веганское блюдо</Tag>}
              {selectedRecipe.allergies.map(allergy => (
                <Tag key={allergy} color="#ffebee" textColor="#f44336">
                  🚫 Содержит {allergy}
                </Tag>
              ))}
            </TagContainer>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button onClick={() => {
                alert('Рецепт добавлен в план!');
                setSelectedRecipe(null);
              }}>
                📅 Добавить в план
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default RecipeDetails;