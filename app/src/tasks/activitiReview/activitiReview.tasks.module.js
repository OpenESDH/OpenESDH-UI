(function(){
    'use strict';
    angular.module('openeApp.activitiReview.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    config.$inject = ['taskFormConfigServiceProvider'];
    
    function config(taskFormConfigServiceProvider){
        taskFormConfigServiceProvider.taskForm({
            taskName: 'wf:activitiReviewTask',
            templateUrl: '/app/src/tasks/common/view/reviewTask.html',
            controller: 'reviewTaskController'
        }).taskForm({
            taskName: 'wf:approvedTask',
            templateUrl: '/app/src/tasks/common/view/simpleTask.html',
            controller: 'simpleTaskController'
        }).taskForm({
            taskName: 'wf:rejectedTask',
            templateUrl: '/app/src/tasks/common/view/simpleTask.html',
            controller: 'simpleTaskController'
        });
    }
})();
