    angular
        .module('openeApp.adhoc.tasks')
        .filter('wf:adhocTaskTitle', wfAdhocTaskTitleFilterFactory);
    
    function wfAdhocTaskTitleFilterFactory($translate){
        function taskTitleFilter(task) {
            if(task == undefined || task == null){
                return '';
            }
            var wfInitiator = task.workflowInstance.initiator;
            
            return $translate.instant('TASK.ADHOC_TITLE', {initiator: wfInitiator.firstName + ' ' + wfInitiator.lastName});            
        }
        return taskTitleFilter;
    }