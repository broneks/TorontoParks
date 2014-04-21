var app = angular.module('locationsApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller:  'HomeCtrl'
		})

		.otherwise({ redirectTo: '/' });
});

app.controller('HomeCtrl', function($scope, $http) {
	$scope.url = "search.php";

	$scope.search = function() {
		$http.post($scope.url, { 'data': $scope.keywords })
			.success(function(data, status) {
				$scope.status = status;
				$scope.data = data;
				$scope.result = data;
				$scope.keywords = "";
			})
			.error(function(data, status) {
				$scope.data = data || "Request Failed";
				$scope.status = status;
			});
	};
});