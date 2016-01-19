
    angular
        .module('openeApp.sequentialReview.tasks', ['openeApp.tasks.common'])
        .config(config);
    
    function config(taskFormConfigServiceProvider){
        taskFormConfigServiceProvider.taskForm({
            taskName: 'oewf:activitiSequentialReviewTask',
            templateUrl: 'app/src/tasks/sequentialReview/view/sequentialReviewTask.html',
            controller: 'sequentialReviewTaskController'
        }).taskForm({
            taskName: 'oewf:sequentialApprovedTask',
            templateUrl: 'app/src/tasks/sequentialReview/view/approvedRejectedTask.html',
            controller: 'sequentialReviewTaskController'
        }).taskForm({
            taskName: 'oewf:sequentialRejectedTask',
            templateUrl: 'app/src/tasks/sequentialReview/view/approvedRejectedTask.html',
            controller: 'sequentialReviewTaskController'
        });
    }