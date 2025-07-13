// FoodDBService.ts
// Service stub for Indian Food Database

export type FoodData = {
  id: string;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  servingSize: string; // e.g., '100g', '1 bowl'
};

class FoodDBService {
  private foods: FoodData[] = [
    { id: '1', name: 'Dal Tadka', calories: 180, protein: 9, carbs: 27, fat: 4, servingSize: '1 bowl' },
    { id: '2', name: 'Paneer Butter Masala', calories: 350, protein: 12, carbs: 18, fat: 25, servingSize: '1 bowl' },
    { id: '3', name: 'Roti', calories: 80, protein: 3, carbs: 15, fat: 1, servingSize: '1 piece' },
    { id: '4', name: 'Chicken Curry', calories: 250, protein: 20, carbs: 6, fat: 15, servingSize: '1 bowl' },
    { id: '5', name: 'Idli', calories: 35, protein: 1, carbs: 7, fat: 0, servingSize: '1 piece' },
  ];

  searchFoods(query: string) {
    return this.foods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  }

  getFoodById(id: string) {
    return this.foods.find(f => f.id === id);
  }
}

export default new FoodDBService(); 