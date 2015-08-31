(function(){

    angular
        .module('openeApp.dashboard')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$scope', 'authService'];

    function DashboardController($scope, authService) {
        // This is just a hack, until we get a login page
        authService.login('admin', 'openeadmin').then(function(response) {
            console.log(response);
        });

        var originatorEv;
        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
    
    };
})();
