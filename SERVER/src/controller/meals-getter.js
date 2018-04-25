import { data } from '../db/data';

class MealsGetter {
  static getMeals(req, res) {
    const mealList = data.meals;
    res.status(200).json({ data: mealList, sucess: true });
  }
}

export default MealsGetter;
