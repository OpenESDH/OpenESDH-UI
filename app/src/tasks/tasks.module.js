
    angular.module('openeApp.tasks', [ 
        'ngMaterial', 
        'openeApp.tasks.common', 
        'openeApp.adhoc.tasks', 
        'openeApp.activitiReview.tasks',
        'openeApp.activitiParallelReview.tasks',
        'openeApp.sequentialReview.tasks'
    ]).config(config);
    
    function config(dashboardServiceProvider){
        dashboardServiceProvider.addDashlet({
            templateUrl: 'app/src/tasks/view/tasksDashlet.html',
            position: 'right',
            order: 1
        });
    }