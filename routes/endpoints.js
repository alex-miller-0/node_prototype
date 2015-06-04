var express = require('express');
/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;*/
var mysql = require('mysql');
var models = require('../models');


var pool = mysql.createPool({
	    host     : 'localhost',
    	user     : 'root',
    	password : '',
    	database : 'prototype'
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
	res.send(200, {'msg':'success'})
}

exports.create_deal = function(req,res){
	models.Deal.create({
		merchant_id:1,
		min_price:1,
		max_price:2
	})

	res.send(201, {stuff: ''})
}




exports.create_price_set = function(req, res){
	models.Deal.findOne({where: {merchant_id:1}}).then(function(deal){
		var d=deal.dataValues
		deal.createPriceSet({
			price:1,
			price_set_id:10
		})
		var external = undefined;
		console.log(typeof external)
		deal.getPriceSets()
			.then(function(price_sets){
				//for (ps in price_sets){ console.log(price_sets[ps].dataValues)}
				external = price_sets
			})
			.then(function(){console.log(typeof external, ' two' )})

	})



	res.send(201, {create_price_set:'success'})
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
		try {
			var q = ' doprice, merchant_id FROM price_sets WHERE time_start<NOW() AND time_end>NOW() AND void=0';
			q == k
			execute_query(q, null, function(err, results){
				if (err) { res.send(500, {err:err}) }
				else if (results.length===0) {
					// Wait 250 ms and call this endpoint again
					res.send(404, {'msg':'This needs to be called again'})
				}
				else { res.send(200, {'prices':results}) }
			})
		}catch(e){res.send(501, {'err':e})}
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




var deal = function(sequelize, DataTypes){
	var Deal = sequelize.define('deal', {
		merchant_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: 'deal'
		},
		min_price: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: 'min_price'
		},
		max_price: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: 'max_price'
		},
		valid_start: {
			type: Sequelize.TIME,
			field: 'valid_start'
		},
		valid_end: {
			type: Sequelize.TIME,
			field: 'valid_end'
		},
		valid_days: {
			type: Sequelize.STRING(64),
			field: 'valid_days'
		},
		description: {
			type: Sequelize.STRING(256),
			field: 'description'
		},
		is_percentage: {
			type: Sequelize.BOOLEAN,
			field: 'is_percentage'
		}

		}
	);

	return Deal;

};
