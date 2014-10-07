'use strict';

angular.module('mkApp')
  .factory('Notification', function ($rootScope, $timeout) {
  	$rootScope.alerts = [];
    function addAlert(message, alertClass, duration) {
        $rootScope.alerts.push({msg: message, type:alertClass});
        if (duration){
	        $timeout(function(){
				$rootScope.alerts.pop();
	        }, duration);
        }
    };
    $rootScope.closeAlert = function(index) {
	    $rootScope.alerts.splice(index, 1);
	};

    return {
      addAlert: addAlert,
    };
  });
