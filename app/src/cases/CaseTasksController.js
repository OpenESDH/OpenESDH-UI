    angular
       .module('openeApp.cases')
       .controller('CaseTasksController', CaseTasksController);
    
    function CaseTasksController($stateParams, taskService){
        var vm = this;
        vm.statuses = taskService.getTaskStatuses();
        vm.displayHeader = false;
        vm.case_tasks = true;
        
        init();
        
        function init(){
            taskService.getCaseTasks($stateParams.caseId).then(function(result){
                vm.tasks = result;
            });
        }
    }