

module.exports = (sequelize, DataTypes) => {
  const MealMenus = sequelize.define('MealMenus', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    mealId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      constraint: true,
      references: {
        model: 'Meals',
        key: 'id',
        as: 'mealId',
      },
    },

    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      constraint: true,
      references: {
        model: 'Menus',
        key: 'id',
        as: 'menuId',
      },
    },
  }, { timestamps: false });

  MealMenus.associate = (models) => {
    MealMenus.belongsTo(models.Meals, { foreignKey: 'mealId', targetKey: 'id' });
    MealMenus.belongsTo(models.Menus, { foreignKey: 'menuId', targetKey: 'id' });
  };
  return MealMenus;
};
