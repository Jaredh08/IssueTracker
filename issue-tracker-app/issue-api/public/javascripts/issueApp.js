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
    })
    .when('/users', {
        templateurl: 'users.html',
        controller: 'userController'
    })
    .when('/users/:id', {
      templateUrl: 'userEditor.html',
      controller: 'updateUser'
    })
    //add other angular routes here
});

//turn off hashbang mode
app.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode(true);
}]);

// //sending jwt with every auth request
// app.config(function Config($httpProvider, jwtOptionsProvider) {
//   jwtOptionsProvider.config({
//     tokenGetter: localStorage.getItem('token'),
//     authPrefix: ''
//   });
//   $httpProvider.interceptors.push('jwtInterceptor');
// });

//controllers
app.controller('authController', function($scope, $http, $location, $rootScope, $window){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function() {
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.success){
        var token = data.token;
        //var payload = jwtHelper.decodeToken(token);
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

app.controller('dateController', dateController);
function dateController ($scope) {
  $scope.StartDate = new Date();
}

// User Factory Service
app.factory('UserService', ['$resource', ($resource) => {
    return $resource('/users/users.json/:id', null, {
        'update': {method: 'PUT'}
    });
}]);

// Helper Functions Service
app.factory('HelperFunctions', function ($location) {
    return {
        changeView: function(view) {
            $location.path(view);
        },
        refresh: function() {
            $scope.users = UserService.query();
            $scope.user = "";
        }
    };
});

// Projects listing Controller
app.controller('UserController', function($scope, UserService, $http, HelperFunctions) {
    $scope.users = UserService.query();
    $scope.helpers = HelperFunctions;

    // create a new project
    $scope.createUser =  () => {
        $http.post('/users/', $scope.user)
        .then(() => {
            $scope.users = UserService.query();
            $scope.user = "";
        });
    };

    // delete a project
    $scope.deleteUser = (user_id) => {
        console.log("TEST ", user_id);
        $http.delete('/users/users.json/' + user_id)
        .then(() => {
            $scope.users = UserService.query();
        });
    }
});

app.controller('UpdateUser', function($scope, ProjectService, $http, $routeParams, HelperFunctions) {
    $scope.user = UserService.get({id: $routeParams.id});

    // update the project
    $scope.updateUser = function() {
        $http.put('/user/users.json/' + $routeParams.id, $scope.user)
        .then(() => {
            $scope.users = UserService.query();
            HelperFunctions.changeView('/')
        });
    }

});
