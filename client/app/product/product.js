'use strict';

angular.module('mkApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/product', {
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl'
      });
  });