const { createProxyMiddleware } = require('http-proxy-middleware');
// const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
      createProxyMiddleware('/ai_api', {
        target: 'http://suixue.xyz',
        secure: false,  
        changeOrigin: true,
        pathRewrite: {
            "^/ai_api": "/ai_api"
        },
      }),
    );
};