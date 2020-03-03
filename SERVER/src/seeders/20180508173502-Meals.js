

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Meals', [
    {
      name: 'Jollof Rice with shredded beef',
      userId: 1,
      quantity: 1,
      price: 3000,
      date: '4/26/2018',
      category: 'Intercontinental',
    },

    {
      name: 'AMala with Goat Meat',
      userId: 1,
      quantity: 1,
      price: 3000,
      date: '4/26/2018',
      category: 'Africa',
    },

    {
      name: 'Pounded Yam with Egusi soup',
      userId: 1,
      quantity: 1,
      price: 5000,
      date: '4/27/2018',
      category: 'Africa',
    },

    {
      name: 'Beans and plaintain',
      userId: 1,
      quantity: 1,
      price: 3000,
      date: '4/26/2018',
      category: 'Africa',
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Meals', [
    {
      name: 'Jollof Rice with shredded beef',
      userId: 1,
      quantity: 20,
      price: 3000,
      date: '4/26/2018',
      category: 'Intercontinental',
    },

    {
      name: 'AMala with Goat Meat',
      userId: 1,
      quantity: 20,
      price: 3000,
      date: '4/26/2018',
      category: 'Africa',
    },

    {
      name: 'Pounded Yam with Egusi soup',
      userId: 1,
      quantity: 20,
      price: 5000,
      date: '4/27/2018',
      category: 'Africa',
    },

    {
      name: 'Beans and plaintain',
      userId: 1,
      quantity: 30,
      price: 3000,
      date: '4/26/2018',
      category: 'Africa',
    },
  ], {}),

};
