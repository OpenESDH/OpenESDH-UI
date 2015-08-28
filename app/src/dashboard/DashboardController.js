(function(){

    angular
        .module('openeApp')
        .controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['authService'];

    function DashboardController(authService) {
        authService.login('admin', 'admin').then(function(response) {
            console.log(response);
        });
    };
})();
