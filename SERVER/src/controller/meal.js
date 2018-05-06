import { Meals } from '../models';
// import { data } from '../db/data';

class Meal {
  static addMeal(req, res) {
    const {
      name, price, quantity,
    } = req.body;
    const userId = req.user.id;

    Meals.create({
      userId,
      name,
      price,
      quantity,

    }).then((meal) => {
      if (meal) {
        res
          .status(201)
          .json({
            success: true,
            msg: 'meal added successfully',
          }).end();
      }
    }).catch((err) => {
      res.status(409)
        .json({ msg: 'This meal is already existing', error: err.message })
        .end();
    });
    /* const mealId = initialMealsCount + 1;
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
    } */
  }

  static modifyMeal(req, res) {
    const {
      name, description, price, category,
    } = req.body;

    const id = req.params.mealId;

    const mealIndex = data.meals.findIndex(meal => meal.id === +id);
    if (mealIndex !== -1) {
      data.meals[mealIndex].name = name;
      data.meals[mealIndex].description = description;
      data.meals[mealIndex].price = price;
      data.meals[mealIndex].category = category;
      res.status(200).json({ msg: 'meal modified successfully' }).end();
    } else {
      res.status(404).json({ msg: 'meal does not exist' }).end();
    }
  }
  static removeMeal(req, res) {
    const id = req.params.mealId;
    const mealIndex = data.meals.findIndex(meal => meal.id === +id);
    data.meals.splice(mealIndex, 1);
    res.status(204).end();
  }
  static getMeals(req, res) {
    const mealList = data.meals;
    res.json({ data: mealList, sucess: true });
  }
}
export default Meal;
