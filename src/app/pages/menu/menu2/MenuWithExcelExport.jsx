// MenuWithExcelExport.jsx
"use client";
import React, {useEffect, useState} from "react";
import ExcelJS from "exceljs";
import {saveAs} from "file-saver";

/**
 * Зависимости:
 * npm install exceljs file-saver
 *
 * Использование:
 * <MenuWithExcelExport />
 *
 * Пояснения по CORS:
 * - Браузер будет пытаться fetch(url) для каждой картинки.
 * - Если сервер не разрешает CORS, fetch упадёт -> будет fallback:
 *   * Вставляем в ячейку формулу =IMAGE("url") (пока поддерживается Excel 365/online/Google Sheets)
 *   * И сохраняем URL в отдельной колонке
 */

const allowedProducts = [{
  category: "Snacks & Starters",
  items: [{
    id: "american-fries",
    name: "American Fries",
    price: 15,
    weight: 250,
    description: "Fried potato sticks, oil, salt.",
    adds: [{name: "With ketchup", price: 2}, {name: "With mayonnaise", price: 2}],
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fd5bcc3c6-3be8-42ef-8208-50a036b3b20f-752x552x100.webp&w=828&q=75"
  }, {
    id: "cheese-sticks",
    name: "Cheese Sticks (5 pcs)",
    price: 30,
    weight: 200,
    description: "Mozzarella, bread crumbs, egg, flour, oil.",
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F8ecb53ef-17b2-4ae1-af97-4f58088ea06e-752x552x100.webp&w=828&q=75"
  }, {
    id: "tempura-shrimps",
    name: "Tempura Shrimps (5 pcs)",
    description: "Shrimps, tempura batter, oil.",
    price: 30,
    weight: 200,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F74e9d6f3-083f-4023-9f7e-31c904b8a44c-752x552x100.webp&w=828&q=75"
  }, {
    id: "club-sandwich",
    name: "Club Sandwich",
    price: 30,
    description: "Grilled chicken, lettuce, tomato, and mayo on toasted bread.",
    weight: 300,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F8ab8fa3d-2fbb-4c3d-9d1c-1d08baa5df8d-752x552x100.webp&w=828&q=75"
  }, {
    id: "tigrado",
    name: "Tigrado",
    description: "Tempura-fried fish with shrimps, cream cheese, spicy mayo, egg, and unagi sauce.",
    price: 45,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F4ddb0a62-037a-4a79-9edf-9c2de1d38d73-752x552x100.webp&w=828&q=75"
  }]
}, {
  category: "Sushi Rolls",
  items: [{
    id: "philadelphia",
    name: "Philadelphia",
    description: "Salmon, rice, nori, cream cheese, avocado.",
    price: 35,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Ff2fa48ac-711a-4a40-a3de-c8199a9633ea-752x552x100.webp&w=828&q=75"
  }, {
    id: "salmon-plus",
    name: "Salmon Plus",
    description: "Salmon, rice, nori, cream cheese, cucumber, spicy mayo.",
    price: 40,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F9040c2a0-2ff0-4211-8a5c-dbde86ee2aa3-752x552x100.webp&w=828&q=75"
  }, {
    id: "crazy-monkey",
    name: "Crazy Monkey",
    description: "Tempura, rice, nori, cream cheese, shrimps, spicy mayo, sesame mix.",
    price: 40,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F64be4bfa-441c-4612-aed8-59e2b9b9166c-752x552x100.webp&w=828&q=75"
  }, {
    id: "dragon-roll",
    name: "Dragon Roll",
    description: "Rice, nori, cream cheese, salmon, unagi, sesame mix, apple, unagi sauce.",
    price: 40,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F42bad3b4-677d-405e-afa4-9a76ca40b057-752x552x100.webp&w=828&q=75"
  }, {
    id: "hot-salmon-roll",
    name: "Hot Salmon Roll",
    description: "Rice, nori, cream cheese, salmon, spicy mayo, tempura flakes, unagi sauce.",
    price: 40,
    weight: 250,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F6ffe9d34-f646-4aa9-a9a3-4f81b6b9a1cb-752x552x100.webp&w=828&q=75"
  }, {
    id: "avocado-maki",
    name: "Avocado Maki",
    description: "Rice, nori, avocado.",
    price: 12,
    weight: 150,
    image: "/v2/avocado-maki.jpg"
  }, {
    id: "cucumber-maki",
    name: "Cucumber Maki",
    description: "Rice, nori, cucumber.",
    price: 10,
    weight: 150,
    image: "/v2/cucumber-maki.jpg"
  }, {
    id: "tuna-maki",
    name: "Tuna Maki",
    description: "Rice, nori, tuna.",
    price: 15,
    weight: 150,
    image: "/v2/tuna-maki.jpg"
  }, {
    id: "unagi-maki",
    name: "Unagi Maki",
    description: "Rice, nori, unagi, unagi sauce, sesame mix.",
    price: 20,
    weight: 150,
    image: "/v2/unagi-maki.jpg"
  }]
}, {
  category: "Salads",
  items: [{
    id: "georgian-salad",
    name: "Georgian Salad",
    description: "Fresh tomatoes, cucumbers, onions, herbs, and traditional Georgian spices.",
    price: 15,
    weight: 300,
    options: [{name: "With walnuts", price: 5}],
    image: "/v2/georgian-salad.jpg"
  }, {
    id: "greek-salad",
    name: "Greek Salad",
    description: "Fresh vegetables, feta cheese, olives, lettuce, bell pepper, dressed with strawberry balsamic and oregano.",
    price: 22,
    weight: 300,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Ffceff558-18f0-463e-be32-f6a8a57dbe49-752x552x100.webp&w=828&q=75"
  }, {
    id: "caesar-salad",
    name: "Caesar Salad",
    price: 25,
    options: [{name: "With chicken", price: 0}, {name: "With shrimps", price: 15}, {name: "With salmon", price: 15}],
    weight: 300,
    description: "Romaine lettuce, croutons, parmesan, iceberg lettuce, cherry tomatoes, egg, caesar dressing.",
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fc5ced871-daf1-4037-a65e-74fbb39253c5-752x552x100.webp&w=828&q=75"
  }]
}, {
  category: "Pizza & Bakery",
  items: [{
    id: "mushroom-pizza",
    name: "Mushroom Pizza",
    description: "Pizza dough, egg, champignon mushrooms, cream, truffle oil, mozzarella, parmesan, oregano.",
    price: 40,
    weight: 500,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F68d39583-8ef3-496d-b806-8805ad845600-752x552x100.webp&w=828&q=75"
  }, {
    id: "pepperoni-pizza",
    name: "Pepperoni Pizza",
    description: "Pizza dough, pepperoni, tomato sauce, mozzarella, olive oil, oregano.",
    price: 45,
    weight: 500,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fcd21174a-dda4-4a13-ac2f-ea01f788b3a4-752x552x100.webp&w=828&q=75"
  }, {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    description: "Pizza dough, tomato sauce, oregano, parmesan, olive oil, basil, cherry tomatoes.",
    price: 45,
    weight: 700,
    image: "/v2/margherita-pizza.jpg"
  }, {
    id: "shrimp-pizza",
    name: "Shrimp Pizza",
    description: "Pizza dough, pesto, shrimps, sun-dried tomatoes, mozzarella, parmesan, tomato sauce, red onion, red bell pepper.",
    price: 45,
    weight: 700,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F820c56d5-cadd-43a0-8bbf-6d41a9b9fcc9-254x196x100.webp&w=640&q=100"
  }, {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    description: "Pizza dough, gouda cheese, parmesan, mozzarella, blue cheese, cream.",
    price: 45,
    weight: 700,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fbeef1b2d-1079-4811-9ea1-bf84c5e873eb-752x552x100.webp&w=828&q=75"
  }, {
    id: "calzone",
    name: "Calzone",
    description: "Dough, cream cheese, cream, mushrooms, turkey mortadella, mozzarella, parmesan, peeled tomato.",
    price: 45,
    weight: 500,
    image: "/v2/calzone.jpg"
  }, {
    id: "quesadilla",
    name: "Quesadilla",
    options: [{name: "With chicken", price: 0}, {name: "With beef", price: 5}],
    description: "Tortilla, mozzarella, bell pepper, onion, tomato, sour cream.",
    price: 25,
    weight: 200,
    image: "/v2/quesadilla.jpg"
  }, {
    id: "imeretian-khachapuri",
    name: "Imeretian Khachapuri",
    description: "Dough, Imeretian cheese, sulguni cheese, egg, butter.",
    price: 30,
    weight: 700,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F4b168ef6-8199-4309-9a7a-5e52738b757b-752x552x100.webp&w=828&q=75"
  }, {
    id: "adjarian-khachapuri",
    name: "Adjarian Khachapuri",
    description: "Dough, Imeretian and sulguni cheese, egg, butter, cream.",
    price: 30,
    weight: 700,
    image: "/v2/adjarian-khachapuri.jpg"
  }]
}, {
  category: "Burgers",
  items: [{
    id: "classic-burger",
    name: "Classic Burger",
    description: "Burger bun, beef patty, sesame seeds, caramelized onion, cheddar cheese, tomato, iceberg lettuce, sunflower oil.",
    price: 40,
    weight: 400,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F3def9b60-864c-4223-b93b-72dd0a149f3f-752x552x100.webp&w=828&q=75"
  }, {
    id: "cheeseburger",
    name: "Cheeseburger",
    description: "Burger bun, bacon, cheddar cheese, special sauce, caramelized onion, pickles, beef patty, ketchup, sunflower oil.",
    price: 40,
    weight: 400,
    image: "/v2/cheeseburger.jpg"
  }]
}, {
  category: "Sauces",
  items: [{id: "ketchup", name: "Ketchup", price: 2, image: "/v2/sauces.webp"}, {
    id: "mayonnaise",
    name: "Mayonnaise",
    price: 2,
    image: "/v2/sauces.webp"
  }, {id: "sweet-spicy", name: "Sweet-Spicy Sauce", price: 3, image: "/v2/sauces.webp"}, {
    id: "jalapeno",
    name: "Jalapeño Sauce",
    price: 3,
    image: "/v2/sauces.webp"
  }, {id: "soy-sauce", name: "Soy Sauce", price: 3, image: "/v2/sauces.webp"}, {
    id: "sriracha",
    name: "Sriracha",
    price: 3,
    image: "/v2/sauces.webp"
  }, {id: "unagi-sauce", name: "Unagi Sauce", price: 3, image: "/v2/sauces.webp"}, {
    id: "kimchi-sauce",
    name: "Kimchi Sauce",
    price: 3,
    image: "/v2/sauces.webp"
  }]
}, {
  category: "Drinks",
  items: [{
    id: "coca-cola",
    name: "Coca-Cola",
    price: 7,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F2620902a-0971-4e4f-a29d-8a10c0769848-752x552x100.webp&w=828&q=75",
    description: "330 ml"
  }, {
    id: "coca-cola-zero",
    name: "Coca-Cola Zero",
    price: 7,
    description: "330 ml",
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F94240dbc-d8b2-4346-93ae-014a6045b809-752x552x100.webp&w=828&q=75"
  }, {
    id: "schweppes-tonic",
    name: "Schweppes Tonic",
    description: "250 ml",
    price: 10,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F84c76500-5732-4fe7-8934-430cfa6697e6-752x552x100.webp&w=828&q=75"
  }, {
    id: "red-bull",
    name: "Red Bull",
    description: "250 ml",
    price: 12,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F0c722f6a-1c1e-4caf-af5b-5322f5041613-752x552x100.webp&w=828&q=75"
  }, {
    id: "heineken",
    name: "Heineken",
    description: "330 ml",
    price: 15,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F25410de8-8315-44ad-a0c3-0723aa87ff91-752x552x100.webp&w=828&q=75"
  }, {
    id: "corona-033",
    name: "Corona 0.33",
    description: "330 ml",
    price: 15,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fba86ce0f-c612-40b5-afbb-09f423dd0fd9-752x552x100.webp&w=828&q=75"
  }, {
    id: "bakhmaro",
    name: "Bakhmaro Still Water (Glass)",
    description: "500 ml",
    price: 5,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F39a91862-e634-4b62-800c-42323ccb5d22-752x552x100.webp&w=828&q=75"
  }, {
    id: "borjomi",
    name: "Borjomi Mineral Water (Glass)",
    description: "500 ml",
    price: 6,
    image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fcee2fe44-672f-4cdb-a04f-eff8c453a4b9-752x552x100.webp&w=828&q=75"
  }]
}].map(cat => ({
  category: cat.category,
  items: cat.items.map(it => ({
    ...it,
    image: it.image.indexOf("/v2/") > -1 ? it.image : `/v2/${slugify(it.name)}.webp`,
  }))
}));

