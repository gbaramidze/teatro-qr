// pages/menu.js
"use client"
import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import {FiMinus, FiPlus, FiShoppingCart, FiX} from 'react-icons/fi';
import Logo from "../../../components/Logo";
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
      rootMargin: '-80px 0px -70% 0px', // Adjusted to match the sticky header height
      threshold: 0
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
      const headerOffset = 80; // Sticky header (64px) + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
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
    <div className="min-h-screen bg-black text-stone-100 relative pb-16">
      <Head>
        <title>Teatro | Exclusive Lounge & Nightclub Menu</title>
        <meta name="description" content="Experience luxury dining and exclusive cocktails at Teatro Nightclub."/>
      </Head>
      <MenuNotification/>
      
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-900/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Static Logo Section */}
      <div className="bg-black py-6 flex justify-center border-b border-stone-900">
        <div className="scale-110">
          <Logo/>
        </div>
      </div>

      {/* Sticky Header with Hamburger and Categories in ONE LINE */}
      <header className="sticky top-0 z-40 glass">
        <div className="bg-black/40 backdrop-blur-md flex items-center h-16">
          {/* Hamburger Button (Fixed Left) */}
          <div className="pl-4 pr-2 shrink-0 border-r border-stone-800/50 h-full flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <MenuIcon className="w-6 h-6"/>
            </button>
          </div>

          {/* Scrollable Categories (Center - Flexible) */}
          <div
            ref={navRef}
            onScroll={handleNavScroll}
            className="flex-1 flex overflow-x-auto space-x-2 py-3 px-4 scrollbar-hide hideScrollbar items-center"
          >
            {categories.map(category => (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border uppercase tracking-widest whitespace-nowrap
                  ${activeCategory === category.id
                  ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  : "bg-stone-900/50 text-stone-500 border-stone-800 hover:border-stone-700 hover:text-stone-300"}
                `}
              >
                {category.name.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Cart Button (Fixed Right) */}
          {totalItems > 0 && (
            <div className="pr-4 pl-2 shrink-0 h-full flex items-center">
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-yellow-500"
              >
                <FiShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 transition-opacity duration-300 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Sidebar */}
          <div
            className={`
              fixed top-0 left-0 h-full w-80 bg-stone-900/90 backdrop-blur-xl p-8 z-50 overflow-y-auto
              transform transition-transform duration-500 ease-out border-r border-stone-800
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12">
              <Logo/>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-2 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5"/>
              </button>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-6">Menu Categories</h3>
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
                    className={`text-left px-4 py-3 rounded-2xl transition-all duration-300 flex gap-4 items-center group
                      ${
                        activeCategory === category.id
                          ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                          : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                      }`}
                  >
                    {image ? (
                      <img
                        src={image}
                        width={32}
                        height={32}
                        className="rounded-lg object-cover border border-black/10"
                        alt=""
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCategory === category.id ? "bg-black/10" : "bg-stone-800"}`}>
                        <MenuIcon size={16} />
                      </div>
                    )}
                    <span className="flex-1">{category.name.split("(")[0].trim()}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-12 pt-12 border-t border-stone-800">
               <p className="text-stone-500 text-sm italic">"The art of entertainment & fine dining"</p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 z-10 relative">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <section
              key={category.id}
              id={category.id}
              ref={el => categoryRefs.current[category.id] = el}
              className="mb-12 animate-fade-up animate-once"
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-display font-bold gold-text-gradient">
                  {category.name}
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.items.map(item => {
                  const price = item.itemSizes[0]?.prices[0]?.price || 0;
                  const image = item.itemSizes[0]?.buttonImage?.['254x196x100.webp'] ||
                    item.itemSizes[0]?.buttonImage?.src ||
                    'https://placehold.co/600x400/333333/FFF/PNG?text=no%20image';
                  const inCart = cart.find(s => s.itemId === item.itemId)?.quantity
                  
                  return (
                    <div
                      key={item.itemId}
                      className="group bg-stone-900/40 border border-stone-800 rounded-2xl overflow-hidden card-hover premium-shadow flex flex-row sm:flex-col h-auto sm:h-full"
                    >
                      {/* Image Container */}
                      <div 
                        className="relative w-28 h-28 sm:w-full sm:h-56 overflow-hidden shrink-0 cursor-pointer"
                        onClick={() => openItemModal(item)}
                      >
                        <ImageV2
                          src={image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          height={392}
                          width={500}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                        
                        {/* Price Badge on Image (Desktop Only) */}
                        <div className="absolute bottom-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg hidden sm:block">
                          {price} ₾
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0 justify-between relative">
                        <div className="mb-2 sm:mb-4">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-base sm:text-xl font-display font-bold text-stone-100 group-hover:text-yellow-500 transition-colors mb-1 truncate sm:whitespace-normal">
                              {item.name}
                            </h3>
                            {/* Price on Mobile (Hidden on Desktop) */}
                            <span className="text-yellow-500 font-bold sm:hidden shrink-0 whitespace-nowrap">
                              {price} ₾
                            </span>
                          </div>
                          <p className="text-stone-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Desktop Button */}
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="hidden sm:flex w-full py-3 rounded-xl font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-all items-center justify-center gap-2"
                          >
                            {inCart ? (
                              <>
                                <FiPlus className="w-4 h-4" />
                                Add Another ({inCart})
                              </>
                            ) : (
                              <>
                                <FiShoppingCart className="w-4 h-4" />
                                Add to Selection
                              </>
                            )}
                          </button>

                        {/* Compact Mobile Add Button */}
                        <div className="sm:hidden flex justify-end mt-auto pt-2">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all
                              ${inCart 
                                ? "bg-stone-800 text-yellow-500 border border-yellow-500/30" 
                                : "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 active:scale-90"}
                            `}
                          >
                            {inCart ? (
                              <>
                                <span className="text-xs">{inCart}</span>
                                <FiPlus className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span className="text-xs uppercase tracking-wider mr-1">Add</span>
                                <FiPlus className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-display text-stone-400">Preparing our finest selection...</p>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade animate-duration-300"
          onClick={closeItemModal}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-4xl w-full premium-shadow flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative md:w-1/2 h-64 md:h-auto">
              <ImageV2
                width={752}
                height={552}
                src={selectedItem.itemSizes[0]?.buttonImage?.['752x552x100.webp'] ||
                  selectedItem.itemSizes[0]?.buttonImage?.src ||
                  'https://placehold.co/600x400/333333/FFF/PNG/?text=no%20image'}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeItemModal}
                className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md hover:bg-black/80 rounded-full p-2 text-white transition-colors"
              >
                <FiX size={20}/>
              </button>
            </div>

            <div className="p-8 md:w-1/2 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-display font-bold gold-text-gradient">{selectedItem.name}</h2>
                </div>
                <p className="text-2xl font-bold text-yellow-500 mb-6">
                  {selectedItem.itemSizes[0]?.prices[0]?.price || 0} ₾
                </p>
                <p className="text-stone-400 leading-relaxed mb-8">
                  {selectedItem.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Quantity</span>
                  <div className="flex items-center bg-stone-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="text-stone-100 p-2 hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <FiMinus/>
                    </button>
                    <span className="px-6 py-1 font-bold text-lg min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="text-stone-100 p-2 hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <FiPlus/>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedItem, quantity)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 px-6 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(212,175,55,0.5)]"
                >
                  <FiShoppingCart className="w-5 h-5"/>
                  <span>Add to Selection — {((selectedItem.itemSizes[0]?.prices[0]?.price || 0) * quantity).toFixed(2)} ₾</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade animate-duration-300"
          onClick={() => setShowCart(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-stone-900 border-t border-yellow-600/30 rounded-t-[2.5rem] shadow-2xl animate-fade-up animate-duration-300 max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto p-6 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-display font-bold gold-text-gradient">Your Selection</h3>
                  <p className="text-stone-400 text-sm">{totalItems} items in order</p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-2 rounded-full transition-colors"
                >
                  <FiX size={24}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4 hideScrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                    <FiShoppingCart size={48} className="mb-4 opacity-20" />
                    <p className="text-lg">Your tray is empty</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.itemId}-${index}`}
                         className="flex items-center gap-4 py-4 px-4 bg-stone-800/40 rounded-2xl border border-stone-800">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <ImageV2
                          width={96}
                          height={96}
                          src={item.itemSizes[0]?.buttonImage?.['44x44x100.webp'] ||
                            item.itemSizes[0]?.buttonImage?.src ||
                            'https://placehold.co/600x400/333333/FFF/PNG/?text=no%20image'}
                          alt={item.name}
                          className="w-full h-full object-cover"/>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-stone-100 font-bold mb-1">{item.name}</h4>
                        <p className="text-yellow-500 font-medium">{item.price} ₾</p>
                      </div>

                      <div className="flex items-center bg-stone-800 rounded-xl p-1">
                        <button
                          onClick={() => updateCartItem(index, item.quantity - 1)}
                          className="text-stone-400 hover:text-yellow-500 p-1.5 transition-colors"
                        >
                          <FiMinus size={16}/>
                        </button>
                        <span className="mx-2 w-6 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(index, item.quantity + 1)}
                          className="text-stone-400 hover:text-yellow-500 p-1.5 transition-colors"
                        >
                          <FiPlus size={16}/>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-stone-500 hover:text-red-500 p-2 transition-colors"
                      >
                        <FiX size={18}/>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-lg">Total Amount</span>
                    <span className="text-3xl font-display font-bold text-yellow-500">{totalPrice.toFixed(2)} ₾</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}