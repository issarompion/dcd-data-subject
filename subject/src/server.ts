// src/server.ts
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
//
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main');

const PORT = process.env.PORT || 8080;

const mode = (process.argv[2] === '--dev') ? 'development' : 'production';

const app = express();
if (mode === 'production') {
    enableProdMode();
    app.disable('x-powered-by');
}

const template = readFileSync(join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
    const opts = {
        document: template,
        url: options.req.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
        ]
    };
    renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src');

// si vous avez des fichiers statiques
// app.get('*.*', express.static(join(__dirname, '..', 'dist', 'server')));

app.get('*', (req, res) => {
    res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});