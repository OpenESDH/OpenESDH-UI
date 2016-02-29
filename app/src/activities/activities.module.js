    angular.module('openeApp.activities', [])
        .config(config);
    
    function config(dashboardServiceProvider, modulesMenuServiceProvider){
        dashboardServiceProvider.addDashlet({
            templateUrl: 'app/src/activities/view/activitiesDashlet.html',
            position: 'left',
            order: 3
        });
        
        modulesMenuServiceProvider.addItem({
            templateUrl: 'app/src/activities/view/menuItem.html',
            order: 4
        });
    }