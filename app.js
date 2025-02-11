// Оборачиваем всё в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Функция для обработки клика
  function handleClick() {
    console.log("Кнопка старта нажата!"); // Отладочное сообщение
    try {
      const welcomeScreen = document.getElementById('welcome-screen');
      const menuScreen = document.getElementById('menu-screen');

      if (welcomeScreen && menuScreen) {
        welcomeScreen.style.display = 'none';
        menuScreen.style.display = 'block';
      } else {
        console.error("Элементы welcome-screen или menu-screen не найдены!");
      }
    } catch (error) {
      console.error("Ошибка при обработке клика:", error.message);
    }
  }

  // Привязываем функцию к глобальному объекту window
  window.handleClick = handleClick;

  // Альтернативный способ привязки события через addEventListener
  const startButton = document.querySelector('.start-button');
  if (startButton) {
    startButton.addEventListener('click', handleClick);
  } else {
    console.error("Кнопка старта не найдена!");
  }
});
