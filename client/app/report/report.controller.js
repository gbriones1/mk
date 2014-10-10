'use strict';

angular.module('mkApp')
  .controller('ReportCtrl', function ($scope, $http) {
    $scope.months=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.years=[2013, 2014, 2015, 2016];
    $scope.selectedYear = new Date().getFullYear();
    $scope.customers = [];

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
      console.log($scope.selectedYear===null);
      for (var monthIdx in $scope.months){
        var orderBuys = 0;
        var orderPayments = 0;
        for (var customerIdx in $scope.customers){
          var customer = $scope.customers[customerIdx];
          if (customer.purchases){
            for (var purchaseKey in customer.purchases){
              if (purchaseKey == $scope.selectedYear+$scope.months[monthIdx]){
                for (var purchaseIdx in customer.purchases[purchaseKey]){
                  var purchase = customer.purchases[purchaseKey][purchaseIdx];
                  orderBuys += purchase.buyPrice*purchase.quantity;
                }
              }
            }
          }
          if (customer.payments){
            for (var paymentKey in customer.payments){
              if (paymentKey == $scope.selectedYear+$scope.months[monthIdx]){
                for (var paymentIdx in customer.payments[paymentKey]){
                  orderPayments += Number(customer.payments[paymentKey][paymentIdx].amount);
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

    }

    var reloadMostPurchasedProductChart = function(){

    }

    $scope.reloadCharts = function(){
      reloadAnnualEarningsChart();
      reloadMostValuableCustomersChart();
      reloadMostPurchasedProductChart();
    }

    $http.get('/api/customers').success(function(customers){
      $scope.customers = customers;
      $scope.reloadCharts();
    });


  });
