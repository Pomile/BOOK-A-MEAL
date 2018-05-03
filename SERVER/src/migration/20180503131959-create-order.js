
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Orders', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Users',
        id: 'id',
        as: 'userId',
      },
    },
    mealId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Meals',
        id: 'id',
        as: 'mealId',
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Orders'),
};
