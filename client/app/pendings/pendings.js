'use strict';

angular.module('mkApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/pendings', {
        templateUrl: 'app/pendings/pendings.html',
        controller: 'PendingsCtrl'
      });
  });