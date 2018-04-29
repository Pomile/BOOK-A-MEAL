import { data } from '../db/data';

class MealCreator {
  static addMeal(req, res) {
    const initialMealsCount = data.meals.length;
    const {
      name, description, price, category,
    } = req.body;
    const mealId = initialMealsCount + 1;
    const findByMealName = data.meals.find(meal => meal.name === name);
    if (findByMealName === undefined) {
      data.meals.push({
        id: mealId, name, description, price, category,
      });
    } else {
      res.status(409).json({ msg: 'This meal already exist' });
    }

    const finalMealsCount = data.meals.length;

    if (finalMealsCount > initialMealsCount) {
      res
        .status(201)
        .json({
          success: true,
          msg: 'meal added successfully',
        }).end();
    }
  }
}

export default MealCreator;
