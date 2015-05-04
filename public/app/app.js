(function(){
	var  app = angular.module('NightOwl', []);

	app.controller('MainController', function($scope, $http) {
		// Start on the login page
		$scope.selected = 'login';

		$scope.initialize = function(configData){
			$scope.config = configData;
			loadCodes(
				function(data){$scope.launchCodes = data;} 
				, null);
		};

		// Load configuration data
		loadConfig( $scope.initialize );

	});

	app.controller('LoginController', function($scope, $http) {
		//ADD LOGIN FUNCTIONALITY HERE
	});

	app.controller('ListController', function($scope, $http) {
		// Default region is west
		$scope.region = "west";

		// Create mode is off
		$scope.createMode = false;

		// Should filter the code results based on the selected prefix
		$scope.filterResults = function(){
			loadCodes(function(data){
				$scope.launchCodes = data;
				
				var filter = 	
					( $scope.tree ? $scope.tree.name : "" ) + "/" +
					( $scope.subtree ? $scope.subtree : "" );

				for( tree in $scope.launchCodes ){
					if(tree.indexOf(filter) == -1){
						delete $scope.launchCodes[tree];
						console.log($scope.launchCodes);
					}
				}

			}, $scope.config.API_URL, $scope.getFilters());
		};

		// Gets the data center, prefix and filter type + expression
		$scope.getFilters = function(){
			var filters = {
				dc : $scope.dataCenter,
				prefix : $scope.prefix,
				filterBy : $scope.filterBy,
				filter : $scope.filter,
			}
			return filters;
		}

		// Toggles inputs for given code between enabled and disabled
		$scope.toggleEditMode = function(parent, child){
			var inputs = $scope.getInputs(parent, child);
			inputs.prop('disabled', !inputs.prop('disabled'));
		}

		// Returns true if the current code is editable
		$scope.inEditMode = function(parent, child){
			var input = $scope.getInputs(parent, child).first()
			return !input.prop('disabled');
		}

		// Gets the inputs, select box, and textarea associated with the code
		$scope.getInputs = function(parent, child){
			var selector = "tr#code-" + parent + "-" + child;
			return $(selector).find("td input, td select, td textarea");
		}

		// TODO: Save the code using the API		
		$scope.saveCode = function(code){
			console.log("SAVE THE CODE")
		}

		// TODO: Delete the code using the API (MAKE SURE TO CONFIRM FIRST)
		$scope.deleteCode = function(code){
			console.log("DELETE THE CODE")
		}

		// TODO: Discard the changes made to the code
		$scope.discardChanges = function(code){
			console.log("DISCARD THE CHANGES")
		}

		$scope.createCode = function(code){
			var url = $scope.config.API_URL + "/codes/" + getToken() + "/" + code.key

			var restriction, value, description, availableToJS;

			restriction = code.restriction || 'boolean';
			value = (code.value === "true");
			description = code.description;
			if(code.availableToJS){
				availableToJS = 1;
			}else{
				availableToJS = 0;
			}

			var newCode = {
				restriction : restriction,
				value : value,
				description : description,
				availableToJS : availableToJS
			};

			$http.post(url, newCode).
			  success(function(data, status, headers, config) {
			    console.log(newCode)
			  });
		}
	});

	app.controller('AuditController', function($scope, $http) {
		$scope.msg = "LIST THE AUDITS";
	});

    app.controller('BackgroundController', function() {

    });

    //LoginModal functions
    app.run(function ($rootScope) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;

            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();

                loginModal()
                    .then(function () {
                        return $state.go(toState.name. toParams);
                    })
                    .catch(function () {
                        return $state.go('/');
                    });
            }
        });
    });


})();

		// Load the configuration file
function loadConfig(_callback){
	$.getJSON("app/config.json", function(json, textStatus) {
		_callback(json);
	});
};

// Load the launch codes
function loadCodes(_callback, baseURL, filters){
	if( !filters ){
		filters = { dc : "DC1" };
	}

	//var url = makeURL(baseURL, filters);
	var url = "app/codes.json";

	$.getJSON(url, function(json, textStatus) {
		_callback(json);
	});
}

// Make the API URL
function makeURL(filters){
	var url = $scope.config.API_URL + "/codes/" + getToken() + "/" + filters.dc;
	if( filters.prefix ){
		url = url + "/" + filters.prefix;
	}
	if( filters.filterBy ){
		url = url + "/" + filters.filterBy + "/" + filters.filter;
	}
	return url;
}

// TODO: get security token
function getToken(){
	return "token";
}