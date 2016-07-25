var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var logger = require('morgan');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
const brightness = require('brightness');


var app = new (require('express'))();
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

app.post('/data', function(req, res) {
    brightness.set(req.body.Slider).then(() => {
        console.log(`Changed brightness to ${req.body.Slider * 100}%`);
    })
    res.sendStatus(201);
});


app.listen(port, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
    }
});