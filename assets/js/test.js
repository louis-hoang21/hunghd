let myApp = angular.module('myModule', []);

myApp.controller("MyController", controller1);

function controller1($scope) {
    $scope.totalNumber = 4;

    let todos = [
        {text: 'Angular', status: true},
        {text: 'Golang', status: false}
    ];

    let totalDone = 0;

    todos.forEach(function (todo) {
        if (todo.status) {
            totalDone++
        }
    })

    $scope.person = {
        name: 'hunghd',
        age: '24',
        gender: 'male',
        todos: todos,
        totalTask: todos.length,
        totalTaskDone: totalDone
    };
}