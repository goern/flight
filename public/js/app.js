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
.controller('flightplans_datatable', FlightplansWithPromiseCtrl)
.controller('airline_datatable', AirlinesWithPromiseCtrl)

function AirportsWithPromiseCtrl($scope, DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;
  vm.message = '';
  vm.someClickHandler = someClickHandler;
  vm.airports = {};

  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/airports').then(function(result) {
          defer.resolve(result.data);
      });
      return defer.promise;
  }).withPaginationType('full_numbers').withOption('rowCallback', rowCallback);

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
    DTColumnBuilder.newColumn('__v').withTitle('__v').notVisible(),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
  ];

  function someClickHandler(info) {
    vm.message = info._id + ' - ' + info.lon;
  };

  function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
    $('td', nRow).unbind('click');
    $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
            vm.someClickHandler(aData);
        });
    });
    return nRow;
  };

  function actionsHtml(data, type, full, meta) {
    vm.airports[data._id] = data;

    return '<button class="btn"><i class="fa fa-eye"></i></button>';
  };
};

function FlightplansWithPromiseCtrl(DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;
  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/flightplans').then(function(result) {
          defer.resolve(result.data);
      });
      return defer.promise;
  }).withPaginationType('full_numbers');

  vm.dtColumns = [
    DTColumnBuilder.newColumn('AircraftIdentification').withTitle('AircraftIdentification'),
    DTColumnBuilder.newColumn('DepartureAerodrome').withTitle('DepartureAerodrome'),
    DTColumnBuilder.newColumn('DepartureTime').withTitle('DepartureTime'),
    DTColumnBuilder.newColumn('CruisingSpeed').withTitle('CruisingSpeed').notVisible(),
    DTColumnBuilder.newColumn('CruisingLevel').withTitle('CruisingLevel').notVisible(),
    DTColumnBuilder.newColumn('Route').withTitle('Route').notVisible(),
    DTColumnBuilder.newColumn('ArrivalAerodrome').withTitle('ArrivalAerodrome'),
    DTColumnBuilder.newColumn('EstimatedEnRouteTime').withTitle('EstimatedEnRouteTime'),
    DTColumnBuilder.newColumn('OtherInformation').withTitle('OtherInformation').notVisible(),
    DTColumnBuilder.newColumn('Endurance').withTitle('Endurance').notVisible(),
    DTColumnBuilder.newColumn('PersonsOnBoard').withTitle('PersonsOnBoard').notVisible(),
    DTColumnBuilder.newColumn('PilotInCommand').withTitle('PilotInCommand').notVisible()
  ];
};

function AirlinesWithPromiseCtrl($scope, DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;

  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/airlines').then(function(result) {
          defer.resolve(result.data);
      });
      return defer.promise;
  }).withPaginationType('full_numbers');

  vm.dtColumns = [
    DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
    DTColumnBuilder.newColumn('name').withTitle('Name'),
    DTColumnBuilder.newColumn('alias').withTitle('Alias').notVisible(),
    DTColumnBuilder.newColumn('iata').withTitle('IATA'),
    DTColumnBuilder.newColumn('icao').withTitle('ICAO'),
    DTColumnBuilder.newColumn('callsign').withTitle('Call Sign'),
    DTColumnBuilder.newColumn('country').withTitle('Country'),
    DTColumnBuilder.newColumn('__v').withTitle('__v').notVisible()
  ];

};
