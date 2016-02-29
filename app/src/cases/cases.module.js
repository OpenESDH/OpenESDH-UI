    angular.module('openeApp.cases', [ 'openeApp.cases.common'])
        .config(config);
    
        function config(dashboardServiceProvider, modulesMenuServiceProvider){
            dashboardServiceProvider.addDashlet({
                templateUrl: 'app/src/cases/view/casesDashlet.html',
                position: 'left',
                order: 1
            });
            
            modulesMenuServiceProvider.addItem({
                templateUrl: 'app/src/cases/view/menuItem.html',
                order: 1
            });
        }
