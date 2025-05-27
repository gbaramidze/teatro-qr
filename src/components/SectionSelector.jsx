import React from 'react';
import { translations } from '../data/translations';

function SectionSelector({ section, setSection, language }) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-[80vh] gap-12 px-4">

      <button
        className={`flex flex-col items-center p-6 rounded-lg bg-cover bg-center bg-no-repeat hover:bg-gray-700 transition-opacity duration-200 transform hover:scale-105 w-full max-w-xs h-48 md:h-64 ${
          section === "drinks" ? "border-4 border-yellow-400" : ""
        }`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60')" }}
        onClick={() => setSection("drinks")}
      >
        <span className="text-lg md:text-xl font-medium text-white bg-gray-900 bg-opacity-50 px-4 py-2 rounded">
          {translations[language].bar}
        </span>
      </button>

      <button
        className={`flex flex-col items-center p-6 rounded-lg bg-cover bg-center bg-no-repeat hover:bg-gray-700 transition-opacity duration-200 transform hover:scale-105 w-full max-w-xs h-48 md:h-64 ${
          section === "food" ? "border-4 border-yellow-400" : ""
        }`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60')" }}
        onClick={() => setSection("food")}
      >
        <span className="text-lg md:text-xl font-medium text-white bg-gray-900 bg-opacity-50 px-4 py-2 rounded">
          {translations[language].kitchen}
        </span>
      </button>
    </div>
  );
}

export default SectionSelector;