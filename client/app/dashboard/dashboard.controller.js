'use strict';

angular.module('mkApp')
  .controller('DashboardCtrl', function ($scope, $http, $sce, Modal, Notification) {
    $scope.days=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    $scope.months=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.years=[2013, 2014, 2015, 2016];
    $scope.currentDate = new Date();
    $scope.currentOrder = {
      month:$scope.months[$scope.currentDate.getMonth()],
      year:$scope.currentDate.getFullYear(),
    }
    $scope.thisDay = $scope.currentDate.getDate();
    $scope.customers = [];
    $scope.orders = {};
    $scope.customersWithOrders = [];


    $http.get('/api/customers').success(function(customers){
      $scope.customers = customers;
      for (var customerIdx in $scope.customers){
        var customer = $scope.customers[customerIdx];
        var customerOrders = [];
        for (var purchaseIdx in customer.purchases){
          var purchase = customer.purchases[purchaseIdx];
          if (pruchase.month == $scope.currentOrder.month && purchase.year == $scope.currentOrder.year){
            customerOrders.push(purchase);
          }
        }
        if (customerOrders.length){
          $scope.orders[customer._id] = customerOrders;
          $scope.customersWithOrders.push(customer)
        }
      }
    });

    $scope.newPurchase = function(){
      var modal = Modal.openModal({
              modal: {
                dismissable: true,
                title: 'Nueva compra',
                buttons: [{
                  classes: 'btn-primary',
                  text: 'OK',
                  click: function(e) {
                    modal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    modal.dismiss(e);
                  }
                }]
              },
              customers: $scope.customers,
              order: {
                day:$scope.thisDay,
                month:$scope.currentOrder.month,
                year:$scope.currentOrder.year,
              }, 
              years: $scope.years,
              months: $scope.months,
              days: $scope.days
            }, 'modal-primary', 'components/modal/modalNewOrder.html');
      modal.result.then(function(order) {
        console.log("result");
        console.log(order);
        if(!order.customer){
          Notification.addAlert("El nombre de cliente no puede estar vacio.", "danger", 5000);
        }
        else if (Object.keys($scope.orders).indexOf(order.customer._id)+1){
          Notification.addAlert("El nombre de cliente ya ha sido agregado a la lista de peticiones.", "warning", 5000);
        }
        else{
          $scope.orders[order.customer._id] = [];
          $scope.customersWithOrders.push(order.customer);
        }
      });
    }

  });
