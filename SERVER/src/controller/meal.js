import { Meals } from '../models';
// import { data } from '../db/data';

class Meal {
  static addMeal(req, res) {
    const {
      name, price, quantity,
    } = req.body;
    // console.log(req.files.image.data);
    const image = req.files.image.data;
    const userId = req.user.id;

    Meals.create({
      userId,
      name,
      price,
      quantity,
      image,

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
  }

  static async addMeals(req, res) {
    const
      { bulkMeals }
    = req.query;
    const { images } = req.files;

    if (bulkMeals.length === 0 || images.length === 0) {
      res.status(200).json({ sucess: false });
    } else {
      const mealBulk = [];
      await bulkMeals.name.map(() => mealBulk.push({

      }));
      await Object.keys(bulkMeals).map(key =>
        bulkMeals[key].forEach((mealValue, valueIndex) => {
          mealBulk[valueIndex][key] = mealValue;
        }));


      await mealBulk.map((meal, index) => {
        const mealCopy = meal;
        mealCopy.image = images[index].data;
        return mealCopy;
      });

      Meals.bulkCreate(mealBulk).then(() => {
        res
          .status(201)
          .json({
            success: true,
            msg: 'meals added successfully',
          }).end();
      });
    }
  }


  static modifyMeal(req, res) {
    const {
      name, quantity, description, price, category,
    } = req.body;

    const id = req.params.mealId;
    Meals.findById(id).then((meal) => {
      meal.update({
        name,
        price,
        quantity,
        category,
        description,
      }).then((updatedMeal) => {
        res.status(200).send({
          success: true,
          data: updatedMeal,
          msg: 'meal modified successfully',
        });
      });
    }).catch((err) => {
      res.status(404)
        .json({ msg: 'meal does not exist', error: err.message })
        .end();
    });
  }
  static removeMeal(req, res) {
    const id = req.params.mealId;
    return Meals.find({
      where: {
        id,
      },
    })
      .then(meal => meal.destroy())
      .then(() => res.status(204).end())
      .catch((err) => {
        res.status(404)
          .json({
            msg: err.message,
          });
      });
  }
  static getMeals(req, res) {
    Meals.findAll({ offset: 0, limit: 10 })
      .then((meals) => {
        res.status(200)
          .json({ data: meals, success: true });
      }).catch((err) => {
        res.status(404).json({ msg: err.message });
      });
  }
}
export default Meal;
