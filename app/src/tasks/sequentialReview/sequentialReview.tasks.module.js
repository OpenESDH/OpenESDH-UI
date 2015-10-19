
    angular
        .module('openeApp.sequentialReview.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    function config(taskFormConfigServiceProvider){
        taskFormConfigServiceProvider.taskForm({
            taskName: 'wf:activitiSequentialReviewTask',
            templateUrl: '/app/src/tasks/sequentialReview/view/sequentialReviewTask.html',
            controller: 'sequentialReviewTaskController'
        }).taskForm({
            taskName: 'wf:sequentialApprovedTask',
            templateUrl: '/app/src/tasks/sequentialReview/view/approvedRejectedTask.html',
            controller: 'sequentialReviewTaskController'
        }).taskForm({
            taskName: 'wf:sequentialRejectedTask',
            templateUrl: '/app/src/tasks/sequentialReview/view/approvedRejectedTask.html',
            controller: 'sequentialReviewTaskController'
        });
    }