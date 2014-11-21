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
    },{
      'title': 'Reportes',
      'link': '/report'
    },{
      'title': 'Pendientes',
      'link': '/pendings'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });