'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    userId: DataTypes.UUID
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.User)
  };
  return Session;
};