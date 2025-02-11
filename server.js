const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Путь к файлу data.json
const DATA_FILE = path.join(__dirname, 'data.json');

// Чтение данных из файла
function readData() {
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
}

// Запись данных в файл
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Регистрация пользователя
app.post('/register', (req, res) => {
  const { username, email, password, isStreamer } = req.body;
  const data = readData();

  // Проверяем, существует ли пользователь с таким email
  if (data.users.some(user => user.email === email)) {
    return res.status(400).send('User already exists');
  }

  // Добавляем нового пользователя
  data.users.push({ username, email, password, isStreamer });
  writeData(data);

  res.send('User registered');
});

// Добавление фильма
app.post('/add-film', (req, res) => {
  const { title, description } = req.body;
  const data = readData();

  // Добавляем новый фильм
  data.films.push({
    title,
    description,
    streamerRating: null,
    viewerRatings: [],
    reviews: [],
  });
  writeData(data);

  res.send('Film added');
});

// Оценка фильма
app.post('/rate-film', (req, res) => {
  const { filmId, rating } = req.body;
  const data = readData();

  const film = data.films.find(film => film.title === filmId);
  if (!film) return res.status(400).send('Film not found');

  film.viewerRatings.push(rating);
  writeData(data);

  res.send('Film rated');
});

// Написание рецензии
app.post('/add-review', (req, res) => {
  const { filmId, reviewText } = req.body;
  const data = readData();

  const film = data.films.find(film => film.title === filmId);
  if (!film) return res.status(400).send('Film not found');

  film.reviews.push({ text: reviewText });
  writeData(data);

  res.send('Review added');
});

// Получение фильмов
app.get('/films', (req, res) => {
  const data = readData();
  res.json(data.films);
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
