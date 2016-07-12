/**
 * Created by antoine on 08/07/16.
 */
/**
 * Created by antoine on 07/07/16.
 */

var express = require('express');
var path = require('path');
var favicon = require('express-favicon');

var swig = require('swig');
swig.setDefaults({ varControls: ['{[', ']}'] });
swig.setDefaults({ cache: false });
swig.setDefaults({ autoescape: false });

var angularDomServer = require('./../../../server/lib/AngularServerRenderer');
var config = require('./../config');

var appServer = express();
appServer.use(favicon(__dirname + '/favicon.ico'));

var angularServer = new angularDomServer(config);

console.log('angularServer = ', angularServer);

//view renderer
appServer.engine('html', swig.renderFile);
appServer.set('view engine', 'html');

//template views base folder
appServer.set('views', __dirname + '/views');

//static definition
console.log(path.resolve(__dirname + '/../../../src/views'));
appServer.use('/public', express.static( path.resolve(__dirname + '/../../../tests/bower')));
appServer.use('/views', express.static( path.resolve(__dirname + '/../../../client/views')));
appServer.use('/dist', express.static( path.resolve(__dirname + '/../../../dist/client')));

//all urls
appServer.get('/*', function(req, res, next) {
    
    var tpl = swig.compileFile('./views/index-classic.html', {
        cache: false
    });
    var prehtml = tpl({});

    var html = angularServer.render(prehtml, req.url);

    html.then(function(result) {
        res.send(result);
    }).fail(function(err) {
        res.send(err);
    });

});

module.exports = appServer;