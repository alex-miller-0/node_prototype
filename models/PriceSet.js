module.exports = function(sequelize, DataTypes) {
	var PriceSet = sequelize.define('PriceSet', {
		price : {
			type: DataTypes.INTEGER,
			allowNUll: false
		},
		price_set_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		time_start: {
			type: DataTypes.TIME
			//allowNull: false
		},
		time_end: {
			type: DataTypes.TIME
			//allowNull: false
		},
		description: {
			type: DataTypes.STRING
		},
		void_flag: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	},{
		classMethods: {
      		associate: function(models){
        		PriceSet.belongsTo(models.Deal)
      		}
    	}
	}

	);


	return PriceSet;
}
