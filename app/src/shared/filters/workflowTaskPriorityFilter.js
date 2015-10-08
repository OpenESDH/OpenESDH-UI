
    angular
        .module('openeApp')
        .filter('workflowTaskPriority', workflowTaskPriorityFilterFactory);
    
    function workflowTaskPriorityFilterFactory($translate){
        function workflowTaskPriorityFilter(taskPriority) {
            return $translate.instant('WORKFLOW.TASK.PRIORITY.' + taskPriority);
        }
        return workflowTaskPriorityFilter;
    }
    