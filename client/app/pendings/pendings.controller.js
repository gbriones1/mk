'use strict';

angular.module('mkApp')
  .controller('PendingsCtrl', function ($scope, $http) {
    $scope.customers = [];
    $scope.products = [];
    $scope.pendingPayments = [];
    $scope.pendingDeliveries = [];


    $http.get('/api/customers').success(function(customers){
      $scope.customers = customers.sort(function(a, b) {
        if (a.name < b.name)
           return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      });
      $http.get('/api/products').success(function(products){
        $scope.products = products;
        getPendings();
      });
    });

    function getProductName(productId){
      for (var productIdx in $scope.products){
        if ($scope.products[productIdx]._id == productId){
          return $scope.products[productIdx].name;
        }
      }
      return "No encontrado!"
    }

    function getPendings(){
      for (var customerIdx in $scope.customers){
        var customer = $scope.customers[customerIdx];
        if (customer.orders){
          for (var orderKey in customer.orders){
            var month = orderKey.substring(4);
            var year = orderKey.substring(0,4);
            var orderPrice = 0;
            for (var purchaseIdx in customer.orders[orderKey].purchases){
              var purchase = customer.orders[orderKey].purchases[purchaseIdx];
              orderPrice += purchase.price*purchase.quantity;
              if (!purchase.isDelivered){
                $scope.pendingDeliveries.push({
                  customer: customer.name,
                  product: getProductName(purchase.product),
                  quantity: purchase.quantity,
                  date: month+" "+year
                })
              }
            }
            var orderPayments = 0;
            for (var paymentIdx in customer.orders[orderKey].payments){
              orderPayments += Number(customer.orders[orderKey].payments[paymentIdx].amount);
            }
            var debt = orderPrice - orderPayments;
            if (debt){
              $scope.pendingPayments.push({
                customer: customer.name,
                debt: debt,
                date: month+" "+year
              })
            }
          }
        }
      }
    }

  });
