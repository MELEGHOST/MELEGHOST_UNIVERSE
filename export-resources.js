const axios = require('axios');
const fs = require('fs');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

const exportResources = async () => {
  try {
    console.log('Fetching data from Figma...');

    // Шаг 1: Получаем структуру файла
    const fileResponse = await axios.get(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    });

    console.log('Figma file structure:', JSON.stringify(fileResponse.data, null, 2));

    // Извлекаем ID первого фрейма (пример)
    const frameId = fileResponse.data.document.children[0].id;
    console.log(`Found frame ID: ${frameId}`);

    // Шаг 2: Экспорт изображения фрейма
    const imageResponse = await axios.get(
      `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${frameId}&format=png`,
      {
        headers: { 'X-Figma-Token': FIGMA_TOKEN },
      }
    );

    console.log('Image export response:', JSON.stringify(imageResponse.data, null, 2));

    // Получаем URL изображения
    const imageUrl = imageResponse.data.images[frameId];
    console.log(`Downloading image from: ${imageUrl}`);

    // Шаг 3: Скачиваем изображение
    const imageDownload = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // Сохраняем изображение в файл
    fs.writeFileSync('exported-image.png', imageDownload.data);
    console.log('Image saved as exported-image.png.');
  } catch (error) {
    console.error('Error exporting resources:', error.message);
    process.exit(1); // Завершаем выполнение с ошибкой
  }
};

exportResources();
