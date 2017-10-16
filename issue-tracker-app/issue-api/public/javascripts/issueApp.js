var app = angular.module('app', ['ngRoute', 'ngResource'])
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

//controllers
app.controller('authController', function($scope, $http, $rootScope, $window){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function() {
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $window.location.href = 'projects';
      }
      else {
        $scope.error_message = data.message;
      }
    });
  };
});
