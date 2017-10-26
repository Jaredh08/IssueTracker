var app = angular.module('app', ['ngRoute', 'ngResource']);

/* Services */

// Project Service
app.factory('ProjectService', ['$resource', ($resource) => {
    return $resource('/projects/projects.json/:id', null, {
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
            $scope.projects = ProjectService.query();
            $scope.project = "";
        }
    };
});

//turn off hashbang mode
app.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode(true);
}]);

// Projects listing Controller
app.controller('ProjectController', ['$scope', 'ProjectService', '$http', 'HelperFunctions', ($scope, ProjectService, $http, HelperFunctions) => {
    $scope.projects = ProjectService.query();
    $scope.helpers = HelperFunctions;

    // create a new project
    $scope.createProject =  () => {
        $http.post('/projects/', $scope.project)
        .then(() => {
            $scope.projects = ProjectService.query();
            $scope.project = "";
        });
    };

    // delete a project
    $scope.deleteProject = (project_id) => {
        console.log("TEST ", project_id);
        $http.delete('/projects/projects.json/' + project_id)
        .then(() => {
            $scope.projects = ProjectService.query();
        });
    }
}]);


app.controller('UpdateProject', function($scope, ProjectService, $http, $routeParams, HelperFunctions) {
    $scope.project = ProjectService.get({id: $routeParams.id});

    // update the project
    $scope.updateProject = function() {
        $http.put('/projects/projects.json/' + $routeParams.id, $scope.project)
        .then(() => {
            $scope.projects = ProjectService.query();
            HelperFunctions.changeView('/')
        });
    }

});

// routes
app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: '/projects.html',
            controller: 'ProjectController'
        })
        .when('/:id', {
            templateUrl: '/updateProject.html',
            controller: 'UpdateProject'
        })
}]);
