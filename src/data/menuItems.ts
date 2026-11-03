import { IMAGES } from "./images";

// ============================================
// Menu page: the single source of truth.
//
// PLACEHOLDER MENU. These dishes, descriptions and photos are stand-ins until
// Truffles' real menu (and PDF) arrives. To go live, replace the entries
// below. Everything on /menu (categories, highlights, search, counts)
// updates from this file. `price` is optional and only shown when set
// (whole rupees, e.g. 1450).
// ============================================

export type MenuSectionId = "appetizers" | "mains" | "desserts" | "beverages";

export type DishTag = "bestseller" | "special" | "new" | "vegetarian" | "spicy";

export interface Dish {
  id: string;
  name: string;
  description: string;
  section: MenuSectionId;
  image: string;
  /** Whole rupees. Leave undefined until prices are confirmed. */
  price?: number;
  tags: DishTag[];
}

export const MENU_SECTIONS: { id: MenuSectionId; title: string; blurb: string }[] = [
  { id: "appetizers", title: "Appetizers", blurb: "Small plates to start the table." },
  { id: "mains", title: "Main Course", blurb: "Hearty plates from the grill and the kitchen." },
  { id: "desserts", title: "Desserts", blurb: "Something sweet to finish." },
  { id: "beverages", title: "Beverages", blurb: "Coffee, tea and cool drinks." },
];

const m = (file: string) => `/images/menu/${file}.jpg`;

export const MENU_ITEMS: Dish[] = [
  // ---------- Appetizers ----------
  { id: "chicken-wings", name: "Crispy Chicken Wings", description: "Golden wings tossed in house seasoning, served with a dipping sauce.", section: "appetizers", image: m("chicken-wings"), tags: ["bestseller", "spicy"] },
  { id: "tomato-soup", name: "Roasted Tomato Soup", description: "Slow-roasted tomato soup finished with fresh herbs.", section: "appetizers", image: m("tomato-soup"), tags: ["vegetarian"] },
  { id: "dumplings", name: "Dumpling Basket", description: "Steamed and pan-fried dumplings with a tangy dipping sauce.", section: "appetizers", image: m("dumplings"), tags: ["special"] },
  { id: "power-bowl", name: "Garden Power Bowl", description: "Fresh greens, chickpeas, avocado and seasonal vegetables.", section: "appetizers", image: m("power-bowl"), tags: ["vegetarian"] },
  { id: "meatballs", name: "Herb Meatball Bites", description: "Tender meatballs on a bed of greens with a sweet chilli glaze.", section: "appetizers", image: m("meatballs"), tags: [] },
  { id: "sharing-platter", name: "Sharing Platter", description: "A generous mix of bites for the table to share.", section: "appetizers", image: IMAGES.rusticSpread, tags: ["special"] },

  // ---------- Main Course ----------
  { id: "beef-burger", name: "Classic Beef Burger", description: "A juicy beef patty, fresh lettuce and tomato in a toasted bun, with fries.", section: "mains", image: m("beef-burger"), tags: ["bestseller"] },
  { id: "mixed-grill", name: "Mixed Grill Platter", description: "An assortment of grilled skewers with dips, roasted vegetables and sides.", section: "mains", image: m("mixed-grill"), tags: ["bestseller", "special"] },
  { id: "chicken-curry", name: "Chicken Curry & Naan", description: "A rich, slow-cooked curry served with warm naan.", section: "mains", image: m("chicken-curry"), tags: ["special", "spicy"] },
  { id: "pizza", name: "Wood-Fired Pizza", description: "Stone-baked crust with creamy cheese, spinach and fresh toppings.", section: "mains", image: m("pizza"), tags: ["vegetarian"] },
  { id: "steak", name: "Grilled Steak", description: "Chargrilled steak, sliced and served with seasonal sides.", section: "mains", image: IMAGES.dessert, tags: [] },
  { id: "risotto", name: "Truffle Risotto", description: "Creamy risotto finished with a shave of truffle.", section: "mains", image: IMAGES.pastaTruffle, tags: ["special", "vegetarian"] },
  { id: "salmon", name: "Pan-Seared Salmon", description: "Crisp-skinned salmon on sautéed greens and noodles.", section: "mains", image: m("salmon"), tags: ["special"] },
  { id: "pasta", name: "Pesto Farfalle", description: "Farfalle tossed in basil pesto with cherry tomatoes.", section: "mains", image: IMAGES.pasta, tags: ["vegetarian"] },

  // ---------- Desserts ----------
  { id: "brownie-icecream", name: "Brownie & Ice Cream", description: "A warm fudge brownie with vanilla ice cream and chocolate sauce.", section: "desserts", image: m("brownie-icecream"), tags: ["bestseller", "vegetarian"] },
  { id: "drip-cake", name: "Chocolate Drip Cake", description: "Layers of rich chocolate cake finished with a glossy ganache drip.", section: "desserts", image: IMAGES.dessertCake, tags: ["special", "vegetarian"] },
  { id: "panna-cotta", name: "Strawberry Panna Cotta", description: "Silky panna cotta topped with fresh strawberries.", section: "desserts", image: IMAGES.pannaCotta, tags: ["vegetarian"] },
  { id: "pancakes", name: "Honey Pancakes", description: "A stack of fluffy pancakes with banana and warm honey.", section: "desserts", image: IMAGES.pancakes, tags: ["vegetarian"] },
  { id: "fudge-brownie", name: "Fudge Brownie", description: "Dense, gooey chocolate brownie, served warm.", section: "desserts", image: m("brownie"), tags: ["vegetarian"] },

  // ---------- Beverages ----------
  { id: "lemon-mint", name: "Lemon Mint Cooler", description: "Fresh lemon, mint and lime over ice. Crisp and refreshing.", section: "beverages", image: m("lemon-mint"), tags: ["bestseller"] },
  { id: "cappuccino", name: "Cappuccino", description: "Espresso with silky steamed milk and latte art.", section: "beverages", image: m("cappuccino"), tags: [] },
  { id: "coffee", name: "Signature Coffee", description: "Our house blend, freshly brewed.", section: "beverages", image: m("coffee"), tags: ["special"] },
  { id: "berry-smoothie", name: "Berry Smoothie", description: "Mixed berries blended with yoghurt.", section: "beverages", image: m("berry-smoothie"), tags: [] },
  { id: "iced-tea", name: "Iced Tea", description: "Chilled black tea with a squeeze of lime.", section: "beverages", image: m("iced-tea"), tags: [] },
  { id: "tea", name: "Premium Tea", description: "A pot of fine loose-leaf tea.", section: "beverages", image: m("tea"), tags: [] },
];

export const TAG_LABEL: Record<DishTag, string> = {
  bestseller: "Bestseller",
  special: "Chef's Special",
  new: "New",
  vegetarian: "Vegetarian",
  spicy: "Spicy",
};

/** Menu items to highlight at the top of the page. */
export const HIGHLIGHTS = MENU_ITEMS.filter(
  (d) => d.tags.includes("bestseller") || d.tags.includes("special")
).sort(
  (a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller"))
);
