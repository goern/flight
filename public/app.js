'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('flight', [
]);

app.controller('instantSearch',function($scope,$http) {
  $http.get('List_of_ICAO_aircraft_type_designators.json').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
});

app.controller('airport_search',function($scope,$http) {
  $http.get('/api/airports').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
});

app.controller('flightplan_search',function($scope,$http) {
  $http.get('/api/flightplans').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
});

app.filter('searchFor', function(){
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
});

app.filter('airportFilter', function(){
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
