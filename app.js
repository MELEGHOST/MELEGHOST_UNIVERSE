document.addEventListener('DOMContentLoaded', function () {
  // Функция для скрытия всех экранов
  function hideAllScreens() {
    const screens = document.querySelectorAll('.frame');
    screens.forEach(screen => {
      screen.style.display = 'none';
    });
  }

  // Функция для показа экрана
  function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'block';
  }

  // Переходы между экранами
  window.showMenu = () => showScreen('menu-screen');
  window.showProfile = () => alert("Профиль пользователя");
  window.showCalendar = () => showScreen('calendar-screen');
  window.showSocials = () => showScreen('socials-screen');
  window.showFilms = () => {
    showScreen('films-screen');
    loadFilms();
  };
  window.showRegister = () => showScreen('register-screen');

  // Регистрация пользователя
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isStreamer = document.getElementById('isStreamer').checked;

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, isStreamer }),
      });

      if (response.ok) {
        alert('Регистрация успешна!');
        showMenu();
      } else {
        alert('Ошибка регистрации.');
      }
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка.');
    }
  });

  // Загрузка списка фильмов
  async function loadFilms() {
    const response = await fetch('/films');
    const films = await response.json();

    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';

    films.forEach(film => {
      const filmItem = document.createElement('div');
      filmItem.className = 'film-item';
      filmItem.innerHTML = `
        <h3>${film.title}</h3>
        <p>${film.description}</p>
        <p>Оценка: ${calculateAverageRating(film)}</p>
        <button onclick="rateFilm('${film._id}')">Оценить</button>
        <button onclick="writeReview('${film._id}')">Написать рецензию</button>
      `;
      filmList.appendChild(filmItem);
    });
  }

  // Добавление фильма
  window.addFilm = function () {
    const title = prompt('Введите название фильма:');
    const description = prompt('Введите описание фильма:');

    fetch('/add-film', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    }).then(() => loadFilms());
  };

  // Оценка фильма
  window.rateFilm = function (filmId) {
    const rating = prompt('Оцените фильм по шкале от 1 до 10:');
    fetch('/rate-film', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filmId, rating }),
    }).then(() => loadFilms());
  };

  // Написание рецензии
  window.writeReview = function (filmId) {
    showScreen('review-screen');
    document.querySelector('#review-screen button').onclick = () => submitReview(filmId);
  };

  // Отправка рецензии
  window.submitReview = function (filmId) {
    const reviewText = document.getElementById('review-text').value;

    fetch('/add-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filmId, reviewText }),
    }).then(() => {
      alert('Рецензия отправлена!');
      showScreen('films-screen');
      loadFilms();
    });
  };

  // Расчет средней оценки
  function calculateAverageRating(film) {
    const ratings = [...film.viewerRatings];
    if (film.streamerRating) ratings.push(film.streamerRating);
    return ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'Нет оценок';
  }
});
