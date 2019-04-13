
(async () => {

  'use strict'


  const { server } = require('hapi')
  const db = require('./config/db')()

  

	const app = server({
		port: 3000,
		host: 'localhost'
	})

  await app.start()
  console.log("Server running on %ss", app.info.uri)
})()

process.on('unHandledRejection', err => {
  console.log(err)
  process.exit(1)
})
