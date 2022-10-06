'use strict'


module.exports = async function (fastify, opts) {

  const implementations = require ('../data/implementations')

  fastify.get('/', async (request, reply) => {

    try {
      return reply.view('/templates/implementations.ejs', { json: implementations, i18n: fastify.i18n })
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
  })
  

}
