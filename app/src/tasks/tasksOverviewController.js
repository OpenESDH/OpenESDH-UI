    
    angular
        .module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);
    
    function TasksOverviewController(taskService) {
        var vm = this;
        vm.tasks = [];
        
        vm.statuses = ["Not Yet Started", "In Progres", "On Hold", "Cancelled", "Completed"];
        loadTasks();
        
        function loadTasks(){
            taskService.getTasks().then(function(result){
                vm.tasks = result;
            });
        }

    }
