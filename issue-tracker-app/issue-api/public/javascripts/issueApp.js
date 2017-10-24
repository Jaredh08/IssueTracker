var app = angular.module('app', ['ngRoute', 'ngResource', 'angular-jwt'])
  .run(function($http, $rootScope){
      $rootScope.authenticated = false;
      $rootScope.current_user = 'Guest';

      $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
      };
  });

/* routes */
app.config(function($routeProvider) {
    $routeProvider
    //the login display
    .when('/', {
        templateUrl: '/login.html',
        controller: 'authController'
    });
    //add other angular routes here
});

//turn off hashbang mode
app.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode(true);
}]);

//sending jwt with every auth request
app.config(function Config($httpProvider, jwtOptionsProvider) {
  jwtOptionsProvider.config({
    tokenGetter: localStorage.getItem('token'),
    authPrefix: ''
  });
  $httpProvider.interceptors.push('jwtInterceptor');
});

//controllers
app.controller('authController', function($scope, $http, $location, $rootScope, $window){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function() {
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.success){
        var token = data.token;
        var payload = jwtHelper.decodeToken(token);
        console.log(payload);
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $window.localStorage.currentUser = {
          user: data.user.username,
          token: data.token,
          id:   data.user.id
        };
        $http.get('/projects', {
          headers: {'Authorization': data.token}
        }).then($location.path('/projects'));
        //send successful logins to projects for now TODO (send to timelog)
      }
      else {
        $scope.error_message = data.message;
      }
    });
  };
});
