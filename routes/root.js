'use strict'

//const trackingUrl = `http://${this.manifest.package}/v${this.manifest.versionCode}/${page}`
function track(matomoBaseUrl, trackingUrl) {
  if (!matomoBaseUrl) { return false }
  const fetch = require('cross-fetch');
  const random = String(Math.floor(Math.random()*1000)).padStart(4, '0');
  let matomoUrl = matomoBaseUrl + `&rand=${random}&action_name=web&url=${trackingUrl}`
  matomoUrl += `&_id=${String(Math.floor(Math.random()*10000000000000000)).padStart(16, '0')}`
  fetch(matomoUrl)
}

module.exports = async function (fastify, opts) {

  const fetch = require('cross-fetch');
  const Polyglot = require('node-polyglot');

  // const jsonSchemaUrl = 'https://pbest.eu/poi-quick-app/schema.json';
  // // Validates the data against a JSON Schema
  // const resSchema = await fetch(jsonSchemaUrl);
  // if (resSchema.status >= 400) {
  //   throw new Error(`Bad response from server fetching the JSON Schema: ${jsonSchemaUrl}`);
  // }
  // const jsonSchema = await resSchema.json();
  // const Ajv = require('ajv');
  // const validate = new Ajv().compile(jsonSchema);

  const options = {
    schema: {
      query: {
        url: { type: 'string' },
        id: { type: 'string' }
      }
    }
  }
  fastify.get('/:locale', options, async (request, reply) => {
    const { url, id } = request.query;
    const { locale } = request.params;

    try {
      const res = await fetch(url);
      if (res.status >= 400) {
        throw new Error(`Bad response from server fetching the app document: ${url}`);
      }
      const json = await res.json();

      // Check the locale in the param (checks if there is a i18n resource with that locale)
      const availableLocalesServer = Object.keys(fastify.i18n.locales);
      const availableLocalesDatabase = Object.keys(json.content);
      // First checks if the user forces the locale (as param)
      if (locale && availableLocalesServer.includes(locale)) {
        // Generates new phrases to be loaded in i18n (replacing the previous locales)
        const polyglot = new Polyglot({phrases: fastify.i18n.locales[locale], locale });
        fastify.i18n.replace(polyglot.phrases);
        fastify.i18n.locale(locale);
      } else {
        // reload the phrases by default
        fastify.i18n.locale(fastify.i18n.defaultLocale);
        const polyglot = new Polyglot({phrases: fastify.i18n.locales[fastify.i18n.defaultLocale], locale: fastify.i18n.defaultLocale });
        fastify.i18n.replace(polyglot.phrases);
      }

      const templateParams = {
        i18n: fastify.i18n, 
        meta: json.meta, 
        content: {},  // set later
        identifier: id
      }; 

      // If there is this locale in the database file, we select it
      if (locale && availableLocalesDatabase.includes(locale)) {
        templateParams.content = json.content[locale];
      } else {
        // By default, it will serve 'en' or the first locale found
        templateParams.content = availableLocalesDatabase.includes('en')? json.content['en'] : json.content[Object.keys(json.content)[0]];
      }
      // Send tracking call 
      track(json.meta.matomo_base_url, url);

      return reply.view('/templates/index.ejs', templateParams);
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
  })
  

}
