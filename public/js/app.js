//
//
//

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
.controller('flightplans', FlightplansController)
.controller('airline_datatable', AirlinesWithPromiseCtrl);

function FlightplansController($scope, $http, $location, $window) {
  $scope.master = {};
  $scope.total_flightplans = '?'; // TODO this should come from a cache

  $scope.update = function(flightplan) {
    console.log("Here we go ya...");

    $scope.master = angular.copy(flightplan);

    // { AircraftIdentification: 'D-AIMJ', DepartureAerodrome: 'KSFO', DepartureTime: '1500', CruisingSpeed: '494', CruisingLevel: '37', Route: 'TRUKN2 ORRCA Q120 ZORUN PARZZ Q121 TOUGH HML ELVEL DUSMA JOVIE JANJO 5500N/05000W 5500N/04000W 5400N/03000W 5300N/02000W MALOT GISTI SLANY UL9 KONAN UL607 SPI UT180 PESOV T180 UNOKO UNOKO1B', ArrivalAerodrome: 'EDDF', EstimatedEnrouteTime: '10'  }
    $http.post('/api/flightplans', $scope.flightplan)
      .success(function(data) {
        $scope.flightplan = {};
        console.log(data);
        $window.location.href = '/flightplans';
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.reset = function() {
    $scope.flightplan = angular.copy($scope.master);
  };

  $scope.reset();
};

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

function FlightplansWithPromiseCtrl($scope, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;
  vm.message = '';
  vm.flightplans = {};
  vm.delete = deleteRow;
  vm.dtInstance = {};

  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/flightplans').then(function(result) {
          defer.resolve(result.data);
      });
      return defer.promise;
  }).withPaginationType('full_numbers');

  vm.dtColumns = [
    DTColumnBuilder.newColumn('_id').withTitle('id').notVisible(),
    DTColumnBuilder.newColumn('AircraftIdentification').withTitle('AircraftIdentification'),
    DTColumnBuilder.newColumn('DepartureAerodrome').withTitle('DepartureAerodrome'),
    DTColumnBuilder.newColumn('DepartureTime').withTitle('DepartureTime'),
    DTColumnBuilder.newColumn('CruisingSpeed').withTitle('CruisingSpeed').notVisible(),
    DTColumnBuilder.newColumn('CruisingLevel').withTitle('CruisingLevel').notVisible(),
    DTColumnBuilder.newColumn('Route').withTitle('Route').notVisible(),
    DTColumnBuilder.newColumn('ArrivalAerodrome').withTitle('ArrivalAerodrome'),
    DTColumnBuilder.newColumn('EstimatedEnrouteTime').withTitle('EstimatedEnrouteTime'),
    DTColumnBuilder.newColumn('OtherInformation').withTitle('OtherInformation').notVisible(),
    DTColumnBuilder.newColumn('Endurance').withTitle('Endurance').notVisible(),
    DTColumnBuilder.newColumn('PersonsOnBoard').withTitle('PersonsOnBoard').notVisible(),
    DTColumnBuilder.newColumn('PilotInCommand').withTitle('PilotInCommand').notVisible(),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
  ];

  function deleteRow(fpid) {
    console.log(fpid);

    vm.message = 'You are trying to remove the row: ' + JSON.stringify(fpid);
    // Delete some data and call server to make changes...

    // Then reload the data so that DT is refreshed
    vm.dtInstance.reloadData();
  }

  function actionsHtml(data, type, full, meta) {
    console.log(data);

    return '<button class="btn btn-danger" ng-click="flightplans.delete(' + data._id + ')">' +
    '<i class="fa fa-trash-o"></i>' +
    '</button>';

    /* <div class="dropdown pull-right dropdown-kebab-pf">
      <button class="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <span class="fa fa-ellipsis-v"></span>
      </button>
      <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight">
        <li><a href="#">show</a></li>
        <li><a href="#">edit</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">delete</a></li>
      </ul>
    </div --><!-- dropdown pull-right dropdown-kebab-pf */
  };
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
