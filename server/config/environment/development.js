'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    // uri: 'mongodb://localhost/mk-dev',
    uri: 'mongodb://ds029831.mongolab.com:29831/mk',
    options: {
      user: 'admin',
      pass: 'admin'
    }
  },

  seedDB: true
};
