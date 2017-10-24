var app = angular.module('app', ['ngRoute', 'ngResource']);

// Services
app.factory('ProjectService', ['$resource', ($resource) => {
    return $resource('/projects/projects.json/:id', null, {
        'update': {method: 'PUT'}
    });
}]);

// Projects listing Controller
app.controller('ProjectController', ['$scope', 'ProjectService', '$http', '$location', ($scope, ProjectService, $http, $location) => {
    $scope.projects = ProjectService.query();

    // create a new project
    $scope.createProject =  () => {
        $http.post('/projects/', $scope.project)
        .then(() => {
            $scope.refresh();
        });
    };

    $scope.modifyProject = (project) => {
        // load project to be modified
        $scope.project = project;

        // $http.put('/projects/' + project.ProjectId)
        // .then(() => {
        //     $scope.refresh();
        // });
    }

    // delete a project
    $scope.deleteProject = (project_id) => {
        console.log("TEST ", project_id);
        $http.delete('/projects/' + project_id)
        .then(() => {
            $scope.refresh();
        });
    }

    // refresh the scope to reflect database changes
    // and reset fields
    $scope.refresh = () => {
        $scope.projects = ProjectService.query();
        $scope.project = "";
    };

    $scope.changeView = function(view) {
        $location.path(view);
    }
}]);


app.controller('EditProject', function($scope, ProjectService, $http, $routeParams) {
    $scope.project = ProjectService.get({id: $routeParams.id});

    $scope.updateProject = function() {
        $http.put('/projects/projects.json/' + $routeParams.id, $scope.project)
        .then(() => {
            $scope.projects = ProjectService.query();
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
            templateUrl: '/project.html',
            controller: 'EditProject'
        })
}]);
