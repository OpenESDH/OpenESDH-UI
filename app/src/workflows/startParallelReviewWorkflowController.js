    
    angular
        .module('openeApp.workflows')
        .controller('StartParallelReviewWorkflowController', StartParallelReviewWorkflowController);
    
    function StartParallelReviewWorkflowController($controller, userService, workflowDef) {
        
        angular.extend(this, $controller('BaseStartCaseWorkflowController', {}));
        var vm = this;
        vm.selectedRecipients = [];
        vm.workflowDef = workflowDef;
        vm.BaseStartCaseWorkflowController_getWorkflowInfo = vm.getWorkflowInfo;
        vm.getWorkflowInfo = getWorkflowInfo;
        vm.isValid = isValid;
        
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
            angular.merge(wi, {
                assignees: assignees,
                properties: {
                    wf_requiredApprovePercent: vm.requiredApprovalPercentage
                }
            });
            return wi;
        }
        
        function isValid(){
            return vm.selectedRecipients.length > 0 
                && vm.message != null 
                && vm.message.length > 0;
        }

    }