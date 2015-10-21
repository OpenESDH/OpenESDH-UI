    
    angular
        .module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);
    
    function TasksOverviewController(taskService) {
        var vm = this;
        vm.tasks = [];
        
        vm.statuses = taskService.getTaskStatuses();
        loadTasks();
        
        function loadTasks(){
            taskService.getTasks().then(function(result){
                vm.tasks = result;
            });
        }

    }
