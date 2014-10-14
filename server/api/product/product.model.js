'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model('Product', ProductSchema);