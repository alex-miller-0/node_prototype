var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var morgan = require('morgan');
/*var mongodb = require('mongodb');
var mongoose = require('mongoose');*/
var mysql = require('mysql');
//mongoose.connect('mongodb://localhost/azul');
var endpoints = require('./routes/endpoints.js');
/*
var cluster = require('cluster');
if (cluster.isMaster){
	var cpuCount = require('os').cpus().length;
	
	// Fork a worker to each CPU in the cluster
	for (var i=0; i< cpuCount; i += 1)
		cluster.fork();

	//Fork a new worker when one dies
	cluster.on('exit', function(worker){
		cluster.fork();
	})
}
else setup();
*/
setup();
function setup(){

  
  var app = express();

  function configure_mc(app) {
    app.use(morgan('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());

  }
  // allow CORS for development
  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  };

  app.use(allowCrossDomain);
  configure_mc(app);

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  //ENDPOINTS
  app.get('/loaderio-9b397ec40a7cf30754e804fd533b1271/', endpoints.loadio)
  app.get('/test', endpoints.test)
  app.get('/create_deals', endpoints.create_deals)
  app.get('/create_sql_deals', endpoints.create_sql_deals)
  app.post('/get_deals',endpoints.get_deals)
  app.get('/make_purchase/:price', endpoints.make_purchase)




  module.exports = app;
  http.createServer(app).listen(2050, function(){console.log('http listening on 2050')})
}
