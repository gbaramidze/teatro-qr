import React from 'react';
import { translations } from '../data/translations';

function Cart({ cartItems, removeFromCart, language }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const groupedCart = cartItems.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
      existing.totalPrice += item.price;
    } else {
      acc.push({ ...item, quantity: 1, totalPrice: item.price });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = cartItems.length;

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-20 md:bottom-4 md:right-4 md:left-auto md:w-auto md:rounded-full ${cartItems.length ? 'block' : 'hidden'}`}>
        <button
          className="w-full md:w-auto bg-yellow-400 text-gray-900 px-4 py-3 md:rounded-full flex items-center justify-center text-sm transition-transform duration-200 transform hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          {itemCount > 0 ? (
            <>
              {itemCount} {translations[language].items} | {total} {translations[language].price}
            </>
          ) : (
            translations[language].cart
          )}
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-30 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400">{translations[language].cart}</h2>
            <button
              className="text-gray-300 hover:text-yellow-400 transition-transform duration-200 transform hover:scale-110"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i> {translations[language].close}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {itemCount === 0 ? (
              <div className="h-full"></div>
            ) : (
              <>
                {groupedCart.map((item) => (
                  <div key={item.id} className="flex items-center mb-3">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-3"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-gray-300 text-sm md:text-base">
                        {item.quantity}x {item.name[language]}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2 text-sm md:text-base">
                          {item.totalPrice} {translations[language].price}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-transform duration-200 transform hover:scale-110"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 border-t border-gray-700 pt-3">
                  <span className="text-lg md:text-xl font-bold text-yellow-400">
                    Total: {total} {translations[language].price}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;