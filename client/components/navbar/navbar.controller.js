'use strict';

angular.module('mkApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Ordenes',
      'link': '/'
    },{
      'title': 'Clientes',
      'link': '/customer'
    },{
      'title': 'Productos',
      'link': '/product'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });