   
    angular.module('openeApp.activitiReview.tasks')
        .controller('reviewTaskController', reviewTaskController);
    
    function reviewTaskController($controller, taskService, sessionService, $mdToast, $translate) {
        angular.extend(this, $controller('baseTaskController', {}));
        var vm = this;
        vm.claim = claim;
        vm.releaseToPool = releaseToPool;
        
        init();
        
        function init(){
            vm.init();
            vm.reviewOutcomeProperty = 'wf_reviewOutcome';
            vm.reviewOutcomeApprove = 'Approve';
            vm.reviewOutcomeReject = 'Reject';
        }
        
        function claim(){
            var userInfo = sessionService.getUserInfo();
            var props = {
                    'cm_owner': userInfo.user.userName
            };
            taskService.updateTask(vm.taskId, props).then(function(response){
                $mdToast.showSimple($translate.instant('TASK.TASK_HAS_BEEN_CLAIMED'));
                vm.init();
            });
        }
        
        function releaseToPool(){
            taskService.updateTask(vm.taskId, {'cm_owner':null}).then(function(response){
                $mdToast.showSimple($translate.instant('TASK.TASK_HAS_BEEN_RELEASED'));
                vm.backToTasks();
            });
        }
        
        
    }