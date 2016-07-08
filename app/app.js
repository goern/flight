'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('flight', [
]);

app.controller('instantSearchCtrl',function($scope,$http){
  $http.get('List_of_ICAO_aircraft_type_designators.json').success(function(data, status, headers, config) {
    $scope.items = data;
  }).error(function(data, status, headers, config) {
    console.log("No data found..");
  });
});

app.filter('searchFor', function(){
  return function(arr, searchString){
    if (!searchString){
      return arr;
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
