    angular.module('openeApp.cases', [ 'openeApp.cases.common'])
        .config(config);
    
        function config(dashboardServiceProvider){
            dashboardServiceProvider.addDashlet({
                templateUrl: 'app/src/cases/view/casesDashlet.html',
                position: 'left',
                order: 1
            });
        }
