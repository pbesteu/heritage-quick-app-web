'use strict'


module.exports = async function (fastify, opts) {

  fastify.get('/', async (request, reply) => {
    var fs = require('fs')
    const path = require('path')
      try {
      const implementations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data', 'implementations.json'), 'utf8'));
      return reply.view('/templates/implementations.ejs', { json: implementations, i18n: fastify.i18n })
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
  })

  fastify.setNotFoundHandler({
    preValidation: (req, reply, done) => {
      done()
    },
    preHandler: (req, reply, done) => {
      done()
    }
  }, function (request, reply) {
    return reply.view('/templates/error.ejs', { 
      i18n: fastify.i18n, 
      message: fastify.i18n.t('error.not_found')
    });
  })

}
