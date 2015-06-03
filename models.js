var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dealsSchema = new Schema({
	region: Boolean,
	price: Number
});
module.exports = mongoose.model('Deals', dealsSchema);


var purchasesSchema = new Schema({
	purchase_time: Date,
	price: Number
});
module.exports = mongoose.model('Purchases', purchasesSchema);

