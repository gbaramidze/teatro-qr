// pages/menu.js
import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {FiMinus, FiPlus, FiShoppingCart, FiX} from 'react-icons/fi';
import Logo from "../../components/Logo";
import ImageV2 from "./ImageV2";
import MenuNotification from "./MenuNotification";
import {MenuIcon, XIcon} from "lucide-react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [navScrollLeft, setNavScrollLeft] = useState(0);
  const categoryRefs = useRef({});
  const navRef = useRef(null);
  const observerRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://teatro.eat-me.online/api/v1/menu');
        const data = await response.json();
        const fetchedCategories = data.result.itemCategories
          .filter(cat => !cat.isHidden)
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            items: cat.items.filter(item => !item.isHidden)
          }));
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  // Intersection Observer for category highlighting
  useEffect(() => {
    if (categories.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0.1
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
          // Auto-scroll navigation to show active category
          const navElement = navRef.current;
          if (navElement) {
            const categoryButton = document.querySelector(`button[data-category-id="${entry.target.id}"]`);
            if (categoryButton) {
              const buttonRect = categoryButton.getBoundingClientRect();
              const navRect = navElement.getBoundingClientRect();
              const buttonCenter = buttonRect.left + buttonRect.width / 2 - navRect.left;
              const navCenter = navRect.width / 2;
              const scrollTo = navElement.scrollLeft + buttonCenter - navCenter;
              navElement.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
              });
            }
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    categories.forEach(category => {
      const element = categoryRefs.current[category.id];
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [categories]);

  // Navigation scroll handler
  const handleNavScroll = () => {
    if (navRef.current) {
      setNavScrollLeft(navRef.current.scrollLeft);
    }
  };

  // Scroll to category
  const scrollToCategory = (categoryId) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
    }
  };

  // Item modal functions
  const openItemModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
  };

  // Cart functions
  const addToCart = (item, qty = 1) => {
    const price = item.itemSizes[0]?.prices[0]?.price || 0;
    const newItem = {
      ...item,
      price,
      quantity: qty,
      totalPrice: price * qty
    };

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(cartItem =>
        cartItem.itemId === item.itemId);

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + qty,
          totalPrice: updatedCart[existingIndex].totalPrice + (price * qty)
        };
        return updatedCart;
      } else {
        return [...prevCart, newItem];
      }
    });

    // setShowCart(true);
    closeItemModal();
  };

  const updateCartItem = (index, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart => {
      const updatedCart = [...prevCart];
      updatedCart[index] = {
        ...updatedCart[index],
        quantity: newQuantity,
        totalPrice: updatedCart[index].price * newQuantity
      };
      return updatedCart;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  // Filter categories based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-800 text-stone-100 relative pb-16">
      <Head>
        <title>Teatro Nightclub Menu</title>
        <meta name="description" content="Explore our exquisite nightclub menu"/>
      </Head>
      <MenuNotification/>
      {/* Sticky Navigation */}
      <div className={"bg-stone-900 p-2"}>
        <Logo/>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Sidebar */}
          <div
            className={`
        fixed top-0 left-0 h-full w-64 bg-stone-900 p-4 z-50 overflow-y-auto
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
            onClick={(e) => e.stopPropagation()} // чтобы не закрывался при клике внутри
          >
            <button onClick={() => setSidebarOpen(false)} className="text-white mb-4">
              <XIcon className="w-5 h-5"/>
            </button>

            <nav className="flex flex-col space-y-2">
              {categories.map((category) => {
                const image = category.items
                  .find((item) =>
                    item.itemSizes.some(
                      (size) =>
                        size.buttonImage && size.buttonImage["44x44x100.webp"]
                    )
                  )
                  ?.itemSizes.find(
                    (size) =>
                      size.buttonImage && size.buttonImage["44x44x100.webp"]
                  )?.buttonImage["44x44x100.webp"];

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      scrollToCategory(category.id);
                      setSidebarOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded transition-colors flex gap-2 items-center 
                ${
                      activeCategory === category.id
                        ? "bg-yellow-500 text-black"
                        : "text-white hover:bg-stone-700"
                    }`}
                  >
                    {image && (
                      <img
                        src={image}
                        width={30}
                        height={30}
                        className="rounded-full mb-1"
                        alt=""
                      />
                    )}
                    {category.name.split("(")[0].trim()}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}


      <nav className="sticky top-0 z-30 bg-stone-900 border-b border-stone-600 shadow-lg shadow-black flex">
        <div className="flex items-center justify-between py-2 px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <MenuIcon className="w-6 h-6"/>
          </button>
        </div>

        <div
          ref={navRef}
          onScroll={handleNavScroll}
          className="flex overflow-x-auto space-x-1 py-3 px-4 scrollbar-hide hideScrollbar relative items-center"
        >
          {/* Левая тень */}
          {navScrollLeft > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 pointer-events-none"/>
          )}

          {/* Кнопки категорий */}
          {categories.map(category => (
            <button
              key={category.id}
              data-category-id={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`shrink-0 max-w-[200px] px-3 py-1 rounded-full text-sm text-ellipsis whitespace-nowrap overflow-hidden transition-colors
        ${activeCategory === category.id
                ? "bg-yellow-500 text-black"
                : "bg-transparent text-white hover:bg-stone-700"}
      `}
            >
              {category.name.split('(')[0].trim()}
            </button>
          ))}

          {/* Правая тень */}
          <div
            className="absolute right-0 top-0 bottom-0 from-stone-800 to-transparent z-10 pointer-events-none"/>
        </div>
      </nav>
      {/* Menu Content */}
      <main className="container mx-auto px-2 py-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <section
              key={category.id}
              id={category.id}
              ref={el => categoryRefs.current[category.id] = el}
            >
              <h2 className="text-1xl font-bold mb-2 text-yellow-500">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {category.items.map(item => {
                  const price = item.itemSizes[0]?.prices[0]?.price || 0;
                  const image = item.itemSizes[0]?.buttonImage?.['254x196x100.webp'] ||
                    item.itemSizes[0]?.buttonImage?.src ||
                    'https://placehold.co/600x400/333333/FFF/PNG?text=no%20image';
                  const inCart = cart.find(s => s.itemId === item.itemId)?.quantity
                  return (
                    <div
                      key={item.itemId}
                      className="bg-stone-950/30 flex flex-col rounded overflow-hidden cursor-pointer shadow-stone-900"

                    >
                      <div className="relative" onClick={() => openItemModal(item)}>
                        <ImageV2
                          src={image}
                          alt={item.name}
                          className="w-full object-cover"
                          loading={"lazy"}
                          height={392}
                          width={500}
                          placeholder={"blur"}
                          blurDataURL={`/_next/image?url=${image}&w=16&q=1`}
                          quality={100}
                        />
                      </div>
                      <div className="px-2 flex-1">
                        <h3
                          className="text-sm font-bold line-clamp-2 text-yellow-500 mt-1">{item.name}</h3>
                        <p className="text-stone-300 text-sm line-clamp-2">{item.description}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            addToCart(item, quantity);
                          }}
                          className="w-full bg-yellow-400 text-gray-800 shadow-md shadow-stone-800 text-xl py-0 px-2 rounded transition-colors font-500">
                          {inCart ? `${inCart} x - ` : ''} {price} ₾
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-stone-400">Loading...</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div
          className={`fixed bottom-4 right-4 z-20 transition-all duration-300 ${showCart ? 'opacity-0 pointer-events-none' : 'opacity-100'} animate-fade-left animate-once animate-duration-300 animate-ease-linear`}
        >
          <button
            onClick={() => setShowCart(true)}
            className="bg-yellow-600 text-white py-3 px-6 rounded-full shadow-lg font-bold flex items-center"
          >
            <FiShoppingCart className="mr-2"/>
            {totalPrice.toFixed(2)} ₾
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-75 flex items-center justify-center bottom-0 animate-fade-up animate-once animate-duration-400 animate-ease-in-out">
          <div
            className="bg-stone-800 max-w-4xl w-full h-full lg:h-80 overflow-y-auto hideScrollbar ">
            <div className="relative">
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 bg-stone-900 rounded-full p-2 text-white "
              >
                <FiX size={24}/>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:h-full">
                  <ImageV2
                    width={752}
                    height={552}
                    loading={"eager"}
                    placeholder={"blur"}
                    src={selectedItem.itemSizes[0]?.buttonImage?.['752x552x100.webp'] ||
                      selectedItem.itemSizes[0]?.buttonImage?.src ||
                      'https://placehold.co/600x400/333333/FFF/PNG/?text=no%20image'}
                    blurDataURL={`/_next/image?url=${selectedItem.itemSizes[0]?.buttonImage?.['752x552x100.webp'] ||
                    selectedItem.itemSizes[0]?.buttonImage?.src ||
                    'https://placehold.co/600x400/333333/FFF/PNG/?text=no%20image'}&w=16&q=1`}
                    alt={selectedItem.name}
                    className="object-cover lg:rounded-l-lg lg:rounded-tr-none"
                  />
                </div>

                <div className="p-2">
                  <h2 className="text-2xl font-bold text-yellow-500 mb-2">{selectedItem.name}</h2>
                  <p className="text-xl text-yellow-400 mb-4">
                    {selectedItem.itemSizes[0]?.prices[0]?.price || 0} ₾
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-stone-300">{selectedItem.description}</p>
                  </div>

                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="bg-stone-700 text-white p-2 rounded-l-lg"
                    >
                      <FiMinus/>
                    </button>
                    <span className="bg-stone-700/80 px-4 py-1 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="bg-stone-700 text-white p-2 rounded-r-lg"
                    >
                      <FiPlus/>
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(selectedItem, quantity)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center"
                  >
                    <FiShoppingCart className="mr-2"/>
                    Add {quantity} to Order - {(selectedItem.itemSizes[0]?.prices[0]?.price || 0) * quantity} ₾
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-30 bg-opacity-50"
             style={{
               background: 'rgba(14,27,42,0.59)'
             }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-stone-800 border-t border-yellow-600 rounded-t-2xl shadow-xl animate-fade-up animate-once animate-duration-300 animate-ease-linear">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-500">Your Order</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-stone-400 hover:text-white p-2"
                >
                  <FiX size={24}/>
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <p className="text-stone-400 text-center py-4">Your cart is empty</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.itemId}-${index}`}
                         className="flex justify-between items-center py-3 border-b border-stone-700">
                      <div className="flex-1">
                        <p className="text-yellow-400 font-medium">
                          <ImageV2
                            width={96}
                            height={96}
                            src={item.itemSizes[0]?.buttonImage?.['44x44x100.webp'] ||
                              item.itemSizes[0]?.buttonImage?.src ||
                              'https://placehold.co/600x400/333333/FFF/PNG/?text=no%20image'}
                            alt={item.name}
                            className="inline-block w-8 h-8 mr-2 rounded"/>
                          {item.name}</p>
                        <p className="text-sm text-stone-400">{item.price} ₾ × {item.quantity}</p>
                      </div>
                      <div className="flex items-center ml-4">
                        <button
                          onClick={() => updateCartItem(index, item.quantity - 1)}
                          className="text-stone-400 hover:text-yellow-500 p-1"
                        >
                          <FiMinus size={16}/>
                        </button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(index, item.quantity + 1)}
                          className="text-stone-400 hover:text-yellow-500 p-1"
                        >
                          <FiPlus size={16}/>
                        </button>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-400 ml-2 p-1"
                        >
                          <FiX size={18}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center mb-4 pt-2">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-xl font-bold text-yellow-500">{totalPrice.toFixed(2)} ₾</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}