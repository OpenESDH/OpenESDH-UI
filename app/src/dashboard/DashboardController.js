(function(){

    angular
        .module('openeApp.dashboard')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$scope', 'authService'];

    function DashboardController($scope, authService) {

        var originatorEv;
        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
    
    };
})();
