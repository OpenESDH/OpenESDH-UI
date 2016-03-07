
    angular.module('openeApp.tasks', [ 
        'ngMaterial', 
        'openeApp.tasks.common', 
        'openeApp.adhoc.tasks', 
        'openeApp.activitiReview.tasks',
        'openeApp.activitiParallelReview.tasks',
        'openeApp.sequentialReview.tasks'
    ]).config(config);
    
    function config(dashboardServiceProvider, modulesMenuServiceProvider){
        dashboardServiceProvider.addDashlet({
            templateUrl: 'app/src/tasks/view/tasksDashlet.html',
            position: 'right',
            order: 1
        });
        modulesMenuServiceProvider.addItem({
            templateUrl: 'app/src/tasks/view/menuItem.html',
            order: 3
        });
    }