import React from 'react';
import Logo from './components/Logo';
import LanguageSelector from './components/LanguageSelector';
import SearchBar from './components/SearchBar';
import Cart from './components/Cart';
import SectionSelector from './components/SectionSelector';
import CategoryNav from './components/CategoryNav';
import MenuSection from './components/MenuSection';
import { mockData} from './data/mockData';
import { translations } from './data/translations';

function App() {
  const [section, setSection] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState(null);
  const [language, setLanguage] = React.useState('ru');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [cart, setCart] = React.useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (id) => {
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  React.useEffect(() => {
    if (section) {
      setActiveCategory(mockData[section][0]?.category);
      setSearchQuery('');
    }
  }, [section]);

  React.useEffect(() => {
    if (section) {
      const handleScroll = () => {
        const sections = mockData[section].map((sec) =>
          document.getElementById(`${section}-${sec.category}`)
        );
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i] && sections[i].offsetTop <= scrollPosition) {
            setActiveCategory(mockData[section][i].category);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [section]);

  return (
    <div className="max-w-4xl mx-auto px-4 relative pb-16 md:pb-0">
      <Logo />
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <Cart cartItems={cart} removeFromCart={removeFromCart} language={language} />
      {!section ? (
        <SectionSelector section={section} setSection={setSection} language={language} />
      ) : (
        <>
          <button
            className="mb-4 text-gray-300 hover:text-yellow-400 text-sm md:text-base transition-transform duration-200 transform hover:scale-105"
            onClick={() => setSection(null)}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            {translations[language].back}
          </button>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />
          <CategoryNav
            categories={mockData[section].map((sec) => sec.category)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            section={section}
            language={language}
          />
          {mockData[section].map((sec) => (
            <MenuSection
              key={sec.category}
              category={sec.category}
              items={sec.items}
              section={section}
              language={language}
              addToCart={addToCart}
              searchQuery={searchQuery}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;