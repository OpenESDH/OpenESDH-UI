    angular
        .module('openeApp.caseTemplates')
        .controller('CaseTemplateDialogController', CaseTemplateDialogController);
    
    function CaseTemplateDialogController($controller, $mdDialog, caseTemplatesService, workflowDefs, template){
        angular.extend(this, $controller('GenericWizardController', {}));
        angular.extend(this, $controller('CaseNodeDialogController', {}));
        var dlg = this;
        dlg.init = init;
        dlg.initPropsForEdit = initPropsForEdit;
        dlg.includeExtra = false;
        dlg.isNew = template.properties === undefined;
        dlg.submit = submit;
        dlg.cancel = cancel;
        dlg.template = {
            prop_oe_journalFacet: [],
            prop_oe_journalKey: []
        };
        dlg.workflowDefs = angular.copy(workflowDefs);
        
        function init(){
            var dlg = this;
            if(dlg.isNew){
                return;
            }
            dlg.initPropsForEdit();
            dlg.oldTemplate = angular.copy(dlg.template);
            
            var templateWorkflows = template.properties["ct:workflows"].value;
            angular.forEach(dlg.workflowDefs, function(workflow){
                if(templateWorkflows.indexOf(workflow.id) != -1){
                    workflow.selected = true;
                }
            });
        }
        
        function initPropsForEdit(){
            var dlg = this;
            dlg.templateNodeRef = template.properties.nodeRef;
            dlg.template = {};
            var propsForEdit = dlg.getCasePropsForEdit(template);                
            propsForEdit.prop_cm_name = template.properties["cm:name"].value;
            propsForEdit.owner = template.properties.owners[0].displayName;
            angular.extend(dlg.template, propsForEdit);
        }
                
        function submit(){
            var dlg = this;
            dlg.template.prop_ct_workflows = dlg.workflowDefs.filter(function(item){
                return item.selected;
            }).map(function(item){
                return item.id;
            });
            
            if(dlg.isNew){
                var props = dlg.retrievePropsToSave(dlg.template);
                caseTemplatesService.createTemplate(template.type, props).then(function(){
                    $mdDialog.hide();
                });
            }else{
                var props = dlg.retrievePropsToSave(dlg.template, dlg.oldTemplate);
                caseTemplatesService.updateTemplate(dlg.templateNodeRef, props).then(function(){
                    $mdDialog.hide();
                });
            }
        }
        
        function cancel(){
            $mdDialog.cancel();
        }
    }