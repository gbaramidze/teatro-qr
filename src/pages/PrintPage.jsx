import React, {useEffect, useState} from 'react';

const PrintPage = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState(null);

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
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify(categories, null, 4)}
      </pre>
    </div>
  );
};

export default PrintPage;