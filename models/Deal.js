
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Deal = sequelize.define('Deal', {
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valid_start: {
      type: DataTypes.TIME
    },
    valid_end: {
      type: DataTypes.TIME
    },
    valid_days: {
      type: DataTypes.STRING(64)
    },
    description: {
      type: DataTypes.STRING(256)
    },
    is_percentage: {
      type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models){
        Deal.hasMany(models.PriceSet)
      }
    }
  }



  )

  


  return Deal;
};