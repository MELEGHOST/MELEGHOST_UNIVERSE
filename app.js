// Функции для переключения экранов
function showProfile() {
  alert("Переход в профиль пользователя");
  // Здесь можно добавить логику для перехода в профиль
}

function showMenu() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('menu-screen').style.display = 'block';
  document.getElementById('calendar-screen').style.display = 'none';
  document.getElementById('socials-screen').style.display = 'none';
  document.getElementById('films-screen').style.display = 'none';
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
