import { data } from '../db/data';

class MealRemover {
  static deleteAMeal(req, res) {
    const id = req.params.mealId;
    const mealIndex = data.meals.findIndex(meal => meal.id === +id);
    const meal = data.meals[mealIndex];
    data.meals.splice(mealIndex, 1);
    res.status(204).end();
  }
}


export default MealRemover;
