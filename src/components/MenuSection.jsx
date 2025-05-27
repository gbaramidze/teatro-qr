import React from 'react';
import MenuItem from './MenuItem';
import { translations } from '../data/translations';

function MenuSection({ category, items, section, language, addToCart, searchQuery }) {
  const filteredItems = items.filter(
    (item) =>
      item.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description[language].toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredItems.length === 0) return null;

  return (
    <div id={`${section}-${category}`} className="pt-2">
      <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-3">{translations[language][category]}</h2>
      {filteredItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          language={language}
          isFood={section === "food"}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default MenuSection;