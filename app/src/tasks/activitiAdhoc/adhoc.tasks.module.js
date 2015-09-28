(function(){
    'use strict';
    angular.module('openeApp.adhoc.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    config.$inject = ['taskFormConfigServiceProvider'];
    
    function config(taskFormConfigServiceProvider){
        taskFormConfigServiceProvider.taskForm({
            taskName: 'wf:adhocTask',
            templateUrl: '/app/src/tasks/common/view/simpleTask.html',
            controller: 'simpleTaskController'
        }).taskForm({
            taskName: 'wf:completedAdhocTask',
            templateUrl: '/app/src/tasks/common/view/simpleTask.html',
            controller: 'simpleTaskController'
        });
    }
})();
