'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/detail/:identifier', function (request, reply) {
    const { identifier } = request.params;
    return { identifier: identifier }
  })
}
