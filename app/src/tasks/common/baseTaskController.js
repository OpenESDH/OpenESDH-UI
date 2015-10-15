    
    angular
        .module('openeApp.tasks.common')
        .controller('baseTaskController', BaseTaskController);
    
    function BaseTaskController(taskService, $stateParams, $location, documentPreviewService, sessionService, workflowService, $translate, $mdDialog, $mdToast) {
        var vm = this;
        vm.taskId = $stateParams.taskId;
        vm.init = init;
        vm.updateTask = updateTask;
        vm.taskDone = taskDone;
        vm.approve = approve;
        vm.reject = reject;
        vm.endTask = endTask;
        vm.backToTasks = backToTasks;
        vm.changeStatus = changeStatus;
        vm.previewDocument = previewDocument;
        vm.deleteWorkflow = deleteWorkflow;
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
        
        function deleteWorkflow(task) {
            var vm = this;
            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .content($translate.instant('WORKFLOW.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_TASK_AND_WORKFLOW', {task_description: task.properties.bpm_description}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                workflowService.deleteWorkflow(task.workflowInstance.id).then(function(result){
                    vm.backToTasks();
                });
            });
          
        };
        
        function taskDone(){
            var vm = this;
            taskService.updateTask(vm.taskId, vm.task.properties).then(function(response){
                vm.endTask($translate.instant('TASK.TASK_DONE'));
            });
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
                vm.endTask($translate.instant('TASK.TASK_APPROVED'));
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
                vm.endTask($translate.instant('TASK.TASK_REJECTED'));
            });
        }
        
        function endTask(msg){
            $mdToast.showSimple(msg);
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
            taskService.updateTask(vm.taskId, vm.task.properties).then(function(response){
                // console.log('Task status updated');
            });
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
