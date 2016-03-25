    angular
        .module('openeApp.caseTemplates')
        .factory('caseTemplateWorkflowSupplierService', caseTemplateWorkflowSupplierService);

    function caseTemplateWorkflowSupplierService(caseTemplatesService, alfrescoNodeUtils) {
        return {
            getAllowedWorkflows: getAllowedWorkflows
        };
        
        function getAllowedWorkflows(caseInfo){
            var templateRef = caseInfo.properties["cm:template"].value;
            return caseTemplatesService.getTemplateInfo(alfrescoNodeUtils.processNodeRef(templateRef).uri).then(function(template){
                var workflows = template.properties["ct:workflows"];
                if(workflows == undefined){
                    return []
                }
                return workflows.value;
            });
        }
    }