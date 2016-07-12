'use strict';

angular.module('flight', [
  'datatables', 'ngResource'
])
.controller('instantSearch',function($scope,$http) {
  $http.get('List_of_ICAO_aircraft_type_designators.json').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
})
.controller('airport_datatable', AirportsWithPromiseCtrl)
.controller('airport_search',function($scope,$http) {
  $http.get('/api/airports').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
})
.controller('flightplan_search',function($scope,$http) {
  $http.get('/api/flightplans').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
})
.filter('searchFor', function() {
  return function(arr, searchString){
    if (!searchString){
      return;
    }

    var result = [];
    searchString = searchString.toLowerCase();

    angular.forEach(arr, function(item){
      if ((item.ICAO.toLowerCase().indexOf(searchString) !== -1) ||
          (item.Description.toLowerCase().indexOf(searchString) !== -1)) {
        result.push(item);
      }
    });

    return result;
  };
})
.filter('airportFilter', function() {
  return function(arr, searchString){
    if (!searchString){
      return;
    }

    var result = [];
    searchString = searchString.toLowerCase();

    angular.forEach(arr, function(item){
      if ((item.city.toLowerCase().indexOf(searchString) !== -1) ||
          (item.icao.toLowerCase().indexOf(searchString) !== -1)) {
        result.push(item);
      }
    });

    return result;
  };
});


function AirportsWithPromiseCtrl(DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;
  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/airports').then(function(result) {
          defer.resolve(result.data);
      });
      return defer.promise;
  }).withPaginationType('full_numbers');

  vm.dtColumns = [
    DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
    DTColumnBuilder.newColumn('icao').withTitle('ICAO'),
    DTColumnBuilder.newColumn('name').withTitle('Name'),
    DTColumnBuilder.newColumn('city').withTitle('City'),
    DTColumnBuilder.newColumn('country').withTitle('Country'),
    DTColumnBuilder.newColumn('iata').withTitle('ICAO').notVisible(),
    DTColumnBuilder.newColumn('lat').withTitle('lat').notVisible(),
    DTColumnBuilder.newColumn('lon').withTitle('lon').notVisible(),
    DTColumnBuilder.newColumn('alt').withTitle('alt').notVisible(),
    DTColumnBuilder.newColumn('utc_offset').withTitle('utc_offset').notVisible(),
    DTColumnBuilder.newColumn('dst').withTitle('dst').notVisible(),
    DTColumnBuilder.newColumn('tz').withTitle('tz'),
    DTColumnBuilder.newColumn('__v').withTitle('__v').notVisible()
  ];
};
