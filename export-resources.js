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

    // Извлекаем все фреймы
    const frames = fileResponse.data.document.children.filter(child => child.type === 'CANVAS');
    console.log(`Found ${frames.length} frames.`);

    if (frames.length === 0) {
      throw new Error('No frames found in the Figma file.');
    }

    // Проходимся по всем фреймам
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const frameId = frame.id;
      console.log(`Processing frame ${i + 1}: ID=${frameId}, Name=${frame.name}`);

      // Шаг 2: Экспорт изображения фрейма
      const imageResponse = await axios.get(
        `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${frameId}&format=png`,
        {
          headers: { 'X-Figma-Token': FIGMA_TOKEN },
        }
      );

      console.log(`Image export response for frame ${i + 1}:`, JSON.stringify(imageResponse.data, null, 2));

      // Проверяем, есть ли URL изображения
      if (!imageResponse.data.images || !imageResponse.data.images[frameId]) {
        console.error(`Image URL not found for frame ${i + 1}. Skipping...`);
        continue;
      }

      const imageUrl = imageResponse.data.images[frameId];
      console.log(`Downloading image for frame ${i + 1} from: ${imageUrl}`);

      // Шаг 3: Скачиваем изображение
      const imageDownload = await axios({
        url: imageUrl,
        responseType: 'arraybuffer',
      });

      // Сохраняем изображение в файл
      const fileName = `frame-${i + 1}-${frame.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      fs.writeFileSync(fileName, imageDownload.data);
      console.log(`Image saved as ${fileName}.`);
    }
  } catch (error) {
    console.error('Error exporting resources:', error.message);
    process.exit(1); // Завершаем выполнение с ошибкой
  }
};

exportResources();
