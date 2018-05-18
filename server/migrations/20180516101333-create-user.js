'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.bulkInsert('Users', [{
        email: 'admin@email.com',
        password: bcrypt.hashSync('admin', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        email: 'qwerty@email.com',
        password: bcrypt.hashSync('qwerty', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    });
  },
  down: (queryInterface/*, Sequelize*/) => {
    return queryInterface.dropTable('Users');
  }
};