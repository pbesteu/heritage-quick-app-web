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

  /**
   * Finds the closest match of language code preferred by the user agent for
   * the User Interface (i18n in the server).
   * First try to force using the ´lang´ param. If there is no close match, 
   * it tries with the HTTP header. 
   * 
   * @param { object } args. Containing the 
   *  acceptLangHeader (accept-language HTTP header received), 
   *  locale (the locale included in the url, so the priority)
   *  availableLocalesServer (array of lang codes available for the UI), 
   */
  function getClosestLocaleForUI(args) {

    const { acceptLangHeader, locale, availableLocalesServer } = args;

    const langParser = require('accept-language-parser');

    let localeSelected = null;  // Initially null

    // The UI of the App
    // First checks if the user forces the locale (as param)
    if (locale) {
      localeSelected = langParser.pick(availableLocalesServer, `${locale};q=0.9`);
    }
    // not found or not locale passed, so it tries using the accept-language header
    if (!localeSelected) {
      localeSelected = langParser.pick(availableLocalesServer, acceptLangHeader);
    }
    // not found, it uses the locale by default (otherwise 'en')
    if (!localeSelected) {
      localeSelected = fastify.i18n.defaultLocale? fastify.i18n.defaultLocale: 'en';
    }
    // Generates new phrases to be loaded in i18n (replacing the previous locales)
    const polyglot = new Polyglot({phrases: fastify.i18n.locales[localeSelected], locale: localeSelected });
    fastify.i18n.replace(polyglot.phrases);
    fastify.i18n.locale(localeSelected);

    return localeSelected;
  }

  /**
   * Finds the closest match of language code preferred by the user agent
   * for the database (content in JSON).
   * First try to force using the ´lang´ param. If there is no close match, 
   * it tries with the HTTP header. 
   * 
   * @param { object } args. Containing the 
   *  acceptLangHeader (accept-language HTTP header received), 
   *  locale (the locale included in the url, so the priority)
   *  availableLocalesDatabase (array of lang codes available for the DB)
   */
   const selectClosestLocaleForDatabase = (args) => {

    const { acceptLangHeader, locale, availableLocalesDatabase } = args;
    const langParser = require('accept-language-parser');
    let localeSelected = null;  // Initially null

    // The UI of the App
    // First checks if the user forces the locale (as param)
    if (locale) {
      localeSelected = langParser.pick(availableLocalesDatabase, `${locale};q=0.9`);
    }
    // not found or not locale passed, so it tries using the accept-language header
    if (!localeSelected) {
      localeSelected = langParser.pick(availableLocalesDatabase, acceptLangHeader);
    }
    // not found, it uses the locale by default ('en'). Otherwise, or the first key in the content
    if (!localeSelected) {
      localeSelected = availableLocalesDatabase.includes('en')? 'en' : availableLocalesDatabase[0];
    }
    return localeSelected;
  }

  const optionsTown = {
    schema: {
      query: {
        url: { type: 'string' },
        id: { type: 'string' }
      },
      params: {
        locale: { type: 'string' }
      }
    },
    ignoreTrailingSlash: true
  }

  const getViewFromTownUrl = async (url, locale, id, request, reply) => {
    try {
      const res = await fetch(url);
      if (res.status >= 400) {
        throw new Error(`Bad response from server fetching the app document: ${url}`);
      }
      const json = await res.json();
      
      // Check the locale in the param (checks if there is a i18n resource with that locale)
      const availableLocalesServer = Object.keys(fastify.i18n.locales);
      const availableLocalesDatabase = Object.keys(json.content);
  
      const preferredLocaleUI = getClosestLocaleForUI({ 
        locale, 
        acceptLangHeader: request.headers['accept-language'], 
        availableLocalesServer
      });
  
      const preferredLocaleDB = selectClosestLocaleForDatabase({ 
        locale, 
        acceptLangHeader: request.headers['accept-language'], 
        availableLocalesDatabase
      });
  
      // Available languages for the user: the intersection of languages in DB and UI
      const availableLanguages =  availableLocalesDatabase.filter((n) => {
        return availableLocalesServer.indexOf(n) >= 0;
      });
  
      // Send tracking call 
      track(json.meta.matomo_base_url, url);
  
      return reply.view('/templates/index.ejs', 
        {
          i18n: fastify.i18n, 
          meta: json.meta,
          url, 
          availableLanguages,
          content: json.content[preferredLocaleDB],
          locale: preferredLocaleUI,
          identifier: id
        }
      );
    } catch (e) {
      throw new Error(e);
    }
  };

  fastify.get('/town/:locale?/', optionsTown, async (request, reply) => {
    const { url, id } = request.query;
    const { locale } = request.params;

    try {
      return await getViewFromTownUrl(url, locale, id, request, reply);
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
  })

  const optionsShortcut = {
    schema: {
      query: {
        id: { type: 'string' }
      },
      params: {
        townId: { type: 'string' },
        locale: { type: 'string' }
      }
    },
    ignoreTrailingSlash: true
  }

  /**
   * Shortcut based on the existing implementations
   */
   fastify.get('/_/:townId/:locale?/', optionsShortcut, async (request, reply) => {
    const { townId, locale } = request.params;
    const { id } = request.query;

    try {
      const implementations = require ('../data/implementations');
      
      // The document has the following structure:
      // "towns" : [
      //   { 
      //     "name": "LVN Street Heritage",
      //     "id": "leuven",
      //     "location": "Leuven (🇧🇪)",
      //     "source_url": "https://pbesteu.github.io/cultural-heritage-quick-app/be/leuven/data.json",
      //     "country": "Belgium",
      //     "lang": [ "en" ]
      //   },

      const implementation = implementations.towns.find(town => town.id === townId);
      if (!implementation) {
        throw new Error('No implementation found');
      }
      return await getViewFromTownUrl(implementation.source_url, locale, id, request, reply);
    } catch (err) {
      return reply.view('/templates/error.ejs', { 
        i18n: fastify.i18n, 
        message: err.toString()
      });
    }
   })

}
