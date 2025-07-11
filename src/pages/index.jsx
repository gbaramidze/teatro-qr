import React from 'react';
import MenuPage from "./menu/page";

// function App() {
//   const [section, setSection] = React.useState(null);
//   const [activeCategory, setActiveCategory] = React.useState(null);
//   const [language, setLanguage] = React.useState('ru');
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [cart, setCart] = React.useState([]);
//   const [menu, setMenu] = useState([]);
//
//   useEffect(() => {
//     fetch(
//       'https://teatro.eat-me.online/api/v1/menu'
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setMenu(data.result?.itemCategories.filter((cat) => cat.isHidden === false));
//         setActiveCategory(data[0]?.category);
//       })
//       .catch((error) => console.error('Error fetching menu:', error)
//       )
//   }, []);
//
//
//   const addToCart = (item) => {
//     setCart([...cart, item]);
//   };
//
//   const removeFromCart = (id) => {
//     const index = cart.findIndex((item) => item.id === id);
//     if (index !== -1) {
//       const newCart = [...cart];
//       newCart.splice(index, 1);
//       setCart(newCart);
//     }
//   };
//
//   const categories = useMemo(() => menu?.map((cat) => ({
//     name: cat.name,
//     thumb: cat.items.find(item =>
//       item.itemSizes.some(size =>
//         size.buttonImage && size.buttonImage['44x44x100.webp']
//       )
//     )?.itemSizes.find(size =>
//       size.buttonImage && size.buttonImage['44x44x100.webp']
//     )?.buttonImage['44x44x100.webp']
//   })), [menu]);
//
//   React.useEffect(() => {
//     if (section) {
//       setActiveCategory(categories?.[0] || null);
//       setSearchQuery('');
//     }
//   }, [section, categories]);
//
//   React.useEffect(() => {
//     if (section) {
//       const handleScroll = () => {
//         const sections = mockData[section].map((sec) =>
//           document.getElementById(`${section}-${sec.category}`)
//         );
//         const scrollPosition = window.scrollY + 100;
//
//         for (let i = sections.length - 1; i >= 0; i--) {
//           if (sections[i] && sections[i].offsetTop <= scrollPosition) {
//             setActiveCategory(mockData[section][i].category);
//             break;
//           }
//         }
//       };
//
//       window.addEventListener('scroll', handleScroll);
//       return () => window.removeEventListener('scroll', handleScroll);
//     }
//   }, [section]);
//
//
//   return (
//     <div className="max-w-4xl mx-auto relative pb-16 md:pb-0">
//       <Logo/>
//       <Cart cartItems={cart} removeFromCart={removeFromCart} language={language}/>
//       {!section ? (
//         <SectionSelector section={section} setSection={setSection} language={language}/>
//       ) : (
//         <>
//           <button
//             className="mb-4 text-gray-300 hover:text-yellow-400 text-sm md:text-base transition-transform duration-200 transform hover:scale-105"
//             onClick={() => setSection(null)}
//           >
//             <i className="fas fa-arrow-left mr-2"></i>
//             {translations[language].back}
//           </button>
//           <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language}/>
//           <TopBar/>
//           <CategoryNav
//             categories={categories}
//             activeCategory={activeCategory}
//             setActiveCategory={setActiveCategory}
//             section={section}
//             language={language}
//           />
//           {mockData[section].map((sec) => (
//             <MenuSection
//               key={sec.category}
//               category={sec.category}
//               items={sec.items}
//               section={section}
//               language={language}
//               addToCart={addToCart}
//               searchQuery={searchQuery}
//             />
//           ))}
//         </>
//       )}
//     </div>
//   );
// }


export default MenuPage;