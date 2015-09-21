(function () {
    'use strict';

    angular
        .module('openeApp.tasks')
        .factory('taskService', TaskService);

    TaskService.$inject = ['$http', 'sessionService'];

    function TaskService($http, sessionService) {
        return {
            getCurrentUserWorkflowTasks: getCurrentUserWorkflowTasks
        };

        function getCurrentUserWorkflowTasks() {
            
            var userInfo = sessionService.getUserInfo();
            
            //&state={state?}&priority={priority?}&pooledTasks={pooledTasks?}&dueBefore={dueBefore?}&dueAfter={dueAfter?}&properties={properties?}&maxItems={maxItems?}&skipCount={skipCount?}&exclude={exclude?}
            return $http.get("/alfresco/s/api/task-instances?authority=" + userInfo.user.userName).then(function (response) {
                return response.data.data;
            });
        }

    }
})();
