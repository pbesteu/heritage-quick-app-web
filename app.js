'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

module.exports.options = {}

module.exports = async function (fastify, opts) {

  // Module to serve static resources
  const fastifyStatic = require('@fastify/static')
  
  // Public resources served under /public
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  })
  
  // Access to /node_modules through /lib
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'node_modules'),
    prefix: '/lib/',
    decorateReply: false
  })

  // Registering the EJS engine for the view
  fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
  });

  // We need this to work with the SW in the "/public" scope
  fastify.addHook('preHandler', (req, reply, done) => {
    reply.header('Service-Worker-Allowed', '/')
    //reply.header('Cache-Control', 'max-age=300, must-revalidate')
    done()
  })

  // i18n capabilities. 'en' by default
  fastify.register(require('fastify-polyglot'), {
    defaultLocale: 'en',
    localesPath: path.join(__dirname, './i18n')
  }) 

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // Register the routes defined in '/routes'
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
