export default function CategoryNav({categories, lang, activeCat, refs}) {
  return (
    <nav className="sticky top-0 z-10 bg-gray-900 flex overflow-x-auto px-2 py-3 space-x-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => refs.current[cat.id]?.scrollIntoView({behavior: "smooth"})}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeCat === cat.id ? "bg-yellow-500 text-black" : "bg-gray-700"}`}
        >
          {cat.title[lang]}
        </button>
      ))}
    </nav>
  );
}
