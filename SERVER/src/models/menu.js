

module.exports = (sequelize, DataTypes) => {
  const Menus = sequelize.define('Menus', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INT,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Users',
        id: 'id',
        as: 'userId',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { timestamps: false });
  return Menus;
};