function slugify(str) {
  return String(str)
    // нормализуем Unicode и удаляем диакритику (например é -> e)
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    // заменим скобки на пробел, чтобы сохранить текст внутри, но убрать сами скобки
    .replace(/[()]/g, ' ')
    // все не-латинские буквы и цифры => разделитель (включая пробелы, запятые и т.д.)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    // к нижнему регистру
    .toLowerCase()
    // обрезаем ведущие/концевые дефисы
    .replace(/^-+|-+$/g, '');
}

function flattenMenu(menuJson) {
  // menuJson имеет структуру: [{category: "...", items: [...]}, ...]
  const rows = [];
  for (const cat of menuJson) {
    const categoryName = cat.category || "Без категории";
    for (const item of (cat.items || [])) {
      rows.push({
        category: categoryName,
        id: item.id || item.itemId || item.name,
        name: item.name || "",
        description: item.description || "",
        price: typeof item.price !== "undefined" ? item.price : "",
        image: item.image || "",
      });
    }
  }
  return rows;
}

async function fetchImageAsArrayBuffer(url) {
  // Пытаемся получить картинку как arrayBuffer (нужен для exceljs)
  try {
    const resp = await fetch(url, {mode: "cors"});
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob = await resp.blob();
    const buffer = await blob.arrayBuffer();
    // определить расширение
    const contentType = blob.type || "";
    let ext = "";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpeg";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else ext = "png"; // дефолт
    return {buffer, ext};
  } catch (err) {
    console.warn("fetchImageAsArrayBuffer failed for", url, err);
    throw err;
  }
}

