'use strict';

angular.module('mkApp')
  .controller('ProductCtrl', function ($scope, $http, Notification) {
    $scope.products = [];
    $scope.edit = null;

    var allSelected = false;
    var successGet = function(products){
      $scope.products = products.sort(function(a, b) {
        if (a.name < b.name)
           return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
    }
    var validateParameters = function(product){
      var status = true;
      if (!product.name){
        status = false;
        Notification.addAlert("El nombre de producto no puede estar vacio.", "danger", 5000);
        product.name = "Indefinido";
        $('input#'+product._id).closest('tr').addClass('danger');
      }
      return status;
    }

    $http.get('/api/products').success(successGet);

    $scope.addProduct = function() {
      if($scope.newProduct === '') {
        return;
      }
      $http.post('/api/products', $scope.newProduct).success(function(){
        $http.get('/api/products').success(successGet);
      });
      $scope.newProduct = '';
    };

    $scope.selectAllProducts = function(){
      if (allSelected){
        $('.table input.header-checkbox').each(function(){
          $(this).prop("checked", false);
        });
        allSelected = false;
      }
      else{
        $('.table input.header-checkbox').each(function(){
          $(this).prop("checked", true);
        });
        allSelected = true;
      }
    }

    $scope.deleteSelectedProducts = function() {
      $('.table input.header-checkbox').each(function(){
        if ($(this).prop("checked")){
          $http.delete('/api/products/' + $(this).val()).success(function(){
            $http.get('/api/products').success(successGet);
          });
        }
      });
    }

    $scope.editProduct = function(product){
      $scope.edit = product._id;
    }

    $scope.updateProduct = function(product){
      $scope.edit = product.null;
      if (validateParameters(product)){
        $http.put('/api/products/' + product._id, product).success(function(){
          $http.get('/api/products').success(successGet);
        });
      }
    }

  });
