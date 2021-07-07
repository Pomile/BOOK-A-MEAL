module.exports = (sequelize, DataTypes) => {
  const Menus = sequelize.define('Menus', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
  }, { timestamps: false });
  Menus.associate = (models) => {
    Menus.hasMany(models.MealMenus, { foreignKey: 'menuId', targetKey: 'id' });
  };
  return Menus;
};
