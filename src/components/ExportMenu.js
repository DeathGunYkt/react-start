import React from 'react';
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

const ExportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
`;

const OptionCard = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h4 {
    color: #333;
    margin: 10px 0;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const ShoppingList = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const ShoppingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  
  span:first-child {
    color: #333;
  }
  
  span:last-child {
    color: #4CAF50;
    font-weight: bold;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  
  &:hover {
    background: #45a049;
  }
`;

const ExportMenu = ({ mealPlan, userData }) => {
  // Сбор всех ингредиентов из меню
  const collectIngredients = () => {
    const ingredients = {};
    
    Object.values(mealPlan || {}).forEach(day => {
      Object.values(day).forEach(meal => {
        if (meal.ingredients) {
          meal.ingredients.forEach(ing => {
            const [name, quantity] = ing.split(' - ');
            if (ingredients[name]) {
              // Суммируем количество
              const oldQty = parseFloat(ingredients[name]) || 0;
              const newQty = parseFloat(quantity) || 0;
              ingredients[name] = (oldQty + newQty).toFixed(1) + ' ' + quantity.replace(/[0-9.]/g, '');
            } else {
              ingredients[name] = quantity;
            }
          });
        }
      });
    });
    
    return ingredients;
  };

  // Генерация PDF
  const generatePDF = () => {
    const printContent = document.createElement('div');
    
    // Заголовок
    printContent.innerHTML = `
      <h1 style="text-align: center; color: #4CAF50;">Меню на неделю для ${userData?.name || 'пользователя'}</h1>
      <p style="text-align: center;">Цель: ${userData?.goal === 'weightLoss' ? 'Похудение' : 
        userData?.goal === 'weightMaintenance' ? 'Поддержание' : 'Набор массы'}</p>
      <p style="text-align: center;">Калории: ${userData?.goal || 2000} ккал/день</p>
      <hr/>
    `;
    
    // Меню по дням
    Object.entries(mealPlan || {}).forEach(([day, meals]) => {
      printContent.innerHTML += `
        <h2 style="color: #333; margin-top: 20px;">${day}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #4CAF50; color: white;">
            <th style="padding: 10px;">Прием пищи</th>
            <th style="padding: 10px;">Блюдо</th>
            <th style="padding: 10px;">Калории</th>
          </tr>
      `;
      
      Object.entries(meals).forEach(([mealType, meal]) => {
        const mealNames = {
          breakfast: 'Завтрак',
          lunch: 'Обед',
          snack: 'Полдник',
          dinner: 'Ужин'
        };
        
        printContent.innerHTML += `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${mealNames[mealType]}</td>
            <td style="padding: 10px;">${meal.name}</td>
            <td style="padding: 10px;">${meal.calories} ккал</td>
          </tr>
        `;
      });
      
      printContent.innerHTML += `</table>`;
    });
    
    // Список покупок
    const ingredients = collectIngredients();
    if (Object.keys(ingredients).length > 0) {
      printContent.innerHTML += `
        <h2 style="color: #333; margin-top: 30px;">🛒 Список покупок</h2>
        <ul style="list-style: none; padding: 0;">
      `;
      
      Object.entries(ingredients).forEach(([name, quantity]) => {
        printContent.innerHTML += `
          <li style="padding: 5px; border-bottom: 1px dashed #ddd;">
            ${name} - ${quantity}
          </li>
        `;
      });
      
      printContent.innerHTML += `</ul>`;
    }
    
    // Открываем окно печати
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Меню на неделю</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Копирование в буфер обмена
  const copyToClipboard = () => {
    let text = 'МЕНЮ НА НЕДЕЛЮ\n\n';
    
    Object.entries(mealPlan || {}).forEach(([day, meals]) => {
      text += `${day}:\n`;
      Object.entries(meals).forEach(([mealType, meal]) => {
        const mealNames = {
          breakfast: '  Завтрак',
          lunch: '  Обед',
          snack: '  Полдник',
          dinner: '  Ужин'
        };
        text += `${mealNames[mealType]}: ${meal.name} (${meal.calories} ккал)\n`;
      });
      text += '\n';
    });
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Меню скопировано в буфер обмена!');
    });
  };

  // Скачать как текстовый файл
  const downloadTxt = () => {
    let text = 'МЕНЮ НА НЕДЕЛЮ\n';
    text += `Для: ${userData?.name || 'пользователя'}\n`;
    text += `Цель: ${userData?.goal === 'weightLoss' ? 'Похудение' : 
      userData?.goal === 'weightMaintenance' ? 'Поддержание' : 'Набор массы'}\n`;
    text += `Калории: ${userData?.goal || 2000} ккал/день\n`;
    text += '='.repeat(50) + '\n\n';
    
    Object.entries(mealPlan || {}).forEach(([day, meals]) => {
      text += `${day}:\n`;
      let dailyTotal = 0;
      
      Object.entries(meals).forEach(([mealType, meal]) => {
        const mealNames = {
          breakfast: '  Завтрак',
          lunch: '  Обед',
          snack: '  Полдник',
          dinner: '  Ужин'
        };
        text += `${mealNames[mealType]}: ${meal.name} (${meal.calories} ккал)\n`;
        dailyTotal += meal.calories;
      });
      
      text += `  Всего за день: ${dailyTotal} ккал\n\n`;
    });
    
    // Список покупок
    const ingredients = collectIngredients();
    if (Object.keys(ingredients).length > 0) {
      text += '🛒 СПИСОК ПОКУПОК\n';
      text += '='.repeat(50) + '\n';
      Object.entries(ingredients).forEach(([name, quantity]) => {
        text += `${name}: ${quantity}\n`;
      });
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  const ingredients = collectIngredients();

  return (
    <Container>
      <Title>📥 Экспорт меню</Title>

      <ExportOptions>
        <OptionCard onClick={generatePDF}>
          <Icon>📄</Icon>
          <h4>Сохранить как PDF</h4>
          <p>Сохранить меню в формате PDF для печати</p>
        </OptionCard>

        <OptionCard onClick={downloadTxt}>
          <Icon>📝</Icon>
          <h4>Скачать как текст</h4>
          <p>Скачать меню в текстовом формате</p>
        </OptionCard>

        <OptionCard onClick={copyToClipboard}>
          <Icon>📋</Icon>
          <h4>Копировать в буфер</h4>
          <p>Скопировать меню в буфер обмена</p>
        </OptionCard>
      </ExportOptions>

      {Object.keys(ingredients).length > 0 && (
        <ShoppingList>
          <h4>🛒 Список покупок на неделю</h4>
          {Object.entries(ingredients).map(([name, quantity]) => (
            <ShoppingItem key={name}>
              <span>{name}</span>
              <span>{quantity}</span>
            </ShoppingItem>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button onClick={() => {
              const list = Object.entries(ingredients)
                .map(([name, qty]) => `${name} - ${qty}`)
                .join('\n');
              navigator.clipboard.writeText(list);
              alert('Список покупок скопирован!');
            }}>
              📋 Копировать список покупок
            </Button>
          </div>
        </ShoppingList>
      )}
    </Container>
  );
};

export default ExportMenu;