export default function MenuWithExcelExport() {
  const [menu] = useState(allowedProducts);
  const [loading, setLoading] = useState(false);

  const rows = flattenMenu(menu);

  useEffect(() => {
    // ничего не трогаем: JSON как есть
  }, []);

  async function handleExport() {
    setLoading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Menu Export";
      workbook.created = new Date();
      const sheet = workbook.addWorksheet("Menu");

      // Колонки
      sheet.columns = [
        {header: "კატეგორია", key: "category", width: 25},
        {header: "დასახელება", key: "name", width: 30},
        {header: "შემადგენლობა", key: "description", width: 50},
        {header: "ფასი (₾)", key: "price", width: 12},
        {header: "სურათი", key: "image", width: 20},
      ];

      // Начнём со строки 2 — первая будет заголовком
      let currentRowIndex = 2;

      // Предварительно добавим строки данных (пустые) — пригодится, чтобы потом вставлять картинки
      for (const r of rows) {
        sheet.addRow({
          category: r.category,
          name: r.name,
          description: r.description,
          price: r.price,
          image: "",
        });
      }

      // Установим высоту строк под картинку (например, 110 пикселей)
      const IMAGE_ROW_HEIGHT = 110; // примерно
      for (let i = 2; i < 2 + rows.length; i++) {
        sheet.getRow(i).height = IMAGE_ROW_HEIGHT * 0.75; // exceljs uses points; approx adjust
      }

      // Попытаемся вставить картинки одну за другой
      for (let i = 0; i < rows.length; i++) {
        const rowNumber = 2 + i;
        const r = rows[i];
        const url = r.image;
        if (!url) continue;

        let succeeded = false;
        // Пробуем загрузить картинку (CORS может помешать)
        try {
          const {buffer, ext} = await fetchImageAsArrayBuffer(url);
          // exceljs требует либо base64, либо buffer (Uint8Array)
          const imageId = workbook.addImage({
            buffer: Buffer.from(buffer),
            extension: ext === "jpeg" ? "jpeg" : ext, // exceljs accepts "jpeg" or "png" etc.
          });

          // Вставляем картинку в колонку E (5-я колонка)
          // Координаты: tl - top-left (col, row), ext - размеры в пикселях
          // Подбираем ширину/высоту: пусть картинка 160x100 (пример)
          sheet.addImage(imageId, {
            tl: {col: 4 /* zero-based: A=0,B=1,... -> column E index 4 */, row: rowNumber - 1},
            ext: {width: 160, height: 160},
          });

          succeeded = true;
        } catch (err) {
          // fetch failed (честно: обычно из-за CORS)
          succeeded = false;
        }

        if (!succeeded) {
          // fallback: вставляем формулу IMAGE(url) в колонку E (будет работать в Excel 365 / Google Sheets)
          try {
            // ExcelJS не поддерживает формулы IMAGE в старых версиях, но можно попытаться вставить строкой.
            // Вставим в видимую колонку текст "IMAGE(url)" либо сами формулу:
            const cell = sheet.getCell(`E${rowNumber}`);
            // Некоторые Excel не поймут формулу IMAGE, но Google Sheets — да.
            cell.value = {formula: `IMAGE("${url}")`};
          } catch (err) {
            // На всякий — просто оставим URL в колонке F (imageUrl) — пользователь увидит ссылку
            sheet.getCell(`F${rowNumber}`).value = url;
          }
        }
      }

      // Стили: жирный заголовок
      sheet.getRow(1).font = {bold: true};

      // Генерируем файл
      const buf = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buf], {type: "application/octet-stream"});
      saveAs(blob, `menu-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Export failed:", err);
      alert(
        "Ошибка при создании Excel. Посмотри консоль. Возможно блокирует CORS для картинок. В таком случае попробуй проксировать изображения или загрузить их локально."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">მენიუ (таблица)</h1>
        <div>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Генерация..." : "Скачать Excel (с фото)"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="grid grid-cols-1 gap-6">
          {menu.map((cat) => (
            <div key={cat.category} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{cat.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(cat.items || []).map((it) => (
                  <div
                    key={it.id || it.name}
                    className="flex bg-gray-50 rounded overflow-hidden shadow-sm"
                  >
                    {it.image && (
                      // <img> использует браузер (CORS для отображения обычно не требуется)
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{width: 120, height: 90, objectFit: "cover"}}
                        loading="lazy"
                      />
                    )}
                    <div className="p-3 flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{it.name}</div>
                        <div className="font-bold">{it.price} ₾</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {it.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Примечание: если картинки не вставляются в файл — скорее всего сервер блокирует CORS. В этом случае Excel
        получит ссылку и (по возможности) формулу IMAGE(url).
      </p>
    </div>
  );
}
