    
    angular
        .module('openeApp.workflows')
        .controller('StartMultiRecipientReviewWorkflowController', StartMultiRecipientReviewWorkflowController);
    
    function StartMultiRecipientReviewWorkflowController($controller, userService, workflowDef) {
        
        angular.extend(this, $controller('BaseStartCaseWorkflowController', {}));
        var vm = this;
        vm.selectedRecipients = [];
        vm.workflowDef = workflowDef;
        vm.BaseStartCaseWorkflowController_getWorkflowInfo = vm.getWorkflowInfo;
        vm.getWorkflowInfo = getWorkflowInfo;
        vm.searchRecipient = searchRecipient; 
        
        vm.BaseStartCaseWorkflowController_isValid = vm.isValid;
        vm.isValid = isValid;
        
        init();
        
        function init(){
            vm.init();
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
        
        function searchRecipient(){
            return userService.getPersons(vm.searchText).then(function(result){
                return result;
            });
        }

        function isValid(currentStep){
            return vm.BaseStartCaseWorkflowController_isValid(currentStep) && vm.selectedRecipients.length > 0;
        }
    }