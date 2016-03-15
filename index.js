import { readFileSync, readdirSync } from 'fs';
import { get, values } from 'lodash';
import express from 'express';
import httpProxy from 'http-proxy';
import http from 'http';
import https from 'https';
import { join } from 'path';
import { format as formatUrl } from 'url';

const uiApps = [];
const sitePlugins = {};
const sitePluginsDir = join(__dirname, 'site_plugins');

readdirSync(sitePluginsDir)
.forEach(function (name, i) {
  if (name.startsWith('.')) return;

  const dir = join(sitePluginsDir, name);
  sitePlugins[name] = { name, dir };
  uiApps.push({
    id: name,
    title: name,
    description: '',
    //icon: 'plugins/kibana/settings/sections/about/barcode.svg',
    main: 'plugins/site_plugins/app',
    injectVars(server, options) {
      return {
        sitePluginUrl: sitePlugins[name].url
      };
    }
  });

});

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {
      apps: uiApps
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      const config = server.config();

      const { ca, key, cert } = config.get('elasticsearch.ssl');
      const esSslConfig = !(ca || key || cert) ? undefined : {
        ca: ca ? readFileSync(ca) : undefined,
        key: key ? readFileSync(key) : undefined,
        cert: cert ? readFileSync(cert) : undefined,
      };

      const esProxy = httpProxy.createProxyServer({
        target: config.get('elasticsearch.url'),
        secure: config.get('elasticsearch.ssl.verify'),
        ssl: esSslConfig,
      });

      values(sitePlugins).forEach((plugin, i) => {
        const { name, dir } = plugin;

        const ssl = Boolean(config.get('server.ssl.cert') && config.get('server.ssl.key'));
        const protocol = ssl ? 'https:' : 'http:';
        const hostname = config.get('server.host');
        const port = get(options, ['plugins', name, 'port'], config.get('server.port') + 50 + i);
        const pathname = `/_plugin/${name}`;
        const url = formatUrl({ protocol, hostname, port, pathname });

        const pluginServer = express();
        pluginServer.use(`/_plugin/${name}`, express.static(dir));
        pluginServer.use(`/_plugin`, function (req, res) {
          res.status(404).send('Plugin Not Found').type('text');
        });
        pluginServer.use(function (req, res) {
          esProxy.web(req, res);
        });

        if (ssl) {
          https.createServer({
            key: readFileSync(config.get('server.ssl.key')),
            cert: readFileSync(config.get('server.ssl.cert')),
          }, pluginServer)
          .listen(port, hostname);
        } else {
          http.createServer(pluginServer).listen(port, hostname);
        }

        server.on('close', () => pluginServer.close());

        Object.assign(plugin, { name, dir, ssl, protocol, hostname, port, pathname, url });
      });

    }

  });
};
