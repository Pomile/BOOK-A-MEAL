
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MealMenus', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    mealId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Meals',
        key: 'id',
        as: 'mealId',
      },
    },
    menuId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Menus',
        key: 'id',
        as: 'menuId',
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MealMenus'),
};
