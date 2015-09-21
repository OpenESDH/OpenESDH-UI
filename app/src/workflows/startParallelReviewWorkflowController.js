(function(){
    
    angular
        .module('openeApp.workflows')
        .controller('StartParallelReviewWorkflowController', StartParallelReviewWorkflowController);
    
    StartParallelReviewWorkflowController.$inject = ['$controller', 'userService', 'workflowDef'];
    
    function StartParallelReviewWorkflowController($controller, userService, workflowDef) {
        
        angular.extend(this, $controller('BaseStartCaseWorkflowController', {}));
        var vm = this;
        vm.selectedRecipients = [];
        vm.workflowDef = workflowDef;
        vm.BaseStartCaseWorkflowController_getWorkflowInfo = vm.getWorkflowInfo;
        vm.getWorkflowInfo = getWorkflowInfo;
        
        init();
        
        function init(){
            vm.init();
            userService.getPersons().then(function(result){
                vm.recipients = result;
            });
        }
        
        function getWorkflowInfo(){
            var wi = vm.BaseStartCaseWorkflowController_getWorkflowInfo();
            var assignees = vm.selectedRecipients.map(function(recipient){
                return recipient.nodeRef;
            });
            angular.extend(wi, {
                assignees: assignees,
                requiredApprovalPercentage: vm.requiredApprovalPercentage
            });
            return wi;
        }

    }
    
})();