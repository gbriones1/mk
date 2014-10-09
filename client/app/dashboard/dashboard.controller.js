'use strict';

angular.module('mkApp')
  .controller('DashboardCtrl', function ($scope, $http, $filter, $timeout, Modal, Notification) {
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
    $scope.products = [];
    $scope.purchases = {};
    $scope.payments = {};
    $scope.customersWithOrders = [];
    $scope.edit = {
      customer:null,
      purchase:null,
      payment:null
    };

    var validateOrder = function(order){
      var status=true;
      if(!order.customer){
        Notification.addAlert("El nombre de cliente no puede estar vacio.", "danger", 5000);
      }
      else if (Object.keys($scope.purchases).indexOf(order.customer._id)+1){
        Notification.addAlert("El nombre de cliente ya ha sido agregado a la lista de peticiones.", "warning", 5000);
      }
      else if (!order.products){
        Notification.addAlert("Se debe seleccionar al menos un producto.", "danger", 5000);
      }
      return status
    }

    var successGet = function(customers){
      $scope.customers = customers;
      $scope.reloadVariables();
    }

    $http.get('/api/customers').success(successGet);

    $http.get('/api/products').success(function(products){
      $scope.products = products;
    });

    $scope.reloadVariables = function(){
      $scope.customersWithOrders= [];
      $scope.purchases = {};
      $scope.payments = {};
      for (var customerIdx in $scope.customers){
        var customer = $scope.customers[customerIdx];
        if (customer.purchases){
          for (var purchaseKey in customer.purchases){
            if (purchaseKey == $scope.currentOrder.year+$scope.currentOrder.month && customer.purchases[purchaseKey].length){
              $scope.customersWithOrders.push(customer);
              $scope.purchases[customer._id] = customer.purchases[purchaseKey]
            }
          }
        }
        if (customer.payments){
          for (var paymentKey in customer.payments){
            if (paymentKey == $scope.currentOrder.year+$scope.currentOrder.month){
              $scope.payments[customer._id] = customer.payments[paymentKey]
            }
          }
        }
      }
      $timeout(function(){
        $('.panel-heading').each(function(){
          $(this).find('a.accordion-toggle').attr("href", "javascript:void(0);");
        });
      });
    }

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
              products: $scope.products,
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
        if (validateOrder(order)){
          var purchases = []
          for (var productIdx in order.products){
            purchases.push({
              day:Number(order.day),
              product:order.products[productIdx]._id,
              salePrice:Number(order.products[productIdx].salePrice),
              buyPrice:Number(order.products[productIdx].buyPrice),
              quantity:1,
            });
          }
          if (!order.customer.purchases){
            order.customer.purchases = {};
          }
          if (!order.customer.payments){
            order.customer.payments = {};
          }
          order.customer.purchases[$scope.currentOrder.year+$scope.currentOrder.month] = purchases;
          order.customer.payments[$scope.currentOrder.year+$scope.currentOrder.month] = [];
          $http.put('/api/customers/' + order.customer._id, order.customer).success(function(){
            $scope.reloadVariables();
          });
        }
      });
    }

    $scope.addPurchase = function(customer){
      if (customer.newPurchase){
        customer.purchases[$scope.currentOrder.year+$scope.currentOrder.month].push({
          day:$scope.thisDay,
          product:customer.newPurchase._id,
          salePrice:Number(customer.newPurchase.salePrice),
          buyPrice:Number(customer.newPurchase.buyPrice),
          quantity:1,
        });
        delete customer.newPurchase;
        $http.put('/api/customers/' + customer._id, customer);
      }
    }

    $scope.selectCustomerPurchases = function(customer){
      var selectAll = $('input#check-purchases-'+customer._id)
      if (!selectAll.prop("checked")){
        $('input.check-purchase-'+customer._id).each(function(){
          $(this).prop("checked", false);
        });
        selectAll.prop("checked", false);
      }
      else{
        $('input.check-purchase-'+customer._id).each(function(){
          $(this).prop("checked", true);
        });
        selectAll.prop("checked", true);
      }
    }

    $scope.deleteSelectedPurchases = function(customer){
      var productsToDelete = [];
      $('input.check-purchase-'+customer._id).each(function(){
        if ($(this).prop("checked")){
          productsToDelete.push($(this).val());
        }
      });
      $('input#check-purchases-'+customer._id).prop("checked", false);
      if (productsToDelete.length){
        productsToDelete.reverse();
        for (var iIdx in productsToDelete){
          customer.purchases[$scope.currentOrder.year+$scope.currentOrder.month].splice(productsToDelete[iIdx], 1);
        }
        $http.put('/api/customers/' + customer._id, customer);
      }
    }

    $scope.editPurchase = function(customer, index){
      $scope.edit.customer = customer._id;
      $scope.edit.purchase = index;
    }

    $scope.updatePurchase = function(customer){
      $scope.edit.customer = null;
      $scope.edit.purchase = null;
      $http.put('/api/customers/' + customer._id, customer);
    }

    $scope.addPayment = function(customer){
      if (customer.newPayment){
        var payment = {
          day:$scope.thisDay,
          amount:Number(customer.newPayment),
        };
        customer.payments[$scope.currentOrder.year+$scope.currentOrder.month].push(payment);
        delete customer.newPayment;
        $http.put('/api/customers/' + customer._id, customer);
      }
    }

    $scope.selectCustomerPayments = function(customer){
      var selectAll = $('input#check-payments-'+customer._id)
      if (!selectAll.prop("checked")){
        $('input.check-payment-'+customer._id).each(function(){
          $(this).prop("checked", false);
        });
        selectAll.prop("checked", false);
      }
      else{
        $('input.check-payment-'+customer._id).each(function(){
          $(this).prop("checked", true);
        });
        selectAll.prop("checked", true);
      }
    }

    $scope.deleteSelectedPayments = function(customer){
      var paymentsToDelete = [];
      $('input.check-payment-'+customer._id).each(function(){
        if ($(this).prop("checked")){
          paymentsToDelete.push($(this).val());
        }
      });
      $('input#check-payments-'+customer._id).prop("checked", false);
      if (paymentsToDelete.length){
        paymentsToDelete.reverse();
        for (var iIdx in paymentsToDelete){
          customer.payments[$scope.currentOrder.year+$scope.currentOrder.month].splice(paymentsToDelete[iIdx], 1);
        }
        $http.put('/api/customers/' + customer._id, customer);
      }
    }

    $scope.editPayment = function(customer, index){
      $scope.edit.customer = customer._id;
      $scope.edit.payment = index;
    }

    $scope.updatePayment = function(customer){
      $scope.edit.customer = null;
      $scope.edit.payment = null;
      $http.put('/api/customers/' + customer._id, customer);
    }

    $scope.getProductName = function(productId){
      //return $filter('filter')($scope.products, function (product) {return product._id == productId;})[0].name;
      for (var productIdx in $scope.products){
        if ($scope.products[productIdx]._id == productId){
          return $scope.products[productIdx].name;
        }
      }
      return "No encontrado!"
    }
    $scope.getOrderCustomerPurchases = function(customer){
      return $scope.purchases[customer._id]
    }
    $scope.getOrderCustomerPayments = function(customer){
      return $scope.payments[customer._id]
    }
    $scope.getOrderPrice = function(customer){
      var orderPrice = 0;
      for (var purchaseIdx in $scope.purchases[customer._id]){
        var purchase = $scope.purchases[customer._id][purchaseIdx];
        orderPrice += purchase.salePrice*purchase.quantity;
      }
      return orderPrice
    }
    $scope.getOrderPayments = function(customer){
      var orderPayments = 0;
      for (var paymentIdx in $scope.payments[customer._id]){
        orderPayments += Number($scope.payments[customer._id][paymentIdx].amount);
      }
      return orderPayments
    }
    $scope.getOrderMissingPay = function(customer){
      return $scope.getOrderPrice(customer) - $scope.getOrderPayments(customer)
    }
    $scope.getOrderEarning = function(customer){
      var orderBuys = 0;
      for (var purchaseIdx in $scope.purchases[customer._id]){
        var purchase = $scope.purchases[customer._id][purchaseIdx];
        orderBuys += purchase.buyPrice*purchase.quantity;
      }
      return $scope.getOrderPayments(customer) - orderBuys
    }

  });
