(function(){

    
    angular.module('openeApp.tasks.common')
        .controller('baseTaskController', BaseTaskController);
    
    BaseTaskController.$inject = ['taskService' , '$stateParams', '$location'];
    
    function BaseTaskController(taskService, $stateParams, $location) {
        var vm = this;
        vm.taskId = $stateParams.taskId;
        vm.init = init;
        vm.updateTask = updateTask;
        vm.cancel = cancel;
        vm.taskDone = taskDone;
        vm.approve = approve;
        vm.reject = reject;
        vm.endTask = endTask;
        vm.backToTasks = backToTasks;
        
        function init(){
            var vm = this;
            taskService.getTaskDetails(vm.taskId).then(function(result){
                console.log("got task", result);
                vm.task = result;
                vm.taskProperties = angular.extend({}, result.properties);
            });
        }
        
        function updateTask(){
            var vm = this;
            taskService.updateTask(vm.taskId, vm.task.properties).then(function(response){
                vm.backToTasks();
            });
        }
        
        function taskDone(){
            var vm = this;
            taskService.updateTask(vm.taskId, vm.task.properties).then(function(response){
                vm.endTask();
            });
        }
        
        function cancel(){
            this.backToTasks();
        }
        
        /**
         *   Uses vm.reviewOutcomeProperty as review outcome property name.
         *   Uses vm.reviewOutcomeApprove as review approval outcome value.
         */
        function approve(){
            var vm = this;
            var props = {};
            props[vm.reviewOutcomeProperty] = vm.reviewOutcomeApprove;
            taskService.updateTask(vm.taskId, props).then(function(response){
                vm.endTask();
            });
        }

        /**
         * Uses vm.reviewOutcomeReject as review reject outcome value.
         */
        function reject(){
            var vm = this;
            var props = {};
            props[vm.reviewOutcomeProperty] = vm.reviewOutcomeReject;
            taskService.updateTask(vm.taskId, props).then(function(response){
                vm.endTask();
            });
        }
        
        function endTask(){
            taskService.endTask(vm.taskId).then(function(response){
                vm.backToTasks();
            });
        }
        
        function backToTasks(){
            $location.path('/tasks');
        }
    }
})();
