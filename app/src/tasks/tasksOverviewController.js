    
    angular
        .module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);
    
    function TasksOverviewController($filter, taskService) {
        var vm = this;
        vm.tasks = [];
        vm.$filter = $filter;
        
        vm.statuses = taskService.getTaskStatuses();
        loadTasks();
        
        function loadTasks(){
            taskService.getTasks().then(function(result){
                vm.tasks = result;
            });
        }

    }
