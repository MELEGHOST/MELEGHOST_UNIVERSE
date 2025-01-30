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

    console.log('Figma file loaded successfully.');
    console.log(`File name: ${fileResponse.data.name}`);
    console.log(`Last modified: ${fileResponse.data.lastModified}`);

    // Извлекаем все страницы
    const pages = fileResponse.data.document.children.filter(child => child.type === 'CANVAS');
    console.log(`Found ${pages.length} pages.`);

    if (pages.length === 0) {
      throw new Error('No pages found in the Figma file.');
    }

    let frameCount = 0; // Счётчик фреймов

    // Проходимся по всем страницам
    for (const page of pages) {
      console.log(`Processing page: ${page.name}`);

      // Извлекаем все фреймы на странице
      const frames = page.children.filter(child => child.type === 'FRAME');
      console.log(`Found ${frames.length} frames on page ${page.name}.`);

      if (frames.length === 0) {
        console.log(`No frames found on page ${page.name}. Skipping...`);
        continue;
      }

      // Проходимся по всем фреймам
      for (const frame of frames) {
        frameCount++;
        const frameId = frame.id;
        console.log(`Processing frame ${frameCount}: ID=${frameId}, Name=${frame.name}`);

        // Шаг 2: Экспорт изображения фрейма
        const imageResponse = await axios.get(
          `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${frameId}&format=png`,
          {
            headers: { 'X-Figma-Token': FIGMA_TOKEN },
          }
        );

        // Проверяем, есть ли URL изображения
        if (!imageResponse.data.images || !imageResponse.data.images[frameId]) {
          console.error(`Image URL not found for frame ${frameCount}. Skipping...`);
          continue;
        }

        const imageUrl = imageResponse.data.images[frameId];
        console.log(`Downloading image for frame ${frameCount} from: ${imageUrl}`);

        // Шаг 3: Скачиваем изображение
        const imageDownload = await axios({
          url: imageUrl,
          responseType: 'arraybuffer',
        });

        // Сохраняем изображение в файл
        const fileName = `frame-${frameCount}-${frame.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        fs.writeFileSync(fileName, imageDownload.data);
        console.log(`Image saved as ${fileName}.`);
      }
    }

    if (frameCount === 0) {
      throw new Error('No frames found in the Figma file.');
    }
  } catch (error) {
    console.error('Error exporting resources:', error.message);
    process.exit(1); // Завершаем выполнение с ошибкой
  }
};

exportResources();
