(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('workflowService', WorkflowService);

    WorkflowService.$inject = ['$http'];

    function WorkflowService($http) {
        
        var service = {
            getWorkflowDefinitions: getWorkflowDefinitions,
            startWorkflow: startWorkflow
        };
        return service;
        
        function getWorkflowDefinitions(exclude){
            var url = "/alfresco/s/api/workflow-definitions?exclude=" + exclude;
            return $http.get(url).then(function(result){
                return result.data;
            });
        }
        
        /**
         * workflow = {
         *  workflowType, items, assignTo, workflowDueDate, workflowPriority, message, sendEmailNotifications
         * }
         */
        function startWorkflow(workflow){
           var url = "/alfresco/s/api/openesdh/workflow/start";
           return $http.post(url, workflow).then(function(result){
               return result.data;
           });
        }
        
    }
})();
