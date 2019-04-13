'use strict';
const { hash, compare, genSaltSync } = require("bcrypt")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    freezeTableName: true,
    instanceMethods: {
      genHash(password) {
        return hash(password, genSaltSync(8))
      },

      validPassword(password) {
        return compare(password, this.password)
      },
      login(password) {
        return this.validPassword(password) ?
          !!((
            this.session.findOrCreate({ where: {
              userId: this.id,
              login: true
            }})
          ))
          : false
      }
    }
  });

  User.beforeCreate((user, options) => {
    return user.password = genHash(user.password)
  })

  User.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Rent)
    this.hasOne(models.Session)
  };
  return User;
};