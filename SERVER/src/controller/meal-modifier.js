import { data } from '../db/data';

class MealModifier {
  static modifyAMeal(req, res) {
    const {
      name, description, price, category,
    } = req.body;

    const id = req.params.mealId;

    const mealIndex = data.meals.findIndex(meal => meal.id === +id);
    console.log(mealIndex);
    if (mealIndex !== -1) {
      data.meals[mealIndex].name = name;
      data.meals[mealIndex].description = description;
      data.meals[mealIndex].price = price;
      data.meals[mealIndex].category = category;
      res.status(200).json({ msg: 'meal modified successfully' });
    } else {
      res.status(404).json({ msg: 'meal does not exist' });
    }
  }
}


export default MealModifier;
