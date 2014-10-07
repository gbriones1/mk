'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: String,
  salePrice: Number,
  buyPrice: Number,
});

module.exports = mongoose.model('Product', ProductSchema);