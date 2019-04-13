(() => {
	'use strict'

	const Sequelize = require('sequelize');

  module.exports = () => {
    const { NODE_ENV } = process.env
    
    return NODE_ENV === 'production' ?
      new Sequelize(process.env.DATABASE_URL, {
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      }
    })
      : new Sequelize({
              dialect: 'sqlite',
              storage: `${__dirname}/database.sqlite`
            })
  }
})()