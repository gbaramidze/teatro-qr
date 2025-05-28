import React from 'react';
import { translations } from '../data/translations';
import styles from './CategoryNav.module.css';

function CategoryNav({ categories, activeCategory, setActiveCategory, section, language }) {
  return (
    <div className={`flex overflow-x-auto whitespace-nowrap py-3 sticky top-0 bg-gray-900 z-10 ${styles.hideScrollbar}`}>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-2 mx-1 text-sm md:text-lg font-medium transition-colors duration-300 transform hover:scale-105 ${
            activeCategory === category
              ? 'border-b-2 border-yellow-400 text-yellow-400'
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          onClick={() => {
            setActiveCategory(category);
            const element = document.getElementById(`${section}-${category}`);
            if (element) {
              window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth',
              });
            }
          }}
        >
          {translations[language][category]}
        </button>
      ))}
    </div>
  );
}

export default CategoryNav;