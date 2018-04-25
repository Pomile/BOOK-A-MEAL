import { data } from '../db/data';

class MealsGetter {
  static getMeals(req, res) {
    console.log('get meal method');
    const mealList = data.meals;
    res.status(200).json({ data: mealList, sucess: true });
  }
}

export default MealsGetter;
