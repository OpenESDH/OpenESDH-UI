
    angular
        .module('openeApp.tasks.common')
        .factory('taskService', TaskService);

    function TaskService($http, sessionService) {
        return {
            getTasks: getTasks,
            getCaseTasks: getCaseTasks,
            getCurrentUserWorkflowTasks: getCurrentUserWorkflowTasks,
            getTaskDetails: getTaskDetails,
            updateTask: updateTask,
            endTask: endTask,
            getTaskStatuses: getTaskStatuses
        };
        
        function getTasks(){
            if(!sessionService.isAdmin()){
                return this.getCurrentUserWorkflowTasks();
            }
            return $http.get("/api/openesdh/workflow/tasks").then(function (response) {
                return response.data.tasks;
            });
        }
        
        function getCaseTasks(caseId){
            return $http.get("/api/openesdh/case/" + caseId + "/tasks").then(function (response) {
                return response.data;
            });
        }
        
        function getCurrentUserWorkflowTasks() {
            var userInfo = sessionService.getUserInfo();
            //&state={state?}&priority={priority?}&pooledTasks={pooledTasks?}&dueBefore={dueBefore?}&dueAfter={dueAfter?}&properties={properties?}&maxItems={maxItems?}&skipCount={skipCount?}&exclude={exclude?}
            return $http.get("/api/task-instances?authority=" + userInfo.user.userName).then(function (response) {
                return response.data.data;
            });
        }
        
        function getTaskDetails(taskId){
            var url = "/api/openesdh/workflow/task/" + taskId + "/details";
            return $http.get(url).then(function(response){
               return response.data; 
            });
        }
        
        function updateTask(taskId, taskProperties){
            var url = "/api/task-instances/" + taskId;
            return $http.put(url, taskProperties).then(function(response){
                return response.data; 
            });
        }
        
        function endTask(taskId){
            var url = "/api/workflow/task/end/" + taskId;
            return $http.post(url).then(function(response){
                return response.data; 
            });
        }
        
        function getTaskStatuses(){
            return  ["Not Yet Started", "In Progres", "On Hold", "Cancelled", "Completed"];
        }

    }