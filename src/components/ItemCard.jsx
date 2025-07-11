export default function ItemCard({item, lang}) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <img src={item.image} alt={item.name[lang]} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{item.name[lang]}</h3>
        <p className="text-sm text-gray-400 mb-2">{item.description[lang]}</p>
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 text-lg font-bold">₾{item.price}</span>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-xl">
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
