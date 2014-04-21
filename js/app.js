var app = angular.module('locationsApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller:  'HomeCtrl'
		})

		.when('/location/:id', {
			templateUrl: 'location.html',
			controller:  'LocationCtrl'
		})

		.otherwise({ redirectTo: '/' });
});

app.controller('HomeCtrl', function($scope, $http) {
	$scope.url = 'php/search.php';

	$scope.search = function() {
		$http.post($scope.url, { 'data': $scope.keywords })
			.success(function(data, status) {
				$scope.result = data;
				$scope.keywords = '';
			})
			.error(function(data, status) {
				$scope.data = data || 'Request Failed';
				$scope.status = status;
			});
	};
});

app.controller('LocationCtrl', function($scope, $http, $routeParams) {
	$scope.url = 'php/location.php?id=' + $routeParams.id;

	$http.get($scope.url)
		.success(function(data, status) {
			$scope.location = data;
		});
});