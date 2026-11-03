import type { MenuItem } from "@/types";
import { IMAGES, unsplash } from "./images";

export const LUXURY_MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: "dish-1",
    name: "Alba White Truffle & Hokkaido Scallop",
    description:
      "Pan-seared Hokkaido wild scallops, sunchoke velouté, brown butter emulsion, and freshly shaved Italian white Alba truffles.",
    price: 38,
    image: unsplash(IMAGES.platedDark, 900),
    category: "starters",
    tags: ["Signature", "Seafood", "Alba White Truffle"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Shellfish", "Dairy"],
    nutritionInfo: {
      calories: 340,
      protein: "28g",
      carbs: "12g",
      fat: "18g",
    },
  },
  {
    id: "dish-2",
    name: "Oscietra Royal Caviar & Truffled Brioche",
    description:
      "Imperial Oscietra caviar served on warm toasted pain brioche with Périgord black truffle cultured butter and chive crème fraîche.",
    price: 65,
    image: unsplash(IMAGES.platedElegant, 900),
    category: "starters",
    tags: ["Caviar", "Chef Reserve"],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    allergens: ["Fish", "Dairy", "Gluten"],
    nutritionInfo: {
      calories: 290,
      protein: "18g",
      carbs: "16g",
      fat: "19g",
    },
  },
  {
    id: "dish-3",
    name: "Truffle Arancini di Fontina",
    description:
      "Crisp Carnaroli saffron rice croquettes infused with black winter truffle, molten Fontina Val d'Aosta DOP, and aged balsamic glaze.",
    price: 24,
    image: unsplash(IMAGES.rusticSpread, 900),
    category: "starters",
    tags: ["Vegetarian", "Crispy"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Dairy", "Gluten"],
    nutritionInfo: {
      calories: 420,
      protein: "14g",
      carbs: "38g",
      fat: "22g",
    },
  },

  // Mains
  {
    id: "dish-4",
    name: "Wild Truffle Tagliatelle al Burro",
    description:
      "Handmade 40-yolk egg pasta ribboned with Normandy cultured butter, 36-month Parmigiano-Reggiano Vacche Rosse, and generous Alba truffle.",
    price: 48,
    image: unsplash(IMAGES.pasta, 900),
    category: "mains",
    tags: ["Signature", "Handmade Pasta", "Chef Masterpiece"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    nutritionInfo: {
      calories: 620,
      protein: "24g",
      carbs: "58g",
      fat: "32g",
    },
  },
  {
    id: "dish-5",
    name: "Miyazaki A5 Wagyu Tenderloin",
    description:
      "Charcoal-grilled Miyazaki Wagyu, Périgord black truffle demi-glace, smoked potato mousseline, and glazed baby Tokyo turnips.",
    price: 95,
    image: unsplash(IMAGES.steak, 900),
    category: "mains",
    tags: ["A5 Wagyu", "Grand Cru", "Signature"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Dairy"],
    nutritionInfo: {
      calories: 780,
      protein: "52g",
      carbs: "18g",
      fat: "56g",
    },
  },
  {
    id: "dish-6",
    name: "Acquerello Truffle Risotto",
    description:
      "Seven-year aged Acquerello carnaroli rice, mountain cultured butter, sweet white truffle foam, and shaved autumnal Norcia truffles.",
    price: 44,
    image: unsplash(IMAGES.pastaTruffle, 900),
    category: "mains",
    tags: ["Vegetarian", "Gluten-Free", "Aged Rice"],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    allergens: ["Dairy"],
    nutritionInfo: {
      calories: 540,
      protein: "12g",
      carbs: "62g",
      fat: "26g",
    },
  },

  // Desserts
  {
    id: "dish-7",
    name: "Valrhona Guanaja Truffle Torte",
    description:
      "70% Grand Cru chocolate ganache, fleur de sel smoked caramel, Piedmont hazelnut feuilletine, and Madagascar vanilla truffle gelato.",
    price: 22,
    image: unsplash(IMAGES.chocolate, 900),
    category: "desserts",
    tags: ["Signature", "Valrhona", "Vegetarian"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Dairy", "Nuts", "Gluten"],
    nutritionInfo: {
      calories: 460,
      protein: "8g",
      carbs: "44g",
      fat: "28g",
    },
  },
  {
    id: "dish-8",
    name: "White Truffle Honey Mille-Feuille",
    description:
      "Caramelized puff pastry layers, Tahitian vanilla bean mousseline, and acacia blossom white truffle honey drizzle.",
    price: 20,
    image: unsplash(IMAGES.dessert, 900),
    category: "desserts",
    tags: ["Artisanal Pastry"],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    allergens: ["Gluten", "Dairy", "Egg"],
    nutritionInfo: {
      calories: 390,
      protein: "6g",
      carbs: "42g",
      fat: "22g",
    },
  },

  // Beverages & Wine
  {
    id: "dish-9",
    name: "Barolo Riserva DOCG 'Truffle Reserve' 2016",
    description:
      "Piedmont, Italy. Deep garnet, dried rose petal, tar, wild blackberry, with structured tannins crafted for white truffle pairing.",
    price: 180,
    image: unsplash(IMAGES.wineCellar, 900),
    category: "beverages",
    tags: ["Grand Cru", "Cellar Vintage", "Sommelier Select"],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    allergens: ["Sulfites"],
  },
  {
    id: "dish-10",
    name: "Dom Pérignon Vintage Champagne Brut 2013",
    description:
      "Épernay, France. Citrus vibrancy, toasted brioche, white blossom, and smoky minerality.",
    price: 290,
    image: unsplash(IMAGES.wineGlasses, 900),
    category: "beverages",
    tags: ["Champagne", "Prestige Cuvée"],
    isAvailable: true,
    isPopular: false,
    isNew: false,
    allergens: ["Sulfites"],
  },
];
