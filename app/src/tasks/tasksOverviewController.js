(function(){

    
    angular.module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);
    
    TasksOverviewController.$inject = [ '$scope', 'taskService', '$mdDialog', '$translate', 'workflowService', 'sessionService'];
    
    function TasksOverviewController($scope, taskService, $mdDialog, $translate, workflowService,  sessionService) {
        var vm = this;
        vm.deleteTask = deleteTask;
        vm.isAdmin = sessionService.isAdmin();
        
        init();
        
        function init(){
            taskService.getCurrentUserWorkflowTasks().then(function(result){
                vm.tasks = result;
            });
        }
        
        function deleteTask(task){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .content($translate.instant('WORKFLOW.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_TASK_AND_WORKFLOW', {task_description: task.properties.bpm_description}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                workflowService.deleteWorkflow(task.workflowInstance.id).then(function(result){
                    init();
                });
            });
        }
        
    }

})();
