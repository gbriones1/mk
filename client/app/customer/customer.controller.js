'use strict';

angular.module('mkApp')
  .controller('CustomerCtrl', function ($scope, $http) {
    $scope.customers = [];

    $http.get('/api/customers').success(function(customers) {
      $scope.customers = customers;
    });

    $scope.addCustomer = function() {
      if($scope.newCustomer === '') {
        return;
      }
      $http.post('/api/customers', $scope.newCustomer);
      $scope.newCustomer = '';
    };

    $scope.deleteCustomer = function(customer) {
      $http.delete('/api/customers/' + customer._id);
    };
  });
