// Функции для переключения экранов
function showProfile() {
  alert("Переход в профиль пользователя");
  // Здесь можно добавить логику для перехода в профиль
}

function showMenu() {
  console.log("Кнопка старта нажата!"); // Отладочное сообщение
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('menu-screen').style.display = 'block';
}

function showCalendar() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('calendar-screen').style.display = 'block';
}

function showSocials() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('socials-screen').style.display = 'block';
}

function showFilms() {
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('films-screen').style.display = 'block';
}
