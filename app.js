document.addEventListener('DOMContentLoaded', function () {
  function showMenu() {
    console.log("Кнопка старта нажата!"); // Отладочное сообщение
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'block';
  }

  // Привязываем функцию к глобальному объекту window
  window.showMenu = showMenu;

  function showProfile() {
    alert("Переход в профиль пользователя");
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

  // Привязываем остальные функции к глобальному объекту window
  window.showProfile = showProfile;
  window.showCalendar = showCalendar;
  window.showSocials = showSocials;
  window.showFilms = showFilms;
});
