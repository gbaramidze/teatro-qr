"use client";
import React, {useEffect, useState} from "react";

const allowedProducts = [
  {
    category: "Snacks & Starters",
    items: [
      {
        id: "american-fries",
        name: "American Fries",
        price: 15,
        weight: 250,
        description: "Fried potato sticks, oil, salt.",
        adds: [
          {name: "With ketchup", price: 2},
          {name: "With mayonnaise", price: 2}
        ],
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fd5bcc3c6-3be8-42ef-8208-50a036b3b20f-752x552x100.webp&w=828&q=75"
      },
      {
        id: "cheese-sticks",
        name: "Cheese Sticks (5 pcs)",
        price: 30,
        weight: 200,
        description: "Mozzarella, bread crumbs, egg, flour, oil.",
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F8ecb53ef-17b2-4ae1-af97-4f58088ea06e-752x552x100.webp&w=828&q=75"
      },
      {
        id: "tempura-shrimps",
        name: "Tempura Shrimps (5 pcs)",
        description: "Shrimps, tempura batter, oil.",
        price: 30,
        weight: 200,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F74e9d6f3-083f-4023-9f7e-31c904b8a44c-752x552x100.webp&w=828&q=75"
      },
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        price: 30,
        description: "Grilled chicken, lettuce, tomato, and mayo on toasted bread.",
        weight: 300,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F8ab8fa3d-2fbb-4c3d-9d1c-1d08baa5df8d-752x552x100.webp&w=828&q=75"
      },
      {
        id: "tigrado",
        name: "Tigrado",
        description: "Tempura-fried fish with shrimps, cream cheese, spicy mayo, egg, and unagi sauce.",
        price: 45,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F4ddb0a62-037a-4a79-9edf-9c2de1d38d73-752x552x100.webp&w=828&q=75"
      }
    ]
  },
  {
    category: "Sushi Rolls",
    items: [
      {
        id: "philadelphia",
        name: "Philadelphia",
        description: "Salmon, rice, nori, cream cheese, avocado.",
        price: 35,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Ff2fa48ac-711a-4a40-a3de-c8199a9633ea-752x552x100.webp&w=828&q=75"
      },
      {
        id: "salmon-plus",
        name: "Salmon Plus",
        description: "Salmon, rice, nori, cream cheese, cucumber, spicy mayo.",
        price: 40,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F9040c2a0-2ff0-4211-8a5c-dbde86ee2aa3-752x552x100.webp&w=828&q=75"
      },
      {
        id: "crazy-monkey",
        name: "Crazy Monkey",
        description: "Tempura, rice, nori, cream cheese, shrimps, spicy mayo, sesame mix.",
        price: 40,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F64be4bfa-441c-4612-aed8-59e2b9b9166c-752x552x100.webp&w=828&q=75"
      },
      {
        id: "dragon-roll",
        name: "Dragon Roll",
        description: "Rice, nori, cream cheese, salmon, unagi, sesame mix, apple, unagi sauce.",
        price: 40,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F42bad3b4-677d-405e-afa4-9a76ca40b057-752x552x100.webp&w=828&q=75"
      },
      {
        id: "hot-salmon-roll",
        name: "Hot Salmon Roll",
        description: "Rice, nori, cream cheese, salmon, spicy mayo, tempura flakes, unagi sauce.",
        price: 40,
        weight: 250,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F6ffe9d34-f646-4aa9-a9a3-4f81b6b9a1cb-752x552x100.webp&w=828&q=75"
      },
      {
        id: "avocado-maki",
        name: "Avocado Maki",
        description: "Rice, nori, avocado.",
        price: 12,
        weight: 150,
        image: "/v2/avocado-maki.jpg"
      },
      {
        id: "cucumber-maki",
        name: "Cucumber Maki",
        description: "Rice, nori, cucumber.",
        price: 10,
        weight: 150,
        image: "/v2/cucumber-maki.jpg"
      },
      {
        id: "tuna-maki",
        name: "Tuna Maki",
        description: "Rice, nori, tuna.",
        price: 15,
        weight: 150,
        image: "/v2/tuna-maki.jpg"
      },
      {
        id: "unagi-maki",
        name: "Unagi Maki",
        description: "Rice, nori, unagi, unagi sauce, sesame mix.",
        price: 20,
        weight: 150,
        image: "/v2/unagi-maki.jpg"
      }
    ]
  },
  {
    category: "Salads",
    items: [
      {
        id: "georgian-salad",
        name: "Georgian Salad",
        description: "Fresh tomatoes, cucumbers, onions, herbs, and traditional Georgian spices.",
        price: 15,
        weight: 300,
        options: [{name: "With walnuts", price: 5}],
        image: "/v2/georgian-salad.jpg"
      },
      {
        id: "greek-salad",
        name: "Greek Salad",
        description: "Fresh vegetables, feta cheese, olives, lettuce, bell pepper, dressed with strawberry balsamic and oregano.",
        price: 22,
        weight: 300,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Ffceff558-18f0-463e-be32-f6a8a57dbe49-752x552x100.webp&w=828&q=75"
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        price: 25,
        options: [
          {name: "With chicken", price: 0},
          {name: "With shrimps", price: 15},
          {name: "With salmon", price: 15}
        ],
        weight: 300,
        description: "Romaine lettuce, croutons, parmesan, iceberg lettuce, cherry tomatoes, egg, caesar dressing.",
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fc5ced871-daf1-4037-a65e-74fbb39253c5-752x552x100.webp&w=828&q=75"
      }
    ]
  },
  {
    category: "Pizza & Bakery",
    items: [
      {
        id: "mushroom-pizza",
        name: "Mushroom Pizza",
        description: "Pizza dough, egg, champignon mushrooms, cream, truffle oil, mozzarella, parmesan, oregano.",
        price: 40,
        weight: 500,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F68d39583-8ef3-496d-b806-8805ad845600-752x552x100.webp&w=828&q=75"
      },
      {
        id: "pepperoni-pizza",
        name: "Pepperoni Pizza",
        description: "Pizza dough, pepperoni, tomato sauce, mozzarella, olive oil, oregano.",
        price: 45,
        weight: 500,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fcd21174a-dda4-4a13-ac2f-ea01f788b3a4-752x552x100.webp&w=828&q=75"
      },
      {
        id: "margherita-pizza",
        name: "Margherita Pizza",
        description: "Pizza dough, tomato sauce, oregano, parmesan, olive oil, basil, cherry tomatoes.",
        price: 45,
        weight: 700,
        image: "/v2/margherita-pizza.jpg"
      },
      {
        id: "shrimp-pizza",
        name: "Shrimp Pizza",
        description: "Pizza dough, pesto, shrimps, sun-dried tomatoes, mozzarella, parmesan, tomato sauce, red onion, red bell pepper.",
        price: 45,
        weight: 700,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F820c56d5-cadd-43a0-8bbf-6d41a9b9fcc9-254x196x100.webp&w=640&q=100"
      },
      {
        id: "quattro-formaggi",
        name: "Quattro Formaggi",
        description: "Pizza dough, gouda cheese, parmesan, mozzarella, blue cheese, cream.",
        price: 45,
        weight: 700,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fbeef1b2d-1079-4811-9ea1-bf84c5e873eb-752x552x100.webp&w=828&q=75"
      },
      {
        id: "calzone",
        name: "Calzone",
        description: "Dough, cream cheese, cream, mushrooms, turkey mortadella, mozzarella, parmesan, peeled tomato.",
        price: 45,
        weight: 500,
        image: "/v2/calzone.jpg"
      },
      {
        id: "quesadilla",
        name: "Quesadilla",
        options: [
          {name: "With chicken", price: 0},
          {name: "With beef", price: 5}
        ],
        description: "Tortilla, mozzarella, bell pepper, onion, tomato, sour cream.",
        price: 25,
        weight: 200,
        image: "/v2/quesadilla.jpg"
      },
      {
        id: "imeretian-khachapuri",
        name: "Imeretian Khachapuri",
        description: "Dough, Imeretian cheese, sulguni cheese, egg, butter.",
        price: 30,
        weight: 700,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F4b168ef6-8199-4309-9a7a-5e52738b757b-752x552x100.webp&w=828&q=75"
      },
      {
        id: "adjarian-khachapuri",
        name: "Adjarian Khachapuri",
        description: "Dough, Imeretian and sulguni cheese, egg, butter, cream.",
        price: 30,
        weight: 700,
        image: "/v2/adjarian-khachapuri.jpg"
      }
    ]
  },
  {
    category: "Burgers",
    items: [
      {
        id: "classic-burger",
        name: "Classic Burger",
        description: "Burger bun, beef patty, sesame seeds, caramelized onion, cheddar cheese, tomato, iceberg lettuce, sunflower oil.",
        price: 40,
        weight: 400,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F3def9b60-864c-4223-b93b-72dd0a149f3f-752x552x100.webp&w=828&q=75"
      },
      {
        id: "cheeseburger",
        name: "Cheeseburger",
        description: "Burger bun, bacon, cheddar cheese, special sauce, caramelized onion, pickles, beef patty, ketchup, sunflower oil.",
        price: 40,
        weight: 400,
        image: "/v2/cheeseburger.jpg"
      }
    ]
  },
  {
    category: "Sauces",
    items: [
      {id: "ketchup", name: "Ketchup", price: 2, image: "/v2/sauces.webp"},
      {id: "mayonnaise", name: "Mayonnaise", price: 2, image: "/v2/sauces.webp"},
      {id: "sweet-spicy", name: "Sweet-Spicy Sauce", price: 3, image: "/v2/sauces.webp"},
      {id: "jalapeno", name: "Jalapeño Sauce", price: 3, image: "/v2/sauces.webp"},
      {id: "soy-sauce", name: "Soy Sauce", price: 3, image: "/v2/sauces.webp"},
      {id: "sriracha", name: "Sriracha", price: 3, image: "/v2/sauces.webp"},
      {id: "unagi-sauce", name: "Unagi Sauce", price: 3, image: "/v2/sauces.webp"},
      {id: "kimchi-sauce", name: "Kimchi Sauce", price: 3, image: "/v2/sauces.webp"}
    ]
  },
  {
    category: "Drinks",
    items: [
      {
        id: "cola",
        name: "Coca-Cola",
        price: 7,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F2620902a-0971-4e4f-a29d-8a10c0769848-752x552x100.webp&w=828&q=75",
        description: "330 ml"
      },
      {
        id: "cola-zero",
        name: "Coca-Cola Zero",
        price: 7,
        description: "330 ml",
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F94240dbc-d8b2-4346-93ae-014a6045b809-752x552x100.webp&w=828&q=75"
      },
      {
        id: "schweppes-tonic",
        name: "Schweppes Tonic",
        description: "250 ml",
        price: 10,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F84c76500-5732-4fe7-8934-430cfa6697e6-752x552x100.webp&w=828&q=75"
      },
      {
        id: "red-bull",
        name: "Red Bull",
        description: "250 ml",
        price: 12,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F0c722f6a-1c1e-4caf-af5b-5322f5041613-752x552x100.webp&w=828&q=75"
      },
      {
        id: "heineken",
        name: "Heineken",
        description: "330 ml",
        price: 15,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F25410de8-8315-44ad-a0c3-0723aa87ff91-752x552x100.webp&w=828&q=75"
      },
      {
        id: "corona",
        name: "Corona 0.33",
        description: "330 ml",
        price: 15,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fba86ce0f-c612-40b5-afbb-09f423dd0fd9-752x552x100.webp&w=828&q=75"
      },
      {
        id: "bakhmaro",
        name: "Bakhmaro Still Water (Glass)",
        description: "500 ml",
        price: 5,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2F39a91862-e634-4b62-800c-42323ccb5d22-752x552x100.webp&w=828&q=75"
      },
      {
        id: "borjomi",
        name: "Borjomi Mineral Water (Glass)",
        description: "500 ml",
        price: 6,
        image: "https://qr.teatro.ge/_next/image/?url=https%3A%2F%2Ff3de18c8-cd97-436c-ad9e-8e1dc2839628.cdneu.syrve.com%2Feu%2F7542%2Fcee2fe44-672f-4cdb-a04f-eff8c453a4b9-752x552x100.webp&w=828&q=75"
      }
    ]
  }
];

