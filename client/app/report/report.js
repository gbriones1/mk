'use strict';

angular.module('mkApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/report', {
        templateUrl: 'app/report/report.html',
        controller: 'ReportCtrl'
      });
  });