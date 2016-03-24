    angular
        .module('openeApp.caseTemplates')
        .provider('caseTemplateDialogService', caseTemplateDialogServiceProvider);
    
    function caseTemplateDialogServiceProvider(){
        
        var serviceConfig = [{
            type: 'simple:case',
            controller: 'CaseTemplateDialogController'
        }];
        
        this.$get = caseTemplateDialogService;
        this.dialogConfig = dialogConfig;
        
        function dialogConfig(conf){
            serviceConfig.push(conf);
        }
        
        function caseTemplateDialogService($mdDialog, startCaseWorkflowService){
            return {
                createTemplate: createTemplate,
                editTemplate: editTemplate
            };
            
            function createTemplate(type){
                return showTemplateDialog({type: type});
            }
            
            function editTemplate(template){
                return showTemplateDialog(template);
            }
            
            function showTemplateDialog(template){
                var controller = getController(template.type);
                return startCaseWorkflowService.getWorkflowDefinitions().then(function(workflowDefs){
                    return $mdDialog.show({
                        controller: controller,
                        controllerAs: 'vm',
                        templateUrl: 'app/src/cases/case_templates/view/caseTemplateCrudDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: true,
                        locals: {
                            workflowDefs: workflowDefs,
                            template: template
                        }
                    });
                });
            }
            
            function getController(type){
                for(var i=0; i<serviceConfig.length; i++){
                    if(serviceConfig[i].type == type){
                        return serviceConfig[i].controller;
                    }
                }
                console.log("ERROR: No controller found for the case template type: ", type);
            }
        }
    }
