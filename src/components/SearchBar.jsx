import React from 'react';
import { translations } from '../data/translations';

function SearchBar({ searchQuery, setSearchQuery, language }) {
  return (
    <div className="my-4">
      <input
        type="text"
        placeholder={translations[language].search}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
      />
    </div>
  );
}

export default SearchBar;