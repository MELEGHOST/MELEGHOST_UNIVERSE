require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Модель пользователя
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isStreamer: Boolean,
  twitchId: String,
  socials: {
    twitter: String,
    instagram: String,
    youtube: String,
  },
  schedule: [{ date: Date, title: String }],
  films: [{
    title: String,
    description: String,
    streamerRating: Number,
    viewerRatings: [Number],
    reviews: [{ userId: mongoose.Schema.Types.ObjectId, text: String }],
  }],
});

const User = mongoose.model('User', UserSchema);

// Регистрация
app.post('/register', async (req, res) => {
  const { username, email, password, isStreamer } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, isStreamer });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Авторизация
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Добавление фильма
app.post('/add-film', async (req, res) => {
  const { title, description } = req.body;
  try {
    const user = await User.findOne({});
    user.films.push({ title, description, streamerRating: null, viewerRatings: [], reviews: [] });
    await user.save();
    res.send('Film added');
  } catch (error) {
    res.status(500).send('Error adding film');
  }
});

// Оценка фильма
app.post('/rate-film', async (req, res) => {
  const { filmId, rating } = req.body;
  try {
    const user = await User.findOne({ 'films._id': filmId });
    if (!user) return res.status(400).send('Film not found');
    const film = user.films.id(filmId);
    film.viewerRatings.push(rating);
    await user.save();
    res.send('Film rated');
  } catch (error) {
    res.status(500).send('Error rating film');
  }
});

// Написание рецензии
app.post('/add-review', async (req, res) => {
  const { filmId, reviewText } = req.body;
  try {
    const user = await User.findOne({ 'films._id': filmId });
    if (!user) return res.status(400).send('Film not found');
    const film = user.films.id(filmId);
    film.reviews.push({ userId: 'viewerId', text: reviewText });
    await user.save();
    res.send('Review added');
  } catch (error) {
    res.status(500).send('Error adding review');
  }
});

// Получение фильмов
app.get('/films', async (req, res) => {
  try {
    const user = await User.findOne({});
    res.json(user.films);
  } catch (error) {
    res.status(500).send('Error fetching films');
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
