    
    angular
        .module('openeApp.workflows')
        .controller('BaseStartCaseWorkflowController', BaseStartCaseWorkflowController);
    
    function BaseStartCaseWorkflowController($mdDialog, $stateParams, caseDocumentsService, notificationUtilsService, $translate, $controller) {
        angular.extend(this, $controller('GenericWizardController', {}));
        var vm = this;
        
        vm.init = init;
        vm.getWorkflowInfo = getWorkflowInfo;
        vm.submit = submit;
        vm.caseId = $stateParams.caseId;
        vm.selectedDocuments = [];
        
        function init(){
            //set sub controller scope 
            vm = this;
            vm.selectedPriority = 2; //default medium priority
        }
        
        function submit(){
            var workflow = this.getWorkflowInfo();
            $mdDialog.hide(workflow);
            notificationUtilsService.notify("'" + workflow.message + "' " + $translate.instant('WORKFLOW.STARTED'));
        }
        
        function getWorkflowInfo(){
            var vm = this;
            var workflow = {
                priority: vm.selectedPriority,
                message: vm.message,
                sendEmailNotifications: vm.sendEmailNotifications === true,
                dueDate: vm.selectedDueDate,
                items: vm.selectedDocuments,
                properties: {
                    oe_caseId: $stateParams.caseId
                }
            };
            
            return workflow;
        }
        
    }