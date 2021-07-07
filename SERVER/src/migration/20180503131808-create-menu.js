
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Menus', {
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
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Menus'),
};
