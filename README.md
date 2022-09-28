# Heritage Quick App Project for the Web

This repository contains a web application that is part of the [Heritage Quick App project](https://pbesteu.github.io/poi-quick-app/).

> The Local Heritage Quick App project provides a methodology and a set of tools for towns to promote their most precious assets, enabling citizens and institutions to launch new projects focused on local art, culture, history, nature, or whatever is engaging in a place.

This project is a simple web application, based on [Fastify](https://www.fastify.io), that uses the outcomes generated through the [Heritage Quick App methodology](https://pbesteu.github.io/poi-quick-app/#Themethodology). This app enables the visualization of the databases that follow the templates provided.

## Run it locally

If you want to deploy it locally, you only need to clone the project.  

In the project directory, install the dependencies:

```bash
npm install
```

You can run it directly starting the server in development mode:

```bash
npm run dev
```

By default, the app will be served locally at the port `3000`.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

If you want to run it for production mode:

```bash
npm run start
```

## App Parameters 

The app requires the following parameters:

### Querystring parameters

- `url`: (mandatory) string with the external URL with the database generated through the methodology (i.e., public `data.json` document). This document will be used to configure and populate the content of the app. For instance: `?url=https://pbesteu.github.io/cultural-heritage-quick-app/de/eckernforde/data.json`.
- `id`: (optional) string with the identifier of a point of interest to highlight. If the ID is not valid or not corresponds to any item in the database, it will ignored. For instance: `&id=1677`.

### URL path parameters:

- `/:lang`: (optional) string to force the locale of the application. `lang` must be a ISO 639-1 two-letter code (e.g., `de` for German, `es` for Spanish). By default, the locale will be set to English (i.e., `en`).

## Examples

Eckernförde (Germany) Street Heritage in English:

[`http://localhost:3000/?url=https://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json`](https://localhost:3000/?url=http://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json)

Leuven (Belgium) Cultural Heritage in English:

[`http://localhost:3000/?url=https://pbest.eu/cultural-heritage-quick-app/be/leuven/data.json`](https://localhost:3000?url=http://pbest.eu/cultural-heritage-quick-app/be/leuven/data.json)

Eckernförde (Germany) Street Heritage in German:

[`http://localhost:3000/de?url=https://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json`](https://localhost:3000/de?url=http://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json)

Select a statue (Rembert Dodoens) in Leuven Culture Heritage database:

[`http://localhost:3000/?url=https://pbest.eu/cultural-heritage-quick-app/be/leuven/data.json&id=dodoens`](http://localhost:3000/?url=http://pbest.eu/cultural-heritage-quick-app/be/leuven/data.json&id=dodoens)


Select a building  (Rembert Dodoens) in the Eckernförde (Germany) Street Heritage project in German:

[`http://localhost:3000/de?url=https://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json&id=7096`](http://localhost:3000/de?url=https://pbest.eu/cultural-heritage-quick-app/de/eckernforde/data.json&id=7096)

