(function () {
    'use strict';

    angular
        .module('openeApp.tasks.common')
        .factory('taskService', TaskService);

    TaskService.$inject = ['$http', 'sessionService'];

    function TaskService($http, sessionService) {
        return {
            getCurrentUserWorkflowTasks: getCurrentUserWorkflowTasks,
            getTaskDetails: getTaskDetails,
            updateTask: updateTask,
            endTask: endTask
        };

        function getCurrentUserWorkflowTasks() {
            
            var userInfo = sessionService.getUserInfo();
            
            //&state={state?}&priority={priority?}&pooledTasks={pooledTasks?}&dueBefore={dueBefore?}&dueAfter={dueAfter?}&properties={properties?}&maxItems={maxItems?}&skipCount={skipCount?}&exclude={exclude?}
            return $http.get("/alfresco/s/api/task-instances?authority=" + userInfo.user.userName).then(function (response) {
                return response.data.data;
            });
        }
        
        function getTaskDetails(taskId){
            var url = "/alfresco/s/api/openesdh/workflow/task/" + taskId + "/details";
            return $http.get(url).then(function(response){
               return response.data; 
            });
        }
        
        function updateTask(taskId, taskProperties){
            var url = "/alfresco/s/api/task-instances/" + taskId;
            return $http.put(url, taskProperties).then(function(response){
                return response.data; 
            });
        }
        
        function endTask(taskId){
            var url = "/alfresco/s/api/workflow/task/end/" + taskId;
            return $http.post(url).then(function(response){
                return response.data; 
            });
        }

    }
})();
