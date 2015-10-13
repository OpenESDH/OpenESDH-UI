    
    angular
        .module('openeApp.tasks.common')
        .controller('baseTaskController', BaseTaskController);
    
    function BaseTaskController(taskService, $stateParams, $location, documentPreviewService, sessionService, workflowService, $translate) {
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
        vm.changeStatus = changeStatus;
        vm.previewDocument = previewDocument;
        vm.documentNodeRefToOpen = documentNodeRefToOpen;
        vm.statuses = ["Not Yet Started", "In Progres", "On Hold", "Cancelled"];
        vm.toggleStatus = {item: -1};
        vm.isAdmin = sessionService.isAdmin();
        
        function init(){
            var vm = this;
            taskService.getTaskDetails(vm.taskId).then(function(result){
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
        
        //TODO – deleteWorkflow needs implementation
        /**
         * Pre – Accepts a task object and possibly info on related workflow/process
         * Post – Deletes the task and it's related workflow/process
         */
        function deleteWorkflow(task) {
          
        };
        
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

        function changeStatus(idx){
            var vm = this;
            vm.toggleStatus.item = idx;
            vm.task.properties.bpm_status = vm.statuses[idx];
        }

        function previewDocument(item){
            var nodeRef = item.nodeRef;
            if(item.mainDocNodeRef != undefined && item.mainDocNodeRef != null){
                nodeRef = item.mainDocNodeRef;
            }
            documentPreviewService.previewDocument(nodeRef);
        }
        
        function documentNodeRefToOpen(item){
            if(item.docRecordNodeRef != undefined && item.docRecordNodeRef != null){
                return item.docRecordNodeRef;
            }
            return item.nodeRef;
        }
    }
