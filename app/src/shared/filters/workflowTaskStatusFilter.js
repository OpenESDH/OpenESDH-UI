(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('workflowTaskStatus', workflowTaskStatusFilterFactory);
    
    workflowTaskStatusFilterFactory.$inject = ['$translate'];
    
    function workflowTaskStatusFilterFactory($translate){
        function workflowTaskStatusFilter(taskStatus) {
            return $translate.instant('WORKFLOW.TASK.STATUS.' + taskStatus.replace( /\s/g, ""));
        }
        return workflowTaskStatusFilter;
    }
    
})();
    
