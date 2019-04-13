'use strict'
const { server } = require('hapi')

(async () => {

	server({
		port: 3000,
		host: 'localhost'
	})

  await server.start()
  console.log("Server running on %ss", server.info.uri)
})

process.on('unHandledRejection', err => {
  console.log(err)
  process.exit(1)
})
