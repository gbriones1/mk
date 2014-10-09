'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: String,
  phone: String,
  info: String,
  purchases: Object,
  payments: Object
});

module.exports = mongoose.model('Customer', CustomerSchema);