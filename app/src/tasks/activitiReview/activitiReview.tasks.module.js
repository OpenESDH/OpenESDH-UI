
    angular
        .module('openeApp.activitiReview.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    function config(taskFormConfigServiceProvider){
        taskFormConfigServiceProvider.taskForm({
            taskName: 'wf:activitiReviewTask',
            templateUrl: '/app/src/tasks/common/view/reviewTask.html',
            controller: 'reviewTaskController'
        }).taskForm({
            taskName: 'wf:approvedTask',
            templateUrl: '/app/src/tasks/common/view/completeTask.html',
            controller: 'simpleTaskController'
        }).taskForm({
            taskName: 'wf:rejectedTask',
            templateUrl: '/app/src/tasks/common/view/completeTask.html',
            controller: 'simpleTaskController'
        });
    }