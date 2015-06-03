var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var dealsSchema = new Schema({
	region: Number,
	deals: [{
		price: Number
	}]
	
});
module.exports = mongoose.model('Deals', dealsSchema);