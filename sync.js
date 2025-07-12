const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const {URL} = require('url');

// В CommonJS можно использовать __dirname напрямую — не нужно fileURLToPath
const outputDir = path.join(__dirname, '../public/menu_images');
const jsonUrl = 'https://teatro.eat-me.online/api/v1/menu';

const extractImageUrls = (data) => {
  const urls = new Set();

  data.result.itemCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      item.itemSizes?.forEach((size) => {
        const images = size.buttonImage || {};
        Object.values(images).forEach((url) => {
          if (typeof url === 'string' && url.startsWith('http')) {
            urls.add(url);
          }
        });
      });
    });
  });

  return Array.from(urls);
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const downloadImageWithRetry = async (url, retries = 10, delay = 150) => {
  const urlObj = new URL(url);
  const filePath = path.join(outputDir, urlObj.hostname, urlObj.pathname);

  if (await fs.pathExists(filePath)) {
    console.log(`⏩ Already exists: ${filePath}`);
    return;
  }

  await fs.ensureDir(path.dirname(filePath));

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {responseType: 'arraybuffer'});
      await fs.writeFile(filePath, response.data);
      console.log(`✅ [${attempt}] Saved: ${filePath}`);
      return;
    } catch (err) {
      console.warn(`⚠️ [${attempt}] Failed to download ${url}: ${err.message}`);
      if (attempt < retries) {
        await sleep(delay * attempt);
      } else {
        console.error(`❌ Giving up on ${url}`);
      }
    }
  }
};

const run = async () => {
  console.log(`📡 Fetching menu JSON from ${jsonUrl}`);
  const {data} = await axios.get(jsonUrl);
  const urls = extractImageUrls(data);
  console.log(`🔍 Found ${urls.length} image URLs`);

  for (const url of urls) {
    await downloadImageWithRetry(url);
  }

  console.log('🎉 All done!');
};

run();
