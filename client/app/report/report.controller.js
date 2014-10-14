'use strict';

angular.module('mkApp')
  .controller('ReportCtrl', function ($scope, $http) {
    $scope.months=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.years=[2013, 2014, 2015, 2016];
    $scope.selectedYear = new Date().getFullYear();
    $scope.customers = [];
    $scope.products = [];

    $scope.annualEarningsChart = {
      chartType:"bar",
      config: {
        title: 'Ganancia en pesos',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: false,
          position: 'left'
        },
        innerRadius: 0,
        lineLegend: 'lineEnd'
      },
      data: {
        series: ['Earnings'],
        data: []
      }
    };
    $scope.mostValuableCustomersChart = {
      chartType:"bar",
      config: {
        title: 'Compras en pesos',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: false,
          position: 'left'
        },
        innerRadius: 0,
        lineLegend: 'lineEnd'
      },
      data: {
        series: ['Earnings'],
        data: []
      }
    };
    $scope.mostPurchasedProductChart = {
      chartType:"bar",
      config: {
        title: 'Ventas en unidades',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: false,
          position: 'left'
        },
        innerRadius: 0,
        lineLegend: 'lineEnd'
      },
      data: {
        series: ['Earnings'],
        data: []
      }
    };

    var reloadAnnualEarningsChart = function(){
      $scope.annualEarningsChart.data.data = [];
      for (var monthIdx in $scope.months){
        var orderBuys = 0;
        var orderPayments = 0;
        for (var customerIdx in $scope.customers){
          var customer = $scope.customers[customerIdx];
          if (customer.orders){
            for (var orderKey in customer.orders){
              if (orderKey == $scope.selectedYear+$scope.months[monthIdx]){
                var customerOrder = customer.orders[orderKey];
                for (var purchaseIdx in customerOrder.purchases){
                  var purchase = customerOrder.purchases[purchaseIdx];
                  orderBuys += purchase.price*purchase.quantity*.6;
                }
                if (customerOrder.payments){
                  for (var paymentIdx in customerOrder.payments){
                    orderPayments += Number(customerOrder.payments[paymentIdx].amount);
                  }
                }
              }
            }
          }
        }
        $scope.annualEarningsChart.data.data.push({
          x:$scope.months[monthIdx].substring(0,3),
          y:[orderPayments-orderBuys]
        });
      }
    }

    var reloadMostValuableCustomersChart = function(){
      $scope.mostValuableCustomersChart.data.data = [];
      var sortableCustomerPurchases = [];
      for (var customerIdx in $scope.customers){
        var customer = $scope.customers[customerIdx];
        var customerTotalPurchases = 0;
        for (var orderKey in customer.orders){
          for (var purchaseIdx in customer.orders[orderKey].purchases){
            var purchase = customer.orders[orderKey].purchases[purchaseIdx];
            customerTotalPurchases += purchase.price*purchase.quantity;
          }
        }
        sortableCustomerPurchases.push([customer.name, customerTotalPurchases]);
      }
      sortableCustomerPurchases.sort(function(a, b) {return b[1] - a[1]});
      for (var customerIdx in sortableCustomerPurchases){
        $scope.mostValuableCustomersChart.data.data.push({
          x:sortableCustomerPurchases[customerIdx][0],
          y:[sortableCustomerPurchases[customerIdx][1]]
        })
      }
    }

    var reloadMostPurchasedProductChart = function(){
      $scope.mostPurchasedProductChart.data.data = [];
      var sortablePurchasedProducts = [];
      var products = {}
      for (var customerIdx in $scope.customers){
        var customer = $scope.customers[customerIdx];
        for (var orderKey in customer.orders){
          for (var purchaseIdx in customer.orders[orderKey].purchases){
            var purchase = customer.orders[orderKey].purchases[purchaseIdx];
            var productName = "Desconocido"
            for (var productIdx in $scope.products){
              if ($scope.products[productIdx]._id == purchase.product){
                productName = $scope.products[productIdx].name;
              }
            }
            if (products[productName]){
              products[productName] += Number(purchase.quantity);
            }
            else{
              products[productName] = Number(purchase.quantity);
            }
          }
        }
      }
      for (var productIdx in products){
        sortablePurchasedProducts.push([productIdx, products[productIdx]]);
      }
      sortablePurchasedProducts.sort(function(a, b) {return b[1] - a[1]});
      for (var productIdx in sortablePurchasedProducts){
        $scope.mostPurchasedProductChart.data.data.push({
          x:sortablePurchasedProducts[productIdx][0],
          y:[sortablePurchasedProducts[productIdx][1]]
        })
      }
    }

    $scope.reloadCharts = function(){
      reloadAnnualEarningsChart();
      reloadMostValuableCustomersChart();
      reloadMostPurchasedProductChart();
    }

    $http.get('/api/customers').success(function(customers){
      $scope.customers = customers;
      $http.get('/api/products').success(function(products){
        $scope.products = products;
        $scope.reloadCharts();
      });
    });


  });
