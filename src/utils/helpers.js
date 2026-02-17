// helpers.js - вспомогательные функции

// Форматирование даты
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Получение дней недели
export const getDaysOfWeek = () => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const today = new Date().getDay();
  const shiftedDays = [...days.slice(today), ...days.slice(0, today)];
  return shiftedDays;
};

// Расчет процента выполнения цели
export const calculateProgress = (current, target) => {
  return Math.min(100, Math.round((current / target) * 100));
};

// Сохранение данных в localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

// Загрузка данных из localStorage
export const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Error loading from localStorage', e);
    return null;
  }
};