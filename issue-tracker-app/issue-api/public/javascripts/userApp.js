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
          templateUrl: '/users.html',
          controller: 'userController'
      })
      .when('/:id', {
        templateUrl: '/users/:id.html',
        controller: 'updateUser'
      })
  });

  //turn off hashbang mode
  app.config(['$locationProvider', function($locationProvider) {
       $locationProvider.html5Mode(true);
  }]);


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

  app.controller('updateUser', function($scope, ProjectService, $http, $routeParams, HelperFunctions) {
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
