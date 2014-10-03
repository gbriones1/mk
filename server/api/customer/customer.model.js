'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: String,
  phone: String,
  info: String,
  purchases: [],
  payments: []
});

module.exports = mongoose.model('Customer', CustomerSchema);