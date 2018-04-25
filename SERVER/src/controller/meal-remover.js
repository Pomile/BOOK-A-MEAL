import { data } from '../db/data';

class MealRemover {
  static deleteAMeal(req, res) {
    const id = req.params.mealId;
    const mealIndex = data.meals.findIndex(meal => meal.id === +id);
    const meal = data.meals[mealIndex];
    if (meal) {
      data.meals.splice(mealIndex, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ msg: 'meal does not exist' });
    }
  }
}


export default MealRemover;
