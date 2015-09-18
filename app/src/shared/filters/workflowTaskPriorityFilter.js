(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('workflowTaskPriority', workflowTaskPriorityFilterFactory);
    
    workflowTaskPriorityFilterFactory.$inject = ['$translate'];
    
    function workflowTaskPriorityFilterFactory($translate){
        function workflowTaskPriorityFilter(taskPriority) {
            return $translate.instant('WORKFLOW.TASK.PRIORITY.' + taskPriority);
        }
        return workflowTaskPriorityFilter;
    }
    
})();
    
