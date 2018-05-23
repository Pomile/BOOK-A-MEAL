module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
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
    mealId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      constraint: false,
      references: {
        model: 'Meals',
        id: 'id',
        as: 'mealId',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, { timestamps: false });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id' });
    Orders.belongsTo(models.Meals, { foreignKey: 'mealId', targetKey: 'id' });
  };

  return Orders;
};
