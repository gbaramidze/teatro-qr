export default function Header({lang, setLang}) {
  const LANGUAGES = ["ru", "en", "ka"];
  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Меню Клуба</h1>
      <div className="flex space-x-2">
        {LANGUAGES.map((l) => (
          <button
            key={l}
            className={`px-2 py-1 rounded ${lang === l ? "bg-yellow-500 text-black" : "bg-gray-800"}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
