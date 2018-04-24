import { data } from '../db/data';

class MealCreator {
  static addMeal(req, res) {
    const initialMealsCount = data.meals.length;
    const {
      name, description, price, category,
    } = req.body;
    const mealId = initialMealsCount + 1;
    // find if existing account has a user name
    const findByMealName = data.meals.find(meal => meal.name === name);
    // console.log(findByEmail);
    if (findByMealName === undefined) {
      data.meals.push({
        id: mealId, name, description, price, category,
      });
      // console.log(data.meals);
    } else {
      res.status(409).json({ msg: 'This meal already existed' });
    }

    const finalMealsCount = data.meals.length;

    if (finalMealsCount > initialMealsCount) {
      res
        .status(201)
        .json({
          success: true,
          msg: 'meal added successfully',
        });
    }
  }
}

export default MealCreator;
