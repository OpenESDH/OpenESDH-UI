
    angular
        .module('openeApp')
        .filter('workflowTaskStatus', workflowTaskStatusFilterFactory);
    
    function workflowTaskStatusFilterFactory($translate){
        function workflowTaskStatusFilter(taskStatus) {
            if(taskStatus == undefined){
                return '';
            }
            return $translate.instant('WORKFLOW.TASK.STATUS.' + taskStatus.replace( /\s/g, ""));
        }
        return workflowTaskStatusFilter;
    }