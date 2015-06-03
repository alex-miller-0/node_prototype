var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var purchasesSchema = new Schema({
	purchase_time: Date,
	price: Number
});
module.exports = mongoose.model('Purchases', purchasesSchema);