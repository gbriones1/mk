'use strict';

angular.module('mkApp')
  .controller('CustomerCtrl', function ($scope, $http, $timeout, Notification) {
    $scope.customers = [];

    var allSelected = false;

    var successGet = function(customers){
      $scope.customers = customers;
      $timeout(function(){
        $('.panel-heading').each(function(){
          $(this).find('a.accordion-toggle').attr("href", "javascript:void(0);");
          var custId = $(this).find('a.accordion-toggle div.customer-info').attr("data-customer-id");
          $(this).prepend('<input type="checkbox" class="header-checkbox" value="'+custId+'">')
        });
      });
    }

    var validateParameters = function(customer){
      var status = true;
      if (!customer.name){
        status = false;
        Notification.addAlert("El nombre de usuario no puede estar vacio.", "danger", 5000);
        customer.name = "Indefinido";
        $('input#name-'+customer._id).closest('.form-group').addClass('has-error');
      }
      return status;
    }

    $http.get('/api/customers').success(successGet);

    $scope.addCustomer = function() {
      if($scope.newCustomer === '') {
        return;
      }
      $http.post('/api/customers', $scope.newCustomer).success(function(){
        $http.get('/api/customers').success(successGet);
      });
      $scope.newCustomer = '';
    };

    $scope.deleteCustomer = function(customer) {
      $http.delete('/api/customers/' + customer._id);
    };

    $scope.selectAllCustomers = function(){
      if (allSelected){
        $('.panel-heading input.header-checkbox').each(function(){
          $(this).prop("checked", false);
        });
        allSelected = false;
      }
      else{
        $('.panel-heading input.header-checkbox').each(function(){
          $(this).prop("checked", true);
        });
        allSelected = true;
      }
    }

    $scope.deleteSelectedCustomers = function() {
      $('.panel-heading input.header-checkbox').each(function(){
        if ($(this).prop("checked")){
          $http.delete('/api/customers/' + $(this).val()).success(function(){
            $http.get('/api/customers').success(successGet);
          });
        }
      });
    }

    $scope.updateCustomer = function(customer){
      if (validateParameters(customer)){
        $http.put('/api/customers/' + customer._id, customer).success(function(){
          $http.get('/api/customers').success(successGet);
        });
      }
    }

  });

