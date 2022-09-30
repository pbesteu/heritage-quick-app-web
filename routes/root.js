'use strict'


module.exports = async function (fastify, opts) {

  const fetch = require('cross-fetch')

  fastify.get('/', async (request, reply) => {

    try {

      // The database with the existing implementations
      const IMPLEMENTATIONS_URL = "https://pbesteu.github.io/poi-quick-app/implementations.json"

      const res = await fetch(IMPLEMENTATIONS_URL);
      if (res.status >= 400) {
        throw new Error(`Bad response from server fetching the DB: ${IMPLEMENTATIONS_URL}`);
      }
      const json = await res.json()
      console.log(json)

      return reply.view('/templates/implementations.ejs', { json, i18n: fastify.i18n })
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
  })
  

}
