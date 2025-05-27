import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      kitchen: "Kitchen",
      bar: "Bar",
      snacks: "Snacks",
      mainDishes: "Main Dishes",
      desserts: "Desserts",
      cocktails: "Cocktails",
      nonAlcoholic: "Non-Alcoholic Drinks",
      hotDrinks: "Hot Drinks",
      calories: "kcal",
      volume: "ml",
      price: "₾",
      language: "Language",
      russian: "Russian",
      english: "English",
      search: "Search",
      cart: "Cart",
      addToCart: "Add to Cart",
      removeFromCart: "Remove",
      back: "Back",
      items: "items",
      close: "Close"
    }
  },
  ru: {
    translation: {
      kitchen: "Кухня",
      bar: "Бар",
      snacks: "Закуски",
      mainDishes: "Основные блюда",
      desserts: "Десерты",
      cocktails: "Коктейли",
      nonAlcoholic: "Безалкогольные напитки",
      hotDrinks: "Горячие напитки",
      calories: "ккал",
      volume: "мл",
      price: "₾",
      language: "Язык",
      russian: "Русский",
      english: "Английский",
      search: "Поиск",
      cart: "Корзина",
      addToCart: "В корзину",
      removeFromCart: "Убрать",
      back: "Назад",
      items: "шт.",
      close: "Закрыть"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;