const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Posts,{
      foreignKey:'userId',
      as: 'Posts'
    });
  };
  User.beforeCreate((user) => {
    return bcrypt.hash(user.password, 10) 
      .then(success => {
        user.password = success;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });
  User.prototype.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };
  return User;
};