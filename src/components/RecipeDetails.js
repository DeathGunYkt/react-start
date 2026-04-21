import React, { useState, useEffect } from 'react';
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

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
    border-color: #2E7D32;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RecipeCard = styled.div`
  background: #F5F5F5;
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
  background: linear-gradient(135deg, #2E7D32 0%, #F57C00 100%);
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
  color: ${props => props.textColor || '#2E7D32'};
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
    color: #2E7D32;
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
  background: #F5F5F5;
  border-radius: 8px;
  
  span {
    display: block;
    
    &:first-child {
      color: #666;
      font-size: 14px;
    }
    
    &:last-child {
      color: #F57C00;
      font-weight: bold;
      font-size: 18px;
    }
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  
  &:hover {
    background: #1B5E20;
  }
`;

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
    ingredients: ['Овсяные хлопья - 50г', 'Молоко - 200мл', 'Ягоды - 100г', 'Мед - 1 ч.л.', 'Корица - по вкусу'],
    instructions: ['В кастрюлю налейте молоко и доведите до кипения', 'Всыпьте овсяные хлопья, варите 5-7 минут', 'Добавьте ягоды, варите еще 2-3 минуты', 'Подавайте с медом и корицей']
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
    ingredients: ['Куриная грудка - 200г', 'Гречка - 100г', 'Лук - 1 шт', 'Морковь - 1 шт', 'Масло - 1 ст.л.', 'Соль, перец'],
    instructions: ['Гречку промойте и варите 20 минут', 'Курицу нарежьте, обжарьте 5-7 минут', 'Добавьте лук и морковь, жарьте еще 5 минут', 'Смешайте с гречкой']
  }
];

const RecipeDetails = ({ restrictions, goal }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(recipeDatabase);

  const filterRecipes = () => {
    let filtered = recipeDatabase;

    if (restrictions?.vegan) {
      filtered = filtered.filter(r => r.vegan);
    }

    if (restrictions?.allergies?.length) {
      filtered = filtered.filter(r => 
        !r.allergies.some(allergy => restrictions.allergies.includes(allergy))
      );
    }

    if (restrictions?.diabetes) {
      filtered = filtered.filter(r => r.diabetes !== 'high');
    }

    if (goal === 'weightLoss') {
      filtered = filtered.filter(r => r.calories < 450);
    } else if (goal === 'weightGain') {
      filtered = filtered.filter(r => r.calories > 450);
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  };

  useEffect(() => {
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
                {recipe.vegan && <Tag color="#e0f2e0" textColor="#2E7D32">🌱 Веган</Tag>}
                {recipe.allergies.map(allergy => (
                  <Tag key={allergy} color="#ffebee" textColor="#f44336">🚫 {allergy}</Tag>
                ))}
              </TagContainer>
            </RecipeInfo>
          </RecipeCard>
        ))}
      </RecipeGrid>

      {filteredRecipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>😕 Нет рецептов, соответствующих вашим ограничениям</p>
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
              <NutritionItem><span>Калории</span><span>{selectedRecipe.calories} ккал</span></NutritionItem>
              <NutritionItem><span>Белки</span><span>{selectedRecipe.protein}г</span></NutritionItem>
              <NutritionItem><span>Жиры</span><span>{selectedRecipe.fat}г</span></NutritionItem>
              <NutritionItem><span>Углеводы</span><span>{selectedRecipe.carbs}г</span></NutritionItem>
              <NutritionItem><span>Время</span><span>{selectedRecipe.time} мин</span></NutritionItem>
              <NutritionItem><span>Сложность</span><span>{selectedRecipe.difficulty}</span></NutritionItem>
            </NutritionTable>
            <Section>
              <h5>📝 Ингредиенты:</h5>
              <IngredientList>
                {selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
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
              {selectedRecipe.vegan && <Tag color="#e0f2e0" textColor="#2E7D32">🌱 Веганское блюдо</Tag>}
              {selectedRecipe.allergies.map(allergy => (
                <Tag key={allergy} color="#ffebee" textColor="#f44336">🚫 Содержит {allergy}</Tag>
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