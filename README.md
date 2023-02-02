# Heritage in… for the Web

This repository contains a web application that is part of the [Heritage In… Quick App project](https://ow2-quick-app-initiative.github.io/poi-quick-app/).

> The Heritage In… Quick App project provides a methodology and a set of tools for towns to promote their most precious assets, enabling citizens and institutions to launch new projects focused on local art, culture, history, nature, or whatever is engaging in a place.

Content on this page:

<!-- vscode-markdown-toc -->
- 1. [The app](#Theapp)
- 2. [Existing implementations](#Existingimplementations)
  - 2.1. [Pretty identifiers](#Prettyidentifiers)
- 3. [Run it locally](#Runitlocally)
- 4. [App Parameters](#AppParameters)
  - 4.1. [Querystring parameters](#Querystringparameters)
  - 4.2. [URL path parameters:](#URLpathparameters:)
- 5. [Progressive Web Applications](#ProgressiveWebApplications)
- 6. [Dependencies](#Dependencies)
- 7. [Examples](#Examples)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Theapp'></a>The app

This project is a simple web application based on [Fastify](https://www.fastify.io) that uses the outcomes generated through the [Heritage In… Quick App methodology](https://ow2-quick-app-initiative.github.io/poi-quick-app/#Themethodology). This app enables the visualization of the databases that follow the templates provided.

The structure of the app is simple. It uses [Embedded JavaScript (EJS)](https://ejs.co/) templating for the view and Fatify routes to serve the content. There are two main routes:

1. List of all the implementations `/` (root).
2. Specific implementation `/_/:locale?/?url={url_to_the_database}&id={poi_to_highlight}`. 


##  2. <a name='Existingimplementations'></a>Existing implementations 

The list of the implementations (available at `/`) is based on the information within the `/data/implementations.json` file. This document is based originally on a public document ([implementations.json](https://github.com/ow2-quick-app-initiative/poi-quick-app/blob/main/docs/implementations.json)) hosted in the main project´s repository (and publicly available at `https://ow2-quick-app-initiative.github.io/poi-quick-app/implementations.json`) that is updated when a Docker container is built using the default [Dockerfile](./Dockerfile)

The instruction in the Dockerfile is the following.

```
ADD https://ow2-quick-app-initiative.github.io/poi-quick-app/implementations.json /usr/src/app/data/
```

If you have new implementations, please modify the [implementations.json document](https://github.com/ow2-quick-app-initiative/poi-quick-app/blob/main/docs/implementations.json) and send a pull request to the main repository. 

The `implementations.json` document looks like this: 

````json
{
  "version": 5,
  "updated": "2022-10-11",
  "towns" : [
    { 
      "name": "LVN Street Heritage",
      "id": "leuven",
      "location": "Leuven (🇧🇪)",
      "source_url": "https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json",
      "country": "Belgium",
      "lang": [ "en" ]
    }

  ]
}
```` 

Each object in the `towns` list describes an app instance, identified by the `id` member and with the public configuration file (`source_url`). The example above shows the instance of _Leuven Cultural Heritage_, identified by `leuven` and with the configuration file at https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json.

###  2.1. <a name='Prettyidentifiers'></a>Pretty identifiers

The `id` in the `towns` list in this document configures the URI of the application. This option is helpful to avoid passing the full configuration URL as a query string parameter.

This way, the server accepts requests using the route `/:id`. For instance, in the previous example, you can access the Leuven example using `/leuven/`.


##  3. <a name='Runitlocally'></a>Run it locally

Clone the project if you want to deploy it locally.  

In the project directory, install the dependencies:

```bash
npm install
```

You can run it directly by launching the server in development mode:

```bash
npm run dev
```

By default, the app will be served locally at port `3000`.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

If you want to run it for production mode:

```bash
npm run start
```

##  4. <a name='AppParameters'></a>App Parameters 

The app requires the following parameters:

###  4.1. <a name='Querystringparameters'></a>Querystring parameters

- `url`: (mandatory) string with the external URL with the database generated through the methodology (i.e., public `data.json` document). This document will be used to configure and populate the content of the app. For instance: `?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json`.
- `id`: (optional) string with the identifier of a point of interest to highlight. If the ID is invalid or not corresponds to any item in the database, it will ignored. For instance: `&id=1677`.

###  4.2. <a name='URLpathparameters:'></a>URL path parameters:

- `/:lang`: (optional) string to force the application´s locale. `lang` must be a ISO 639-1 two-letter code (e.g., `de` for German, `es` for Spanish). By default, the locale will be set to English (i.e., `en`).


##  5. <a name='ProgressiveWebApplications'></a>Progressive Web Applications

The app generates a Progressive Web Application (PWA) per instance. It will enable you to serve concrete instances as a standalone app (i.e., one PWA per use case).

The app registers a Service Worker and configures a manifest based on the configuration file through the EJS templates. This is the code you can find in the `<head>` section of the `index.ejs` file:

````html
  <link rel="manifest" href="/pwa/manifest.json?town_id=Paris&name=Paris%20Monumental&theme_color=%23fefefe">
````

The specific `/pwa` route will generate the following JSON:

````json
{
    "background_color": "#ffffff",
    "dir": "ltr",
    "display": "standalone",
    "name": "Paris Monumental",
    "orientation": "portrait",
    "scope": "/Paris/",
    "short_name": "Paris Monumental",
    "start_url": "/Paris/",
    "theme_color": "#fefefe",
    "icons": [
      {
        "src": "/public/favicon.ico",
        "type": "image/png",
        "sizes": "32x32"
      },
      {
        "src": "/public/images/logo.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ]
}
````

The PWA will be under the path `/Paris`.

##  6. <a name='Dependencies'></a>Dependencies

- [Geolib](https://www.npmjs.com/package/geolib) for basic geospatial operations like distance calculations. 
- [Leaflet](https://leafletjs.com/) for maps management. 
- [Materialize CSS](https://materializecss.com/) for visual stylesheets and Web Components.

##  7. <a name='Examples'></a>Examples

Eckernförde (Germany) Street Heritage in English:

[`http://localhost:3000/town/?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json`](https://localhost:3000/town?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json)

Leuven (Belgium) Cultural Heritage in English:

[`http://localhost:3000/town/?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json`](https://localhost:3000/town?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json)

Eckernförde (Germany) Street Heritage in German:

[`http://localhost:3000/town/de?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json`](https://localhost:3000/town/de?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json)

Select a statue (Rembert Dodoens) in Leuven Culture Heritage database:

[`http://localhost:3000/town/?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json&id=dodoens`](http://localhost:3000/town/?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/be/leuven/heritage/data.json&id=dodoens)


Select a building  (Rembert Dodoens) in the Eckernförde (Germany) Street Heritage project in German:

[`http://localhost:3000/town/de?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json&id=7096`](http://localhost:3000/town/de?url=https://ow2-quick-app-initiative.github.io/poi-quick-app-implementations/de/eckernforde/data.json&id=7096)

