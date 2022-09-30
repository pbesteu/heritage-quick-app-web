'use strict'

module.exports = async function (fastify, opts) {

  const options = {
    schema: {
      query: {
        start_url: { type: 'string' },
        theme_color: { type: 'string' },
        name: { type: 'string' }
      }
    }
  }
  /**
   * Generates a manifest.json based on the parameters in the querystring:
   * start_url (start_url), 
   * theme_color (theme_color)
   * name (name and short_name)
   */

   fastify.get('/manifest/manifest.json', options, async (request, reply) => {
    const { start_url, name, theme_color } = request.query;
    try {
      if (!start_url && !name && !theme_color) {
        throw new Error('No parameters found');
      }  
      const templateParams = {
        theme_color,
        start_url,
        name,
      };
      reply.header('Content-Type', 'application/json; charset=utf-8') 
      return reply.view('/templates/manifest/manifest.ejs', templateParams)
    } catch (err) {
      // If error, sends the static manifest
      return reply.sendFile('manifest.json')
    }
  })
  

}
