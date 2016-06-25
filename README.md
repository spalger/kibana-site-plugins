# kibana_site_plugins

> A temporary _site plugins wrapper

---

## install

To install the latest version of the site plugins plugin (I heard you like plugins) into a nightly build of Kibana (required) run:

```sh
./bin/kibana-plugin install https://github.com/spalger/kibana-site-plugins/releases/download/5.0.0-alpha4-SNAPSHOT1/site_plugins-5.0.0-alpha4-SNAPSHOT.zip
```

Then, symlink all of your site plugins into the `installedPlugins/site_plugins/site_plugins` directory and restart the server. You should see your site plugin looking a lot like a Kibana app.

***note:*** until https://github.com/elastic/kibana/pull/7551 is merged you will also need to delete the `optimize/bundles` directory in the kibana source whenever you add a new site plugin!

## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

<dl>
  <dt><code>npm start</code></dt>
  <dd>Start kibana and have it include this plugin</dd>

  <dt><code>npm run build</code></dt>
  <dd>Build a distributable archive</dd>

  <dt><code>npm run test:browser</code></dt>
  <dd>Run the browser tests in a real web browser</dd>

  <dt><code>npm run test:server</code></dt>
  <dd>Run the server tests using mocha</dd>
</dl>

For more information about any of these commands run `npm run ${task} -- --help`.
