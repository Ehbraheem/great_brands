
(async () => {

  'use strict'


  const { server } = require('hapi')
  const Inert = require('inert');
  const Vision = require('vision');
  const HapiSwagger = require('hapi-swagger');
  const Pack = require('./package');
  const db = require('./models/')
  
  const { User, Property, Rent, Session } = db

	const app = server({
		port: 3000,
		host: 'localhost'
	})

  const swaggerOptions = {
    auth: false,
    tags: {
      'users': 'Manage application users',
      'properties': 'Manages Properties that are available for rent',
      'rent': 'Manages properties that are rented and not rented',
    },
    info: {
      title: 'Assets management application',
      description: 'API for managing assets and rents',
      version: '0.0.1'
    }
  }

  await app.register([
          Inert,
          Vision,
          {
              plugin: HapiSwagger,
              options: swaggerOptions
          }
      ]);

  app.route({
    path: '/',
    method: 'GET',
    handler: async (req, h) => {
      const response = h.response("Go to /docs to get the documentation on how to use this API")
      response.type('application/json')
      response.code(200)

      return response
    }
  })

  app.route({
    path: '/users',
    method: 'GET',
    tags: ['users'],
    handler: async (req, h) => {
      const users = await User.findAll()
      const response = h.response({users})
      response.type('application/json')
      response.code(200)

      return response
    }
  })

  app.route({
    path: '/users',
    method: 'POST',
    tags: ['users'],
    handler: async (req, h) => {
      const user = await User.create(req.payload)
      let response;
      if (user) {
        response = h.response({result: 'User successfully created!'})
        response.code(201)
      } else{
        response = h.response({result: 'User creation failed!'})
        response.code(400)
      }
      response.type('application/json')
      return response
    }
  })

  app.route({
    path: '/properties',
    method: 'GET',
    tags: ['properties'],
    handler: async (req, h) => {
      if (!!(_logedInUser(_currentUser(req)))) {
        const properties = await Property.findAll()
        const response = h.response({properties})
        response.type('application/json')
        response.code(200)

        return response
      }
      const failedResponse = h.response({properties: "You must be logged in to view properties"})
      response.type('application/json')
      response.code(400)

      return response
    }
  })

  app.route({
    path: '/login',
    method: 'POST',
    tags: ['users'],
    handler: async (req, h) => {
      const payload = req.payload
      const email = payload.replace(/\}\{\)\(\\n\s;:\|\^/g, '') //sanitize
      const user = await User.find({where: {email}})
      let response;

      if (user && user.login(payload.password)){
        response = h.response({result: 'You have successfully log in'})
        response.code(200)
        response.header('email', user.email)
      } else {
        response = h.response({result: 'Wrong email or password!'})
        response.code(400)
      }
      response.type('application/json')
      return response
    }
  })
  const _currentUser = async ({ headers: email }) => await User.find({where: {email}})
  const _logedInUser = async ({ id }) => await Session.find({where: {id}})

  await app.start()
  console.log("Server running on %s", app.info.uri)
})()

process.on('unHandledRejection', err => {
  console.log(err)
  process.exit(1)
})