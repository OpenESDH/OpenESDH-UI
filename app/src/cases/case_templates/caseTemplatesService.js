    angular
        .module('openeApp.caseTemplates')
        .factory('caseTemplatesService', caseTemplatesService);

    function caseTemplatesService($http, formProcessorService, alfrescoNodeUtils) {
        return {
            getTemplates: getTemplates,
            createTemplate: createTemplate,
            updateTemplate: updateTemplate,
            getTemplateInfo: getTemplateInfo,
            getTemplateDocs: getTemplateDocs
        };
        
        function getTemplates(caseType){
            return $http.get("/api/openesdh/case/templates/" + caseType).then(function(result){
                return result.data;
            });
        }
        
        function getTemplateInfo(nodeRef){
            return $http.get("/api/openesdh/case/template/" + nodeRef).then(function(result){
                return result.data;
            });
        }
        
        function getTemplateDocs(nodeRef){
            return $http.get("/api/openesdh/case/template/" + nodeRef + "/docs").then(function(result){
                return result.data;
            });
        }
        
        function createTemplate(caseType, props){
            return getTemplatesFolderRef().then(function(nodeRef){
                props.alf_destination = nodeRef;
                return formProcessorService.createNode(caseType, props);
            });
        }
        
        function updateTemplate(nodeRef, props){
            return formProcessorService.updateNode(nodeRef, props);
        }
        
        function getTemplatesFolderRef(){
            return $http.get('/api/openesdh/case/templates/folder').then(function(result){
                return result.data;
            });
        }
    }