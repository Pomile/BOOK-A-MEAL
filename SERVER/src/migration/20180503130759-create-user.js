
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
