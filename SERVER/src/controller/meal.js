import { data } from '../db/data';

class Meal {
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
      res.status(409).json({ msg: 'This meal is already existing' }).end();
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

  static modifyMeal(req, res) {
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
export default Meal;
