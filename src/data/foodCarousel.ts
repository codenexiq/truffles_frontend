import { IMAGES } from "./images";

// ============================================
// Homepage food carousel.
// Photos are stock placeholders; swap the `image` values for Truffles' own
// photography (public/images/) and edit the captions to real dish names.
// ============================================

export interface FoodSlide {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const FOOD_SLIDES: FoodSlide[] = [
  { id: "pasta", title: "Handmade Pasta", category: "Mains", image: IMAGES.pasta },
  { id: "risotto", title: "Truffle Risotto", category: "Mains", image: IMAGES.pastaTruffle },
  { id: "steak", title: "Grilled Steak", category: "From the Grill", image: IMAGES.dessert },
  { id: "ribs", title: "Smoked BBQ Ribs", category: "From the Grill", image: IMAGES.steak },
  { id: "pizza", title: "Wood-Fired Pizza", category: "Mains", image: IMAGES.pizza },
  { id: "seafood", title: "Seafood Specials", category: "Mains", image: IMAGES.platedDark },
  { id: "bowl", title: "Chef's Bowl", category: "Bowls", image: IMAGES.wineGlasses },
  { id: "platters", title: "Sharing Platters", category: "Starters", image: IMAGES.rusticSpread },
  { id: "cake", title: "Chocolate Drip Cake", category: "Desserts", image: IMAGES.dessertCake },
  { id: "panna", title: "Strawberry Panna Cotta", category: "Hi-Tea", image: IMAGES.pannaCotta },
  { id: "pancakes", title: "Honey Pancakes", category: "Desserts", image: IMAGES.pancakes },
  { id: "cooler", title: "Fresh Mint Cooler", category: "Beverages", image: IMAGES.mintCooler },
];
