    angular
       .module('openeApp.cases')
       .controller('CaseTasksController', CaseTasksController);
    
    function CaseTasksController($scope, $stateParams, $filter, taskService){
        var vm = this;
        vm.statuses = taskService.getTaskStatuses();
        vm.$filter = $filter;
        
        $scope.$on('tabSelectEvent', function(event, args) {
            if (args.tab === 'tasks') {
                init();
            }
        });
        
        function init(){
            taskService.getCaseTasks($stateParams.caseId).then(function(result){
                vm.tasks = result;
            });
        }
    }