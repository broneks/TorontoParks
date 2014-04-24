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

app.factory('mapFactory', function() {
	return {
		init: function(loc_name) {
			var geocoder = new google.maps.Geocoder();

			var mapOptions = {
				zoom: 16,
				center: new google.maps.LatLng(-34.397, 150.644)
	 		};

			var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

      		geocoder.geocode({ 'address': loc_name + ' Toronto' }, function(results, status) {
        		if (status == google.maps.GeocoderStatus.OK) {
          			if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {

          				map.setCenter(results[0].geometry.location);

			            var infowindow = new google.maps.InfoWindow({ 
								content: 'Name:<br>' + loc_name + '<br><br>Address:<br>' + results[0].formatted_address,
			                  	size: new google.maps.Size(150,50)
							});

            			var marker = new google.maps.Marker({
                				position: results[0].geometry.location,
               					map: map, 
                				title: loc_name + ' - ' + results[0].formatted_address 
            				}); 
            
            			google.maps.event.addListener(marker, 'click', function() {
                			infowindow.open(map, marker);
            			});
            		}
            	} else {
            		alert("An unexpected error occurred: " + status);
            	}
            });
		}
	};
});

app.controller('HomeCtrl', function($scope, $http) {
	$scope.url = 'php/search.php';

	$scope.search = function() {
		$http.post($scope.url, { 'data': $scope.keywords, 'searchBy': $scope.searchBy })
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

app.controller('LocationCtrl', function($scope, $http, $routeParams, mapFactory) {
	$scope.url = 'php/location.php?id=' + $routeParams.id;

	$http.get($scope.url)
		.success(function(data, status) {
			$scope.location = data;

			if (data.data)
				mapFactory.init(data.data[0].name);
		});
});