const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../config/webpack.dev.js');
const WebpackHotMiddleware = require('webpack-hot-middleware');

const app = new (require('express'))();
const port = 3000;

const compiler = Webpack(config);
app.use(WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  quiet: true
}));

app.use(WebpackHotMiddleware(compiler));

app.listen(port);