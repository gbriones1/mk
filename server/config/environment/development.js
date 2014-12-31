'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/mk-dev',
 //    uri: 'mongodb://admin:admin@ds029831.mongolab.com:29831/mk',
 //    options: {
	//   server: { socketOptions: { keepAlive: 1 } },
	//   replset: { socketOptions: { keepAlive: 1 } }
	// }
  },

  seedDB: true
};
