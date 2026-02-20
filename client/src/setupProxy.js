const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const apiProxy = createProxyMiddleware('/api', {
    target: 'http://localhost:5000'
  })

  const assetsProxy = createProxyMiddleware('/uploads', {
    target: 'http://localhost:5000'
  })

  const wsProxy = createProxyMiddleware('/socket', {
    target: 'http://localhost:5000',
    ws: true
  })

  app.use(apiProxy);
  app.use(assetsProxy);
  app.use(wsProxy);
};