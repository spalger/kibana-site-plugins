export default function (server) {

  server.route({
    path: '/api/kibana_site_plugins/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

};
