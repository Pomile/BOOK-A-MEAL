

module.exports = (sequelize, DataTypes) => {
  const MealMenus = sequelize.define('MealMenus', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    mealId: {
      type: DataTypes.INT,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Meals',
        key: 'id',
        as: 'mealId',
      },
    },

    menuId: {
      type: DataTypes.INT,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Menus',
        key: 'id',
        as: 'menuId',
      },
    },
  }, { timestamps: false });
  return MealMenus;
};
