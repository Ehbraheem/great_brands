'use strict';
module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    title: DataTypes.STRING,
    availability: DataTypes.BOOLEAN,
    price: DataTypes.STRING
  }, {});
  Property.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Rent)
  };
  return Property;
};