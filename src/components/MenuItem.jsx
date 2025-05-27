import React from 'react';
import ImageViewer from './ImageViewer';
import { translations } from '../data/translations';

function MenuItem({ item, language, isFood, addToCart }) {
  const [showImage, setShowImage] = React.useState(false);

  return (
    <>
      <div className="flex items-center py-3 border-b border-gray-700 rounded-lg transition-transform duration-200 transform hover:scale-[1.02] hover:bg-gray-800">
        <img
          src={item.image}
          alt={item.name[language]}
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mr-3 cursor-pointer"
          onClick={() => setShowImage(true)}
        />
        <div className="flex-1 pr-2">
          <h3 className="text-lg md:text-xl font-semibold text-yellow-400">{item.name[language]}</h3>
          <p className="text-gray-300 text-sm md:text-base">{item.description[language]}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400 text-sm md:text-base">
              {isFood ? `${item.calories} ${translations[language].calories}` : `${item.volume} ${translations[language].volume}`}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-400 font-bold text-sm md:text-base mr-2">
                {item.price} {translations[language].price}
              </span>
              <button
                onClick={() => addToCart(item)}
                className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-sm hover:bg-yellow-500 transition-transform duration-200 transform hover:scale-105"
              >
                {translations[language].addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showImage && (
        <ImageViewer
          imageSrc={item.image}
          onClose={() => setShowImage(false)}
        />
      )}
    </>
  );
}

export default MenuItem;