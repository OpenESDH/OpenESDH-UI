(function(){

  angular
       .module('openeApp')
       .controller('TaskController', TaskController);

  TaskController.$inject = ['$scope'];

  function TaskController( $scope ) {

    $scope.tasks = [
      {
        title: 'A simple task',
        desc: 'This is a description of what the task is all about',
        assignedTo: 'Someone Someonesson',
        createdDate: 'June 5 2015',
        status: 'Started'
      },
      {
        title: 'Another simple task',
        desc: 'This is a description of what the task is all about',
        assignedTo: 'Someone Someonesson',
        createdDate: 'June 5 2015',
        status: 'Not yet started'
      },
      {
        title: 'Yet another task',
        desc: 'This is a description of what the task is all about',
        assignedTo: 'Someone Someonesson',
        createdDate: 'June 5 2015',
        status: 'Waiting'
      },
      {
        title: 'Tasking, is not it?',
        desc: 'This is a description of what the task is all about',
        assignedTo: 'Someone Someonesson',
        createdDate: 'June 5 2015',
        status: 'Approved'
      }
    ];
  
  }

})();
