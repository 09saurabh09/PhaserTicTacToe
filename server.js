var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var logger = require('morgan');
var config = require('./webpack.config');
var bodyParser = require('body-parser');

var app = new(require('express'))();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(logger('dev'));

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
