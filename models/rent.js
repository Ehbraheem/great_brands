'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rent = sequelize.define('Rent', {
    due: DataTypes.DATE
  }, {});
  Rent.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.User)
    this.belongsTo(models.Property)
  };
  return Rent;
};