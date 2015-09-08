(function(){

    angular
        .module('openeApp')
        .controller('FooterController', FooterController);

    FooterController.$inject = ['$scope', 'authService', 'serverVersionService'];

    function FooterController($scope, authService, serverVersionService) {
        var vm = this;

        activate();

        function activate() {
            vm.isDevelopmentMode = document.location.hostname == "localhost" ||
                document.location.hostname == "test.openesdh.dk";

            serverVersionService.getGitDetails().then(function (details) {
                vm.gitCommitId = details.gitCommitId;
                vm.gitBranch = details.gitBranch;
            });
        }
    }
})();
