    angular
        .module('openeApp.caseTemplates', [])
        .config(config);

    function config(startCaseWorkflowServiceProvider){
        startCaseWorkflowServiceProvider.wfSupplier({
            canSupply: function(caseInfo){
                var template = caseInfo.properties["cm:template"]; 
                return  template != undefined && template != null && template.value != undefined;
            },
            supplierName: 'caseTemplateWorkflowSupplierService'
        });
    }