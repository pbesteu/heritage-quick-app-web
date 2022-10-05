'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Static resources
  const fastifyStatic = require('@fastify/static')
  // /public
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  })
  // /node_modules
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'node_modules'),
    prefix: '/lib/',
    decorateReply: false
  })

  fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
  });

  // To work with the SW in the "/public" scope
  fastify.addHook('preHandler', (req, reply, done) => {
    reply.header('Service-Worker-Allowed', '/')
    //reply.header('Cache-Control', 'max-age=300, must-revalidate')
    done()
  })

  fastify.register(require('fastify-polyglot'), {
    defaultLocale: 'en',
    localesPath: path.join(__dirname, './i18n')
  }) 

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
