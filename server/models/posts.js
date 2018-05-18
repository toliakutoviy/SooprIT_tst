'use strict';
module.exports = (sequelize, DataTypes) => {
  let Posts = sequelize.define('Posts', {
    text: DataTypes.TEXT
  }, {});
  Posts.associate = function(models) {
    // associations can be defined here
    Posts.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Posts;
};