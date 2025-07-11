import React from 'react';
import {translations} from '../data/translations';

function LanguageSelector({language, setLanguage}) {
  return (
    <div className="flex">
      <select
        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="ru">{translations.ru.russian}</option>
        <option value="en">{translations.en.english}</option>
      </select>
    </div>
  );
}

export default LanguageSelector;