export default function MenuPage() {
  const [menu, setMenu] = useState(allowedProducts);

  useEffect(() => {
    // The JSON already has categories and items properly structured
    if (allowedProducts && Array.isArray(allowedProducts.categories)) {
      setMenu(
        allowedProducts.categories.map(cat => ({
          // id: cat.id || cat.name,
          name: cat.name,
          items: cat.items || []
        }))
      );
    }
  }, []);

  if (!menu.length)
    return (
      <div className="text-center p-10 text-xl font-medium text-gray-600">
        Loading menu...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      {menu.map(category => (
        <div key={category.id} className="mb-14">
          <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-900 uppercase tracking-wide">
            {category.category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {category.items.map(item => {
              const size = item.itemSizes?.[0];
              const price = size?.prices?.[0]?.price || item.price || "-";
              const weight =
                size?.portionWeightGrams && size.portionWeightGrams > 0
                  ? `${size.portionWeightGrams} g`
                  : item.weight
                    ? `${item.weight} g`
                    : "";
              const img =
                size?.buttonImage?.["376x276x100.webp"] ||
                size?.buttonImage?.src ||
                item.image ||
                "";

              return (
                <div
                  key={item.id || item.itemId || item.name}
                  className="flex bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
                >
                  {img && (
                    <img
                      src={img}
                      alt={item.name}
                      className="w-38 h-38 object-cover flex-shrink-0"
                      loading="lazy"
                      style={{width: "200px", height: "150px"}}
                    />
                  )}

                  <div className="flex flex-col justify-between flex-grow px-4 py-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold text-black ml-2 whitespace-nowrap">
                          {price} ₾
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.description || ""}
                      </p>
                    </div>

                    {weight && (
                      <span className="text-gray-400 text-xs mt-2">
                        {weight}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}