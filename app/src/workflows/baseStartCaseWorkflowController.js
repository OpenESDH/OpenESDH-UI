    
    angular
        .module('openeApp.workflows')
        .controller('BaseStartCaseWorkflowController', BaseStartCaseWorkflowController);
    
    function BaseStartCaseWorkflowController($mdDialog, $stateParams, caseDocumentsService, notificationUtilsService, $translate) {
        
        var vm = this;
        vm.init = init;
        vm.getWorkflowInfo = getWorkflowInfo;
        vm.submit = submit;
        vm.cancel = cancel;

        function init(){
            //set sub controller scope 
            vm = this;
            caseDocumentsService.getCaseDocumentsWithAttachments($stateParams.caseId).then(function(result){
                vm.documents = result;
            });
            vm.selectedPriority = 2; //default medium priority
        }
        
        function cancel(){
            $mdDialog.cancel();
        }
        
        function submit(){
            var workflow = this.getWorkflowInfo();
            $mdDialog.hide(workflow);
            notificationUtilsService.notify("'" + workflow.message + "' " + $translate.instant('WORKFLOW.STARTED'));
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
    }