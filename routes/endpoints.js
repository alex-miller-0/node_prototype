var express = require('express');
/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;*/
var mysql = require('mysql');
var Purchase = require('../models/purchases.js');
var Deal = require('../models/deals.js');

var pool = mysql.createPool({
	//host     : 'azul.cxktg3o5oohe.us-west-2.rds.amazonaws.com',
    	host : 'test2.cxktg3o5oohe.us-west-2.rds.amazonaws.com',
	user     : 'azul',
    	password : 'AzulRules',
    	database : 'prototype',
	port: '3306'
	});

function execute_query(query, val, callback) {
    pool.getConnection(function(err, connection) {
		if (err) {
			return
		}
        var q = connection.query(('use prototype'));
        q = connection.query(query, val, callback);
        connection.release();
    });
}








exports.test = function(req,res){
	res.send(200, {'yay':'it worked'})
}




// expecting: {sql:0/1}
exports.get_deals = function(req, res){

	if (req.body.sql==0){
		Deal.find({region:req.body.region}, function(err, rows){
			if (err) { res.send(500, {err:err} ) }
			else { res.send(200, {'deals':rows} ) }
		})
	}
	else {
		// var q = 'SELECT price, merchant_id,id FROM price_sets WHERE time_start<NOW() AND time_end>NOW() AND void=0';	
		var q = 'SELECT * FROM price_sets';		
		execute_query(q, null, function(err, results){
			if (err) { res.send(500, {err:err}) }
			else if (results.length==0) {
				// Wait 250 ms and call this endpoint again
				res.send(404, {'msg':'This needs to be called again'})
			}
			else { res.send(200, {'prices':results}) }
		})
	}

}


exports.make_purchase = function(req,res){

	purchase = Purchase({purchase_time:Date.now(), price:req.params.price});
	purchase.save(function(err){
		if (err) { res.send(500, {err:err}) }
		else { res.send(200, {'purchase':'success'})}
	})

}




exports.create_deals = function(req,res){
	zeros = []
	ones = []
	for (i=0; i<100; i++){
		zeros.push({price:(i+1)})
		ones.push({price:(i+1)})
	}

	Zero = Deal({region:0, deals:zeros})
	Zero.save(function(err){
		if (err) { res.send(500, {err:err}) }
	});

	One = Deal({region:1, deals:ones})
	One.save(function(err){
		if (err) { res.send(500, {err:err}) }
	});


	res.send(200, {msg:'Successfully created deals'})

}

exports.create_sql_deals = function(req, res){
	success=1;
	for (i=0; i<100; i++){
		q = 'INSERT INTO deals (merchant_id, min_price, max_price) VALUES ('+String(i+1)+',' + (Math.random()*(700 - 500)+500) + ',' + (Math.random()*(1500-800)+800) + ')';
		execute_query(q,null,function(err,results){
			if (err) { 
				success=0;
				res.send({code:500, err:err}) 
			}
		})
	};
	if (success==1){ res.send({code:200, msg:'success'})}
}
exports.loadio = function(req, res){
	res.send('loaderio-9b397ec40a7cf30754e804fd533b1271')
}
