(function(){
    'use strict';
    angular.module('openeApp.activitiParallelReview.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    config.$inject = ['taskFormConfigServiceProvider'];
    
    function config(taskFormConfigServiceProvider){
        
        // The "wf:activitiReviewTask" task form configuration is defined in the activitiReview.tasks module.
        // Here we define only missing task form configurations. 
        
        taskFormConfigServiceProvider.taskForm({
            taskName: 'wf:approvedParallelTask',
            templateUrl: '/app/src/tasks/activitiParallelReview/view/approvedRejectedParallelTask.html',
            controller: 'simpleTaskController'
        }).taskForm({
            taskName: 'wf:rejectedParallelTask',
            templateUrl: '/app/src/tasks/activitiParallelReview/view/approvedRejectedParallelTask.html',
            controller: 'simpleTaskController'
        });
    }
})();
