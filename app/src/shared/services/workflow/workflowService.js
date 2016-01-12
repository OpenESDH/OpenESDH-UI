
    angular
        .module('openeApp')
        .factory('workflowService', WorkflowService);

    function WorkflowService($http) {
        
        var service = {
            getWorkflowDefinitions: getWorkflowDefinitions,
            startWorkflow: startWorkflow,
            deleteWorkflow: deleteWorkflow
        };
        return service;
        
        function getWorkflowDefinitions(exclude){
            var url = "/api/workflow-definitions";
            var config = {};
            if(exclude != undefined && exclude != null){
                config.params.exclude = exclude;
            }
            return $http.get(url, config).then(function(result){
                return result.data;
            });
        }
        
        /**
         * workflow = {
         *  workflowType, items, assignTo, workflowDueDate, workflowPriority, message, sendEmailNotifications
         * }
         */
        function startWorkflow(workflow){
           var url = "/api/openesdh/workflow/start";
           return $http.post(url, workflow).then(function(result){
               return result.data;
           });
        }
        
        function deleteWorkflow(workflowInstanceId, forced){
            var url = "/api/workflow-instances/"+ workflowInstanceId;
            var config = {};
            if(forced){
                config.params.forced = forced;
            }
            return $http.delete(url, config).then(function(result){
                return result.data;
            });
        }
        
    }