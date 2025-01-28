// Инициализация Telegram WebApp API
const tg = window.Telegram.WebApp;

// Получение информации о пользователе
tg.expand(); // Расширяем окно приложения до полного размера
document.getElementById('user-info').innerText = `Привет, ${tg.initDataUnsafe.user.first_name}!`;

// Обработчик кнопки "Отправить данные боту"
document.getElementById('send-data').addEventListener('click', () => {
    const data = {
        message: 'Пользователь нажал кнопку!'
    };

    // Отправляем данные боту
    tg.sendData(JSON.stringify(data));
});