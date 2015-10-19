    
    angular
        .module('openeApp.workflows')
        .controller('BaseStartCaseWorkflowController', BaseStartCaseWorkflowController);
    
    function BaseStartCaseWorkflowController($mdDialog, $stateParams, caseDocumentsService, $mdToast, $translate) {
        
        var vm = this;
        vm.forms = [];
        vm.init = init;
        vm.getWorkflowInfo = getWorkflowInfo;
        vm.submit = submit;
        vm.cancel = cancel;
        vm.appendForm = appendForm;
        vm.isValid = isValid;

        function init(){
            //set sub controller scope 
            vm = this;
            caseDocumentsService.getCaseDocumentsWithAttachments($stateParams.caseId).then(function(result){
                vm.documents = result;
            });
        }
        
        function cancel(){
            $mdDialog.cancel();
        }
        
        function submit(){
            var workflow = this.getWorkflowInfo();
            $mdDialog.hide(workflow);
            $mdToast.showSimple("'" + workflow.message + "' " + $translate.instant('WORKFLOW.STARTED'));
        }
        
        function getWorkflowInfo(){
            var workflow = {
                priority: vm.selectedPriority,
                message: vm.message,
                sendEmailNotifications: vm.sendEmailNotifications === true,
                dueDate: vm.selectedDueDate,
                items: _getSelectedDocuments(),
                properties: {
                    oe_caseId: $stateParams.caseId
                }
            };
            
            return workflow;
        }
        
        function appendForm(form){
            var vm = this;
            vm.forms.push(form);
        }
        
        function _getSelectedDocuments(){
            var items = [];
            for(var i in vm.documents){
                
                var doc = vm.documents[i];
                if(doc.selected === true){
                    items.push(doc.nodeRef);
                }
                
                for(var j in doc.attachments){
                    var attach = doc.attachments[j];
                    if(attach.selected === true){
                        items.push(attach.nodeRef);
                    }
                }
            }
            return items;
        }
        
        function isValid(currentStep){
            var vm = this;
            if(vm.forms[currentStep] === undefined){
                return true;
            }
            return vm.forms[currentStep].$valid;
        }
        
    }