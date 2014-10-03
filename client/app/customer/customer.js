'use strict';

angular.module('mkApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/customer', {
        templateUrl: 'app/customer/customer.html',
        controller: 'CustomerCtrl'
      });
  });