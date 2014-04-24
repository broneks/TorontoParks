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
	// global abatement
	var myVars = {
		directions: null,
		directionsDisplay: null,
		directionsService: null,
		map: null,
		park: null
	};

	return {
		//
		// INITIALIZE METHOD
		// -----------------
		// sets map on load and centers on the selected park's exact location 
		//
		init: function(loc_name) {
			var geocoder = new google.maps.Geocoder();

			var mapOptions = {
				zoom: 16,
				center: new google.maps.LatLng(-34.397, 150.644)
	 		};

	 		// reseting variables
	 		myVars.directions = document.getElementById('directions');
			myVars.directionsDisplay = new google.maps.DirectionsRenderer();
	 		myVars.directionsService = new google.maps.DirectionsService();
			myVars.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

			// attaching directions display to 'directions' div
			myVars.directionsDisplay.setMap(myVars.map);
			myVars.directionsDisplay.setPanel(myVars.directions);

      		geocoder.geocode({ 'address': loc_name + ' Toronto' }, function(results, status) {
        		if (status == google.maps.GeocoderStatus.OK) {
          			if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {

          				myVars.park = results[0].geometry.location;

          				google.maps.event.trigger(myVars.map, 'resize');
          				myVars.map.setCenter(myVars.park);          				

			            var infowindow = new google.maps.InfoWindow({ 
								content: 'Address:<br><br>' + results[0].formatted_address,
			                  	size: new google.maps.Size(150,50)
							});

            			var marker = new google.maps.Marker({
                				position: myVars.park,
               					map: myVars.map, 
                				title: results[0].formatted_address 
            				}); 
            			
            			// full address displays in info window when marker is clicked
            			google.maps.event.addListener(marker, 'click', function() {
                			infowindow.open(myVars.map, marker);
            			});
            		}
            	} else {
            		alert('An unexpected error occurred: ' + status);
            	}
            });
		},

		//
		// ROUTE METHOD
		// ------------
		// calculates route and directions from a user-declared origin point to the selected park
		//
 		route: function(origin) {
    		if (origin) {

				var request = {
					origin: origin,
					destination: myVars.park,
					travelMode: google.maps.TravelMode.DRIVING
				};

				myVars.directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK)
						myVars.directionsDisplay.setDirections(response);
				});

    		} else {

    			directions.innerHTML = '';
    			document.getElementById('origin').placeholder = 'An Origin point is required ***';
    		}
  		}
	};
});

app.controller('HomeCtrl', function($scope, $http) {
	$scope.url = 'php/search.php';

	// get search results
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

	// get location data
	$http.get($scope.url)
		.success(function(data, status) {
			$scope.location = data;

			if (data.data)
				mapFactory.init(data.data[0].name + ' ' + data.data[0].address);
		});

	$scope.route = function() {
		mapFactory.route($scope.origin);
	};
});