export default function (sequelize, DataTypes) {
  const Meals = sequelize.define('Meals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      constraint: true,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, { timestamps: false });

  Meals.associate = (models) => {
    Meals.hasMany(models.MealMenus, { foreignKey: 'mealId' });
    Meals.hasMany(models.Orders, { foreignKey: 'mealId' });
    Meals.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
  };
  return Meals;
}
