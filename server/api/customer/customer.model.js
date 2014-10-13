'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: String,
  phone: String,
  info: String,
  orders: Object
});

module.exports = mongoose.model('Customer', CustomerSchema);