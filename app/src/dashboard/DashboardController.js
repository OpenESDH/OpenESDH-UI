(function(){

    angular
        .module('openeApp.dashboard')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$scope', 'authService'];

    function DashboardController($scope, authService) {
        var vm = this;

        
    }
})();
