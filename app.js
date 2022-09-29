'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // public resources under public/ dir  
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  })

  fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs"),
    },
  });

  // To work with the SW in /public scope
  fastify.addHook('preHandler', (req, reply, done) => {
    reply.header('Service-Worker-Allowed', '/')
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
