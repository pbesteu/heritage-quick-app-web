'use strict'

module.exports = async function (fastify, opts) {

  const fetch = require('cross-fetch');

  fastify.get('/town/:url/:identifier', async function (request, reply) {
    const { url } = request.params;
    let { identifier } = request.params;
    // fetches the resource from the URL

    try {
      const res = await fetch(url);
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      const json = await res.json();
      const firstKeyInContent = Object.keys(json.content)[0];

      return reply.view("/templates/index.ejs", { 
        meta: json.meta, 
        content: json.content[firstKeyInContent], 
        identifier });
    } catch (err) {
      return reply.view("/templates/error.ejs", { message: err.toString() });
    }
  })
}
